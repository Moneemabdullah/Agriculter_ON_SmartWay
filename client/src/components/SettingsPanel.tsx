import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  User, 
  Bell, 
  Cpu, 
  Zap, 
  Save, 
  Plus, 
  Globe, 
  Thermometer, 
  Droplets,
  CloudRain
} from 'lucide-react';

import React, { useEffect, useState } from 'react';
import api from '../utils/axios';

export function SettingsPanel() {
  const [sensors, setSensors] = useState<Array<{_id:string, sensorId:string}>>([]);
  const [newSensorId, setNewSensorId] = useState('');

  const fetchSensors = async () => {
    try {
      const res = await api.get('/sensors');
      setSensors(res.data?.data || []);
    } catch (err) {
      console.warn('Failed to load sensors');
    }
  };

  useEffect(() => { fetchSensors(); }, []);

  const handleAddSensor = async () => {
    if (!newSensorId) return alert('Sensor id is required');
    try {
      const res = await api.post('/sensors', { sensorId: newSensorId });
      setNewSensorId('');
      fetchSensors();
      // notify other components to refresh sensors
      window.dispatchEvent(new Event('sensors-updated'));
      alert('Sensor added');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to add sensor');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6 pb-12">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h2>
        <p className="text-muted-foreground text-gray-500">
          Manage your account, notification preferences, and sensor automation rules.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mb-8 bg-gray-100/80 p-1">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <User size={16} /> General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell size={16} /> Alerts
          </TabsTrigger>
          <TabsTrigger value="sensors" className="flex items-center gap-2">
            <Cpu size={16} /> Sensors
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap size={16} /> Automation
          </TabsTrigger>
        </TabsList>

        {/* --- GENERAL TAB --- */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="text-green-600" size={20} /> Profile Settings
                </CardTitle>
                <CardDescription>Personal details and farm contact info.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Abdullah Al Moneem" className="bg-gray-50/50" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="abdullah@smartagri.com" className="bg-gray-50/50" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Primary Farm Location</Label>
                  <Input id="location" defaultValue="Dhaka, Bangladesh" className="bg-gray-50/50" />
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Save className="mr-2" size={16} /> Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="text-green-600" size={20} /> Regional & Units
                </CardTitle>
                <CardDescription>Configure localization preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="asia-dhaka">
                    <SelectTrigger className="bg-gray-50/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-dhaka">Asia/Dhaka (GMT+6)</SelectItem>
                      <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="units">Measurement Units</Label>
                  <Select defaultValue="celsius">
                    <SelectTrigger className="bg-gray-50/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celsius">Celsius (°C) / Metric</SelectItem>
                      <SelectItem value="fahrenheit">Fahrenheit (°F) / Imperial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- NOTIFICATIONS TAB --- */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Alert Channels</CardTitle>
              <CardDescription>Choose how you want to be notified of critical events.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-0">
              <div className="flex items-center justify-between py-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Reports and system health logs</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-4">
                <div className="space-y-0.5">
                  <Label className="text-base">SMS Critical Alerts</Label>
                  <p className="text-sm text-gray-500">Immediate alerts for moisture drops</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Threshold Configuration</CardTitle>
              <CardDescription>Define system-wide limits before alerts are triggered.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Thermometer size={14} /> Max Temp (°C)</Label>
                <Input type="number" defaultValue="35" className="bg-gray-50/50 border-orange-200 focus:border-orange-500" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Droplets size={14} /> Min Moisture (%)</Label>
                <Input type="number" defaultValue="30" className="bg-gray-50/50 border-blue-200 focus:border-blue-500" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><CloudRain size={14} /> Min Humidity (%)</Label>
                <Input type="number" defaultValue="40" className="bg-gray-50/50 border-cyan-200 focus:border-cyan-500" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- SENSORS TAB --- */}
        <TabsContent value="sensors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-green-700">Data Lifecycle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label>Sampling Interval</Label>
                  <Select defaultValue="5">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">High Frequency (1m)</SelectItem>
                      <SelectItem value="5">Standard (5m)</SelectItem>
                      <SelectItem value="30">Power Saver (30m)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between py-2">
                  <Label>Auto Calibration</Label>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 shadow-sm border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Connected ESP32 Nodes</CardTitle>
                  <CardDescription>Live hardware status in the field.</CardDescription>
                </div>
                {/* replaced Add Node with inline add sensor form */}
                <div className="flex items-center gap-3">
                  <input value={newSensorId} onChange={(e) => setNewSensorId(e.target.value)} placeholder="Sensor ID e.g. S-abc123" className="rounded-lg border p-2 text-sm" />
                  <Button size="sm" variant="outline" className="text-green-600 border-green-200" onClick={handleAddSensor}>
                    <Plus size={16} className="mr-1" /> Add Node
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3" id="nodes-list">
                {sensors.length === 0 ? (
                  <div className="text-sm text-gray-500">No nodes added yet.</div>
                ) : (
                  sensors.map((s) => (
                    <div key={s._id} className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm hover:border-green-200 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Cpu className="text-green-600" size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{s.sensorId}</p>
                          <p className="text-xs font-mono text-gray-400">ID: {s._id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        Online
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- AUTOMATION TAB --- */}
        <TabsContent value="automation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-blue-500 shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Irrigation Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between bg-blue-50/50 p-3 rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-blue-900">Auto-Irrigation</Label>
                    <p className="text-xs text-blue-700/70">Enabled by soil moisture sensors</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Start Threshold (%)</Label>
                    <Input type="number" defaultValue="40" className="bg-gray-50" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Stop Duration (mins)</Label>
                    <Input type="number" defaultValue="30" className="bg-gray-50" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Smart Scheduling</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Morning Cycle', time: '6:00 AM', icon: <Zap size={14}/> },
                  { name: 'Weather Guard', desc: 'Skip if rain forecast > 40%', icon: <CloudRain size={14}/> }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50/30">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-md border shadow-sm text-gray-500">{item.icon}</div>
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.time || item.desc}</p>
                      </div>
                    </div>
                    <Switch defaultChecked={idx === 0} />
                  </div>
                ))}
                <Button className="w-full mt-2" variant="secondary">Edit Schedules</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}