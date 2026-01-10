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

const irrigationData = [
  { month: 'Jan', waterUsed: 450 },
  { month: 'Feb', waterUsed: 380 },
  { month: 'Mar', waterUsed: 520 },
  { month: 'Apr', waterUsed: 680 },
  { month: 'May', waterUsed: 750 },
  { month: 'Jun', waterUsed: 820 },
];

export function AnalyticsCharts() {
  const [temperatureData, setTemperatureData] = useState<Array<any>>([]);

  // Generate last 7 days dynamically
  const generateSoilData = () => {
    const fields = ['A', 'B', 'C'];
    const today = new Date();
    const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const soilData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = daysMap[date.getDay()];

      soilData.push({
        day: dayName,
        fieldA: Math.floor(Math.random() * 20 + 50), // 50-70
        fieldB: Math.floor(Math.random() * 20 + 60), // 60-80
        fieldC: Math.floor(Math.random() * 20 + 45), // 45-65
      });
    }
    return soilData;
  };

  const [soilMoistureData] = useState<Array<any>>(generateSoilData());

  useEffect(() => {
    let mounted = true;

    const fetchWeatherData = async () => {
      try {
        const API_KEY = import.meta.env.VITE_OPEN_WEATHER;
        const CITY = "Comilla";

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&units=metric&appid=${API_KEY}`
        );
        const data = await res.json();

        if (data && data.list) {
          const dailyMap: any = {};
          
          data.list.forEach((item: any) => {
            const date = new Date(item.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            if (!dailyMap[dayName]) {
              dailyMap[dayName] = { tempSum: 0, humSum: 0, count: 0 };
            }
            dailyMap[dayName].tempSum += item.main.temp;
            dailyMap[dayName].humSum += item.main.humidity;
            dailyMap[dayName].count += 1;
          });

          const formattedData = Object.keys(dailyMap).map(day => ({
            day: day,
            temp: parseFloat((dailyMap[day].tempSum / dailyMap[day].count).toFixed(1)),
            humidity: parseFloat((dailyMap[day].humSum / dailyMap[day].count).toFixed(1))
          }));

          if (mounted) setTemperatureData(formattedData);
        }
      } catch (err) {
        console.error("Weather fetch failed:", err);
      }
    };

    fetchWeatherData();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Real Time Weather for 7 days</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={temperatureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" domain={['auto', 'auto']} stroke="#ef4444" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#3b82f6" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temp"
                stroke="#ef4444"
                name="Temp (°C)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="humidity"
                stroke="#3b82f6"
                name="Humidity (%)"
                strokeWidth={2}
                dot={{ r: 4 }}
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
              <Area type="monotone" dataKey="fieldA" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Field A" />
              <Area type="monotone" dataKey="fieldB" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Field B" />
              <Area type="monotone" dataKey="fieldC" stackId="3" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Field C" />
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
              <Bar dataKey="waterUsed" fill="#0ea5e9" name="Water Used (L)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
