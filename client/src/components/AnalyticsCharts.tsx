import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";
import api from '../utils/axios';

// Fallback static irrigation data (kept unchanged)
const irrigationData = [
  { month: 'Jan', waterUsed: 450 },
  { month: 'Feb', waterUsed: 380 },
  { month: 'Mar', waterUsed: 520 },
  { month: 'Apr', waterUsed: 680 },
  { month: 'May', waterUsed: 750 },
  { month: 'Jun', waterUsed: 820 },
];

export function AnalyticsCharts() {
  const [loading, setLoading] = useState(true);
  const [temperatureData, setTemperatureData] = useState<Array<any>>([
    { time: '00:00', temp: 22, humidity: 65 },
    { time: '04:00', temp: 20, humidity: 70 },
    { time: '08:00', temp: 24, humidity: 60 },
    { time: '12:00', temp: 30, humidity: 50 },
    { time: '16:00', temp: 32, humidity: 45 },
    { time: '20:00', temp: 26, humidity: 55 },
  ]);
  const [soilMoistureData, setSoilMoistureData] = useState<Array<any>>([
    { day: 'Mon', fieldA: 65, fieldB: 72, fieldC: 58 },
    { day: 'Tue', fieldA: 59, fieldB: 68, fieldC: 55 },
    { day: 'Wed', fieldA: 55, fieldB: 65, fieldC: 52 },
    { day: 'Thu', fieldA: 48, fieldB: 60, fieldC: 48 },
    { day: 'Fri', fieldA: 70, fieldB: 75, fieldC: 68 },
    { day: 'Sat', fieldA: 68, fieldB: 73, fieldC: 65 },
    { day: 'Sun', fieldA: 65, fieldB: 70, fieldC: 62 },
  ]);
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let interval: number | null = null;

    const formatHour = (d: string | Date) => {
      const date = new Date(d);
      const h = date.getHours();
      return `${String(h).padStart(2, '0')}:00`;
    };

    const getLast7Days = () => {
      const days: Date[] = [];
      const end = new Date();
      end.setHours(0,0,0,0);
      for (let i = 6; i >= 0; i--) {
        const d = new Date(end);
        d.setDate(end.getDate() - i);
        days.push(d);
      }
      return days;
    };

    const dayLabel = (d: Date) => {
      return d.toLocaleDateString(undefined, { weekday: 'short' });
    };

    const fetchTelemetry = async () => {
      try {
        // Fetch sensors to determine which sensor(s) to use
        const sensorsRes = await api.get('/sensors');
        const sensors: Array<any> = sensorsRes?.data?.data || [];

        if (!sensors || sensors.length === 0) {
          // No sensors available: keep fallback static data
          setLoading(false);
          return;
        }

        const primarySensorId = sensors[0].sensorId;
        if (!selectedSensorId) setSelectedSensorId(primarySensorId);

        const sensorToUse = selectedSensorId || primarySensorId;

        // 1) Hourly averages for today for chosen sensor
        const today = new Date();
        const dateParam = today.toISOString().slice(0, 10); // YYYY-MM-DD
        const hourRes = await api.get(`/telemetry/average/hour/${encodeURIComponent(sensorToUse)}/${dateParam}`);
        const hourData: Array<any> = hourRes?.data?.data || [];

        // Map the aggregation results to chart data points
        const hourChart = hourData.map((p: any) => ({
          time: formatHour(p._id),
          temp: p.avgTemperature ? Number(p.avgTemperature.toFixed(2)) : null,
          humidity: p.avgHumidity ? Number(p.avgHumidity.toFixed(2)) : null,
        }));

        if (hourChart.length > 0 && mounted) setTemperatureData(hourChart);

        // 2) Weekly daily averages for up to 3 sensors (map to Field A/B/C)
        const sensorIdsForFields: string[] = [];
        for (let i = 0; i < 3; i++) {
          if (sensors[i]) sensorIdsForFields.push(sensors[i].sensorId);
        }
        // pad with primary if less than 3
        while (sensorIdsForFields.length < 3) sensorIdsForFields.push(primarySensorId);

        const days = getLast7Days();
        // fetch data for each sensor concurrently
        const weekPromises = sensorIdsForFields.map((sid) => api.get(`/telemetry/average/day/${encodeURIComponent(sid)}/week`));
        const weekResults = await Promise.allSettled(weekPromises);

        // build map arrays for each sensor
        const sensorMaps = weekResults.map((r) => {
          if (r.status !== 'fulfilled') return new Map<string, number>();
          const arr: Array<any> = r.value?.data?.data || [];
          const m = new Map<string, number>();
          arr.forEach((row) => {
            const key = new Date(row._id).toDateString();
            m.set(key, Number(row.avgSoilMoisture?.toFixed(2)));
          });
          return m;
        });

        const weeklyChart = days.map((d) => {
          const key = d.toDateString();
          return {
            day: dayLabel(d),
            fieldA: sensorMaps[0].has(key) ? sensorMaps[0].get(key) : null,
            fieldB: sensorMaps[1].has(key) ? sensorMaps[1].get(key) : null,
            fieldC: sensorMaps[2].has(key) ? sensorMaps[2].get(key) : null,
          };
        });

        if (mounted && weeklyChart.length > 0) setSoilMoistureData(weeklyChart);

      } catch (err) {
        console.warn('Failed to load telemetry data', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // initial fetch
    fetchTelemetry();
    // poll for updates every 30s
    interval = setInterval(() => { fetchTelemetry(); }, 30_000);

    // refresh on sensor updates or telemetry updates (other parts of app can dispatch these events)
    const onSensorsUpdated = () => fetchTelemetry();
    const onTelemetryUpdated = () => fetchTelemetry();
    window.addEventListener('sensors-updated', onSensorsUpdated);
    window.addEventListener('telemetry-updated', onTelemetryUpdated);

    return () => {
      mounted = false;
      if (interval) clearInterval(interval);
      window.removeEventListener('sensors-updated', onSensorsUpdated);
      window.removeEventListener('telemetry-updated', onTelemetryUpdated);
    };
  }, [selectedSensorId]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Temperature & Humidity (24 Hours)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={temperatureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="temp" 
                stroke="#ef4444" 
                name="Temperature (°C)"
                strokeWidth={2}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="humidity" 
                stroke="#3b82f6" 
                name="Humidity (%)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Soil Moisture Levels (Weekly)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={soilMoistureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="fieldA" 
                stackId="1"
                stroke="#10b981" 
                fill="#10b981"
                fillOpacity={0.6}
                name="Field A"
              />
              <Area 
                type="monotone" 
                dataKey="fieldB" 
                stackId="2"
                stroke="#3b82f6" 
                fill="#3b82f6"
                fillOpacity={0.6}
                name="Field B"
              />
              <Area 
                type="monotone" 
                dataKey="fieldC" 
                stackId="3"
                stroke="#f59e0b" 
                fill="#f59e0b"
                fillOpacity={0.6}
                name="Field C"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Water Usage (Liters)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={irrigationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="waterUsed" 
                fill="#0ea5e9" 
                name="Water Used (L)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
