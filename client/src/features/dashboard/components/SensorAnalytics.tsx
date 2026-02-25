import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from 'recharts';
import api from "@/api/axios";

interface HourAvg {
  _id: string | Date;
  avgTemperature: number;
  avgHumidity: number;
  avgSoilMoisture: number;
}

export default function SensorAnalytics() {
  const [sensorId, setSensorId] = useState<string>('');
  const [sensorList, setSensorList] = useState<string[]>([]);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSensors = async () => {
      try {
        const res = await api.get('/firms');
        // collect sensors across firms
        const sensors: string[] = [];
        (res.data?.data || []).forEach((f: any) => {
          (f.sensors || []).forEach((s: any) => {
            if (s.sensorId) sensors.push(s.sensorId);
          });
        });
        if (mounted) {
          setSensorList(sensors);
          if (!sensorId && sensors.length > 0) setSensorId(sensors[0]);
        }
      } catch (e) {
        // ignore; user can manually enter sensor id
        console.warn('Failed to load firms/sensors', e);
      }
    };

    loadSensors();
    return () => { mounted = false; };
  }, []);

  // Accept being launched from Admin/Overview or Monitoring via localStorage
  useEffect(() => {
    try {
      const chosen = localStorage.getItem('dashboardSelectedSensor');
      if (chosen) {
        setSensorId(chosen);
        localStorage.removeItem('dashboardSelectedSensor');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!sensorId) return;
    let mounted = true;
    setLoading(true);
    setError(null);

    const fetchTelemetry = async () => {
      try {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];

        // 1) Hourly averages for today
        const hrRes = await api.get(`/telemetry/average/hour/${encodeURIComponent(sensorId)}/${dateStr}`);
        const hr = hrRes.data?.data || [];
        const formattedHourly = (hr as HourAvg[]).map((h) => ({
          ts: new Date(h._id).getTime(),
          temperature: typeof h.avgTemperature === 'number' ? parseFloat(h.avgTemperature.toFixed(1)) : null,
          humidity: typeof h.avgHumidity === 'number' ? parseFloat(h.avgHumidity.toFixed(1)) : null,
          soilMoisture: typeof h.avgSoilMoisture === 'number' ? parseFloat(h.avgSoilMoisture.toFixed(1)) : null,
        })).sort((a, b) => a.ts - b.ts);

        // 2) Daily averages for last 7 days (week)
        const wkRes = await api.get(`/telemetry/average/day/${encodeURIComponent(sensorId)}/week`);
        const wk = wkRes.data?.data || [];
        const formattedWeekly = (wk as any[]).map((d) => ({
          day: new Date(d._id).toLocaleDateString('en-US', { weekday: 'short' }),
          temperature: typeof d.avgTemperature === 'number' ? parseFloat(d.avgTemperature.toFixed(1)) : null,
          humidity: typeof d.avgHumidity === 'number' ? parseFloat(d.avgHumidity.toFixed(1)) : null,
          soilMoisture: typeof d.avgSoilMoisture === 'number' ? parseFloat(d.avgSoilMoisture.toFixed(1)) : null,
        }));

        if (mounted) {
          setHourlyData(formattedHourly as any[]);
          setWeeklyData(formattedWeekly as any[]);
        }
      } catch (err: any) {
        console.error('Telemetry fetch failed', err);
        if (mounted) setError(err?.response?.data?.message || 'Failed to load telemetry');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTelemetry();

    // poll every 30s for near real-time updates
    const interval = setInterval(fetchTelemetry, 30_000);
    return () => { mounted = false; clearInterval(interval); };
  }, [sensorId]);

  const latest = hourlyData.length ? hourlyData[hourlyData.length - 1] : null;

  const weeklyAvg = weeklyData.length ? weeklyData.reduce((acc, cur) => {
    if (typeof cur.temperature === 'number') acc.temperature += cur.temperature;
    if (typeof cur.humidity === 'number') acc.humidity += cur.humidity;
    if (typeof cur.soilMoisture === 'number') acc.soilMoisture += cur.soilMoisture;
    return acc;
  }, { temperature: 0, humidity: 0, soilMoisture: 0 }) : { temperature: 0, humidity: 0, soilMoisture: 0 };

  const weeklyCount = weeklyData.filter(d => typeof d.temperature === 'number').length || 1;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Sensor Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <select
              value={sensorId}
              onChange={(e) => setSensorId(e.target.value)}
              className="rounded border px-3 py-2"
            >
              <option value="">-- Select Sensor --</option>
              {sensorList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <input
              placeholder="Or enter Sensor ID"
              value={sensorId}
              onChange={(e) => setSensorId(e.target.value)}
              className="rounded border px-3 py-2"
            />

            <div className="text-sm text-gray-500">{loading ? 'Loading...' : (error ? `Error: ${error}` : 'Data pulled from telemetry')}</div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-3 border rounded">
              <div className="text-xs text-gray-500">Current Temp</div>
              <div className="text-lg font-semibold">{latest?.temperature ?? '-'} °C</div>
            </div>
            <div className="p-3 border rounded">
              <div className="text-xs text-gray-500">Current Humidity</div>
              <div className="text-lg font-semibold">{latest?.humidity ?? '-'} %</div>
            </div>
            <div className="p-3 border rounded">
              <div className="text-xs text-gray-500">Current Soil</div>
              <div className="text-lg font-semibold">{latest?.soilMoisture ?? '-'} %</div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Averages (Today)</CardTitle>
              </CardHeader>
              <CardContent>
                {hourlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="ts"
                        type="number"
                        domain={["dataMin", "dataMax"]}
                        tickFormatter={(v) => new Date(v).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      />
                      <YAxis />
                      <Tooltip labelFormatter={(v) => new Date(v as number).toLocaleString()} />
                      <Legend />

                      <Line type="monotone" dataKey="temperature" stroke="#ef4444" name="Temp (°C)" />
                      <Line type="monotone" dataKey="humidity" stroke="#3b82f6" name="Humidity (%)" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-sm text-gray-500">No hourly data for selected sensor / date.</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7-Day Averages</CardTitle>
              </CardHeader>
              <CardContent>
                {weeklyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />

                      <Area type="monotone" dataKey="temperature" stroke="#ef4444" fill="#ef4444" fillOpacity={0.08} name="Temp (°C)" />
                      <Area type="monotone" dataKey="humidity" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.06} name="Humidity (%)" />
                      <Area type="monotone" dataKey="soilMoisture" stroke="#10b981" fill="#10b981" fillOpacity={0.06} name="Soil Moisture (%)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-sm text-gray-500">No weekly data available for this sensor.</div>
                )}
              </CardContent>
            </Card>
          </div>

        </CardContent>
      </Card>

      {/* Summary Row */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Weekly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            <div>
              <div className="text-xs text-gray-500">7-day Avg Temp</div>
              <div className="text-lg font-semibold">{(weeklyAvg.temperature / weeklyCount).toFixed(1)} °C</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">7-day Avg Humidity</div>
              <div className="text-lg font-semibold">{(weeklyAvg.humidity / weeklyCount).toFixed(1)} %</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">7-day Avg Soil</div>
              <div className="text-lg font-semibold">{(weeklyAvg.soilMoisture / weeklyCount).toFixed(1)} %</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
