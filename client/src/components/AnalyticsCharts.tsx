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

const temperatureData = [
  { time: '00:00', temp: 22, humidity: 65 },
  { time: '04:00', temp: 20, humidity: 70 },
  { time: '08:00', temp: 24, humidity: 60 },
  { time: '12:00', temp: 30, humidity: 50 },
  { time: '16:00', temp: 32, humidity: 45 },
  { time: '20:00', temp: 26, humidity: 55 },
];

const soilMoistureData = [
  { day: 'Mon', fieldA: 65, fieldB: 72, fieldC: 58 },
  { day: 'Tue', fieldA: 59, fieldB: 68, fieldC: 55 },
  { day: 'Wed', fieldA: 55, fieldB: 65, fieldC: 52 },
  { day: 'Thu', fieldA: 48, fieldB: 60, fieldC: 48 },
  { day: 'Fri', fieldA: 70, fieldB: 75, fieldC: 68 },
  { day: 'Sat', fieldA: 68, fieldB: 73, fieldC: 65 },
  { day: 'Sun', fieldA: 65, fieldB: 70, fieldC: 62 },
];

const irrigationData = [
  { month: 'Jan', waterUsed: 450 },
  { month: 'Feb', waterUsed: 380 },
  { month: 'Mar', waterUsed: 520 },
  { month: 'Apr', waterUsed: 680 },
  { month: 'May', waterUsed: 750 },
  { month: 'Jun', waterUsed: 820 },
];

export function AnalyticsCharts() {
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
