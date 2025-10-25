import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
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

export function SettingsPanel() {
  return (
    <div className="space-y-6">
      <h2>Settings</h2>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="sensors">Sensors</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Abdullah Al Moneem" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="abdullah@smartagri.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+880 1712-345678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Farm Location</Label>
                <Input id="location" defaultValue="Dhaka, Bangladesh" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="asia-dhaka">
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asia-dhaka">Asia/Dhaka (GMT+6)</SelectItem>
                    <SelectItem value="asia-kolkata">Asia/Kolkata (GMT+5:30)</SelectItem>
                    <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="units">Temperature Unit</Label>
                <Select defaultValue="celsius">
                  <SelectTrigger id="units">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celsius">Celsius (°C)</SelectItem>
                    <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p>Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive alerts via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p>SMS Notifications</p>
                  <p className="text-sm text-gray-500">Receive critical alerts via SMS</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p>Push Notifications</p>
                  <p className="text-sm text-gray-500">Browser push notifications</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Thresholds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="temp-max">Maximum Temperature (°C)</Label>
                <Input id="temp-max" type="number" defaultValue="35" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moisture-min">Minimum Soil Moisture (%)</Label>
                <Input id="moisture-min" type="number" defaultValue="30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="humidity-min">Minimum Humidity (%)</Label>
                <Input id="humidity-min" type="number" defaultValue="40" />
              </div>
              <Button>Update Thresholds</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sensors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sensor Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sampling">Sampling Interval (minutes)</Label>
                <Select defaultValue="5">
                  <SelectTrigger id="sampling">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 minute</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p>Auto Calibration</p>
                  <p className="text-sm text-gray-500">Automatically calibrate sensors weekly</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p>Data Logging</p>
                  <p className="text-sm text-gray-500">Store historical sensor data</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ESP32 Devices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p>ESP32-Field-A</p>
                  <p className="text-sm text-gray-500">MAC: A4:CF:12:34:56:78</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p>ESP32-Field-B</p>
                  <p className="text-sm text-gray-500">MAC: A4:CF:12:34:56:79</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p>ESP32-Field-C</p>
                  <p className="text-sm text-gray-500">MAC: A4:CF:12:34:56:80</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Online</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Add New Device
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Irrigation Automation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p>Auto Irrigation</p>
                  <p className="text-sm text-gray-500">Enable automatic irrigation based on soil moisture</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="trigger">Trigger Moisture Level (%)</Label>
                <Input id="trigger" type="number" defaultValue="40" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Default Irrigation Duration (minutes)</Label>
                <Input id="duration" type="number" defaultValue="30" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Smart Schedules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p>Morning Irrigation</p>
                  <p className="text-sm text-gray-500">Daily at 6:00 AM</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p>Evening Irrigation</p>
                  <p className="text-sm text-gray-500">Daily at 6:00 PM</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p>Weather-based Adjustment</p>
                  <p className="text-sm text-gray-500">Skip irrigation if rain is forecasted</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button className="mt-4">Save Schedule</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
