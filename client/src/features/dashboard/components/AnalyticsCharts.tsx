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
  BarChart,
  Bar
} from "recharts";

const irrigationData = [
  { month: 'Jan', waterUsed: 450 },
  { month: 'Feb', waterUsed: 380 },
  { month: 'Mar', waterUsed: 520 },
  { month: 'Apr', waterUsed: 680 },
  { month: 'May', waterUsed: 750 },
  { month: 'Jun', waterUsed: 820 },
];

export function AnalyticsCharts() {
  // Temperature and Humidity state (Initialized empty)
  const [temperatureData, setTemperatureData] = useState<Array<any>>([]);

  // Helper: return array of last 7 Date objects for soil/mock data
  function getLast7Dates() {
    const arr: Date[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      arr.push(d);
    }
    return arr;
  }

  // Generate soil moisture mock data
  const generateSoilData = () => {
    const dates = getLast7Dates();
    return dates.map((date) => ({
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      fieldA: Math.floor(Math.random() * 20 + 50),
      fieldB: Math.floor(Math.random() * 20 + 60),
      fieldC: Math.floor(Math.random() * 20 + 45),
    }));
  };

  const [soilMoistureData] = useState<Array<any>>(generateSoilData());

  useEffect(() => {
    let mounted = true;

    const fetchWeatherData = async () => {
      try {
        const CITY = "Comilla";
        const last7 = getLast7Dates();
        const start = last7[0].toISOString().split('T')[0];
        const end = last7[6].toISOString().split('T')[0];

        // 1) Try Open-Meteo archive API for historical daily averages (no API key)
        try {
          const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(CITY)}&count=1`
          );
          const geo = await geoRes.json();

          if (geo && geo.results && geo.results.length > 0) {
            const { latitude: lat, longitude: lon } = geo.results[0];

            // Request hourly variables for the full range so we can plot ups/down curves
            const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&hourly=temperature_2m,relativehumidity_2m&timezone=UTC`;
            const resp = await fetch(url);
            const json = await resp.json();

            if (json && json.hourly && Array.isArray(json.hourly.time)) {
              const timeArr = json.hourly.time as string[];
              const temps = json.hourly.temperature_2m as number[] | undefined;
              const hums = json.hourly.relativehumidity_2m as number[] | undefined;

              // Build hourly points array: ts = milliseconds since epoch
              const hourlyPoints = timeArr.map((t, i) => ({
                ts: new Date(t).getTime(),
                temp: temps ? (typeof temps[i] === 'number' ? parseFloat(temps[i].toFixed(1)) : null) : null,
                humidity: hums ? (typeof hums[i] === 'number' ? parseFloat(hums[i].toFixed(1)) : null) : null,
              }));

              // Sort and set
              hourlyPoints.sort((a, b) => a.ts - b.ts);

              if (mounted) setTemperatureData(hourlyPoints as any);
              return; // success
            }
          }
        } catch (e) {
          // ignore and fallback to OpenWeather below
          console.warn('Open-Meteo fetch failed, falling back to OpenWeather:', e);
        }

        // 2) Fallback: OpenWeather forecast (may only cover ~5 days forward). We'll still map to the last 7 labels and fill missing days with nulls.
        const API_KEY = (import.meta as any).env?.VITE_OPEN_WEATHER;
        if (!API_KEY) {
          console.warn('No OpenWeather API key provided; cannot fetch fallback forecast');
          return;
        }

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&units=metric&appid=${API_KEY}`
        );
        const data = await res.json();

        if (data && data.list) {
          // Group by full date (YYYY-MM-DD)
          const dailyMap: any = {};

          data.list.forEach((item: any) => {
            const date = new Date(item.dt * 1000);
            const dateKey = date.toISOString().split('T')[0];

            if (!dailyMap[dateKey]) {
              dailyMap[dateKey] = { tempSum: 0, humSum: 0, count: 0 };
            }
            dailyMap[dateKey].tempSum += item.main.temp;
            dailyMap[dateKey].humSum += item.main.humidity;
            dailyMap[dateKey].count += 1;
          });

          const formattedData = last7.map((d) => {
            const key = d.toISOString().split('T')[0];
            if (dailyMap[key]) {
              return {
                day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                temp: parseFloat((dailyMap[key].tempSum / dailyMap[key].count).toFixed(1)),
                humidity: parseFloat((dailyMap[key].humSum / dailyMap[key].count).toFixed(1)),
              };
            }

            return {
              day: d.toLocaleDateString('en-US', { weekday: 'short' }),
              temp: null,
              humidity: null,
            };
          });

          // use raw daily averages (keep nulls) so the curve is smoothed by the chart renderer
          if (mounted) setTemperatureData(formattedData);
        }
      } catch (err) {
        console.error("Weather fetch failed:", err);
      }
    };

    fetchWeatherData();
    return () => { mounted = false; };
  }, []);

  const hasAnyWeatherData = temperatureData.some(d => typeof d.temp === 'number' || typeof d.humidity === 'number');

  // For daily categorical charts we use weekday labels, but when we have hourly data (ts) we create tick positions at day boundaries
  const last7Dates = getLast7Dates();
  const last7Labels = last7Dates.map(d => d.toLocaleDateString('en-US', { weekday: 'short' }));
  const last7DayTicks = last7Dates.map(d => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime());

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Weather Chart */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Real Time 7 days Average</CardTitle>
        </CardHeader>
        <CardContent>
          {hasAnyWeatherData ? (
            <ResponsiveContainer width="100%" height={300}>
              {/* If data includes timestamps (hourly series), render numeric time axis for curve visualization */}
              {temperatureData.length > 0 && (temperatureData[0] as any).ts ? (
                <LineChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    type="number"
                    dataKey="ts"
                    domain={["dataMin", "dataMax"]}
                    ticks={last7DayTicks}
                    tickFormatter={(v) => new Date(v as number).toLocaleDateString('en-US', { weekday: 'short' })}
                    stroke="#94a3b8"
                  />
                  <YAxis
                    yAxisId="left"
                    domain={["auto", "auto"]}
                    stroke="#ef4444"
                    label={{ value: '°C', angle: -90, position: 'insideLeft' }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    stroke="#3b82f6"
                    label={{ value: '%', angle: 90, position: 'insideRight' }}
                  />
                  <Tooltip
                    labelFormatter={(v) => new Date(v as number).toLocaleString('en-US', { weekday: 'short', hour: 'numeric' })}
                    formatter={(value: any) => (value === null || value === undefined ? '-' : value)}
                  />
                  <Legend />

                  {/* <Area type="monotone" dataKey="temp" stroke="#ef4444" fill="#ef4444" fillOpacity={0.06} isAnimationActive={false} legendType="none" />
                  <Area type="monotone" dataKey="humidity" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.04} isAnimationActive={false} legendType="none" /> */}

                  <Line
                    yAxisId="left"
                    type="basis"
                    dataKey="temp"
                    stroke="#ef4444"
                    name="Temp (°C)"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    connectNulls={false}
                  />

                  <Line
                    yAxisId="right"
                    type="basis"
                    dataKey="humidity"
                    stroke="#3b82f6"
                    name="Humidity (%)"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    connectNulls={false}
                  />
                </LineChart>
              ) : (
                <LineChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" ticks={last7Labels} stroke="#94a3b8" />
                  <YAxis
                    yAxisId="left"
                    domain={["auto", "auto"]}
                    stroke="#ef4444"
                    label={{ value: '°C', angle: -90, position: 'insideLeft' }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    stroke="#3b82f6"
                    label={{ value: '%', angle: 90, position: 'insideRight' }}
                  />
                  <Tooltip formatter={(value: any) => (value === null || value === undefined ? '-' : value)} />
                  <Legend />

                  <Area type="monotone" dataKey="temp" stroke="#ef4444" fill="#ef4444" fillOpacity={0.08} isAnimationActive={false} legendType="none" />
                  <Area type="monotone" dataKey="humidity" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.06} isAnimationActive={false} legendType="none" />

                  <Line
                    yAxisId="left"
                    type="basis"
                    dataKey="temp"
                    stroke="#ef4444"
                    name="Temp (°C)"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    connectNulls={true}
                  />

                  <Line
                    yAxisId="right"
                    type="basis"
                    dataKey="humidity"
                    stroke="#3b82f6"
                    name="Humidity (%)"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    connectNulls={true}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="flex h-75 items-center justify-center text-sm text-gray-500">
              Loading weather data or API key missing...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Soil Moisture Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Soil Moisture Levels (Past 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={soilMoistureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" ticks={last7Labels} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="fieldA" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.4} name="Field A" />
              <Area type="monotone" dataKey="fieldB" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} name="Field B" />
              <Area type="monotone" dataKey="fieldC" stackId="3" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} name="Field C" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Water Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Water Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={irrigationData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="waterUsed" fill="#0ea5e9" name="Liters (L)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}