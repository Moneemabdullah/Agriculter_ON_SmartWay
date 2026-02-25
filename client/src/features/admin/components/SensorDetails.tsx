import React, { useEffect, useState } from 'react';
import api from "@/api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, ResponsiveContainer, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { X, ExternalLink } from 'lucide-react';

interface ISensor {
  _id: string;
  sensorId: string;
  status?: 'online' | 'offline' | 'maintenance';
  lastPulse?: string;
  firmId?: string;
}

interface Props {
  sensor: ISensor;
  onClose: () => void;
}

export default function SensorDetails({ sensor, onClose }: Props) {
  const [hourly, setHourly] = useState<any[]>([]);
  const [weekly, setWeekly] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const today = new Date().toISOString().split('T')[0];
        const hrRes = await api.get(`/telemetry/average/hour/${encodeURIComponent(sensor.sensorId)}/${today}`);
        const wkRes = await api.get(`/telemetry/average/day/${encodeURIComponent(sensor.sensorId)}/week`);

        const hr = (hrRes.data?.data || []).map((h: any) => ({
          ts: new Date(h._id).getTime(),
          temperature: typeof h.avgTemperature === 'number' ? parseFloat(h.avgTemperature.toFixed(1)) : null,
          humidity: typeof h.avgHumidity === 'number' ? parseFloat(h.avgHumidity.toFixed(1)) : null,
        }));

        const wk = (wkRes.data?.data || []).map((d: any) => ({
          day: new Date(d._id).toLocaleDateString('en-US', { weekday: 'short' }),
          temperature: typeof d.avgTemperature === 'number' ? parseFloat(d.avgTemperature.toFixed(1)) : null,
          humidity: typeof d.avgHumidity === 'number' ? parseFloat(d.avgHumidity.toFixed(1)) : null,
        }));

        if (mounted) {
          setHourly(hr);
          setWeekly(wk);
        }
      } catch (err: any) {
        console.error('Failed to fetch sensor telemetry', err);
        if (mounted) setError(err?.response?.data?.message || 'Failed to load telemetry');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [sensor.sensorId]);

  const latest = hourly.length ? hourly[hourly.length - 1] : null;

  const openInAnalytics = () => {
    // Set dashboard state and navigate to dashboard; ProtectedRoute will redirect to correct user id
    try {
      localStorage.setItem('dashboardActiveTab', 'sensor-analytics');
      localStorage.setItem('dashboardSelectedSensor', sensor.sensorId);
      const userId = localStorage.getItem('userId') || '';
      window.location.href = `/dashboard/${userId}`;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-4xl z-10">
        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="p-2 rounded-md text-slate-300 hover:bg-slate-800">
            <X />
          </button>
        </div>

        <Card>
          <CardHeader className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Sensor Details</CardTitle>
                <p className="text-sm text-slate-500">{sensor.sensorId}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={openInAnalytics}>
                  <ExternalLink className="mr-2" /> Open in Sensor Analytics
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-3">
              <div>
                <p className="text-xs text-slate-500 uppercase">Status</p>
                <p className="font-bold text-slate-900">{sensor.status || 'Active'}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase">Last Pulse</p>
                <p className="font-mono text-xs text-slate-700">{sensor.lastPulse ? new Date(sensor.lastPulse).toLocaleString() : 'N/A'}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase">Location</p>
                <p className="font-mono text-xs text-slate-700">{sensor.firmId || 'Unassigned'}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase">Actions</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button size="sm" variant="ghost">Mark Maintenance</Button>
                  <Button size="sm" variant="ghost">Ping</Button>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="h-40">
                {hourly.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hourly}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="ts" tickFormatter={(v) => new Date(v).toLocaleTimeString([], { hour: '2-digit' })} />
                      <YAxis />
                      <Tooltip labelFormatter={(v) => new Date(v as number).toLocaleString()} />
                      <Line type="monotone" dataKey="temperature" stroke="#f97316" dot={false} />
                      <Line type="monotone" dataKey="humidity" stroke="#3b82f6" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">No intraday data</div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-28">
                  <p className="text-xs text-slate-500 uppercase">Latest Temp</p>
                  <p className="text-2xl font-bold text-slate-900">{latest?.temperature ?? '--'} °C</p>
                </div>
                <div className="h-28">
                  <p className="text-xs text-slate-500 uppercase">Latest Humidity</p>
                  <p className="text-2xl font-bold text-slate-900">{latest?.humidity ?? '--'} %</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase">7-Day Trend</p>
                <div className="h-36">
                  {weekly.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weekly}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="temperature" stroke="#f97316" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">No weekly data</div>
                  )}
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
