import { SensorCard } from './SensorCard'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Thermometer, Droplets, Wind, Activity } from 'lucide-react'
import { AnalyticsCharts } from './AnalyticsCharts'
import { ImageWithFallback } from './figma/ImageWithFallback'

export function DashboardOverview() {
  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Sensor Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <SensorCard
          title="Temperature"
          value="28.5"
          unit="°C"
          icon={Thermometer}
          status="normal"
          trend="up"
          change="1.2°C"
          color="bg-red-500"
        />
        <SensorCard
          title="Humidity"
          value="62"
          unit="%"
          icon={Droplets}
          status="normal"
          trend="down"
          change="3%"
          color="bg-blue-500"
        />
        <SensorCard
          title="Soil Moisture"
          value="45"
          unit="%"
          icon={Wind}
          status="warning"
          trend="down"
          change="8%"
          color="bg-amber-500"
        />
        <SensorCard
          title="System Status"
          value="98"
          unit="% Uptime"
          icon={Activity}
          status="normal"
          color="bg-green-500"
        />
      </div>

      {/* Overview + Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-xl border border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold tracking-wide text-gray-800">
              Field Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1715194717972-bc42451ec72c"
                alt="Agricultural field"
                className="h-full w-full object-cover rounded-md"
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              {[
                { label: 'Active Fields', value: 3, color: 'text-green-600' },
                { label: 'Sensors Online', value: 12, color: 'text-blue-600' },
                { label: 'Alerts Pending', value: 1, color: 'text-amber-600' },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="rounded-lg border border-gray-100 bg-white hover:bg-gray-50 p-3 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-sm font-medium text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-xl transition-shadow rounded-xl border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold tracking-wide text-gray-800">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                icon: Droplets,
                iconColor: 'text-green-500',
                text: 'Irrigation completed in Field B',
                time: '15 minutes ago',
              },
              {
                icon: Thermometer,
                iconColor: 'text-red-500',
                text: 'High temperature alert in Field A',
                time: '1 hour ago',
              },
              {
                icon: Activity,
                iconColor: 'text-blue-500',
                text: 'All sensors synchronized',
                time: '2 hours ago',
              },
              {
                icon: Wind,
                iconColor: 'text-purple-500',
                text: 'Soil moisture updated',
                time: '3 hours ago',
              },
            ].map(({ icon: Icon, iconColor, text, time }) => (
              <div
                key={text}
                className="flex items-start gap-3 text-sm hover:bg-gray-50 rounded-md p-2 transition-colors"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 ${iconColor}`}
                >
                  <Icon className="h-5 w-5 stroke-[1.8]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{text}</p>
                  <p className="text-xs text-gray-500">{time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <AnalyticsCharts />
    </div>
  )
}
