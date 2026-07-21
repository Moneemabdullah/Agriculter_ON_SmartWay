import { useEffect, useState } from 'react'
import { SensorCard } from './SensorCard'
import { Thermometer, Droplets, Wind, Activity, Sprout, MapPin, Calendar, Cpu } from 'lucide-react'
import { AnalyticsCharts } from './AnalyticsCharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import api from "@/api/axios"

interface IFirm {
  _id: string
  location: { latitude: number; longitude: number }
  crops: { _id: string; name: string } | string
  sensors?: { sensorId: string }[]
  plantationDate: string
}

export function DashboardOverview() {
  const [temperature, setTemperature] = useState(null)
  const [humidity, setHumidity] = useState(null)
  const [firms, setFirms] = useState<IFirm[]>([])

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const API_KEY = (import.meta as any).env?.VITE_OPEN_WEATHER
        const CITY = 'Comilla'

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
        )

        const data = await res.json()

        setTemperature(data.main.temp)
        setHumidity(data.main.humidity)
      } catch (error) {
        console.error('Weather fetch failed:', error)
      }
    }

    fetchWeather()

    const fetchFirms = async () => {
      try {
        const res = await api.get('/firms')
        setFirms(res.data?.data || [])
      } catch (err) {
        console.error('Failed to fetch firms:', err)
      }
    }
    fetchFirms()
  }, [])

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-sm text-gray-500">Real-time sensor readings and weather data</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <SensorCard
          title="Temperature"
          value={temperature ?? '--'}
          unit="°C"
          icon={Thermometer}
          status="normal"
          trend="up"
          change="Live"
          color="bg-red-500"
        />

        <SensorCard
          title="Humidity"
          value={humidity ?? '--'}
          unit="%"
          icon={Droplets}
          status="normal"
          trend="down"
          change="Live"
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

      {/* Firm Cards */}
      {firms.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Your Farms</h3>
            <Badge variant="secondary" className="bg-green-50 text-green-700">
              {firms.length} {firms.length === 1 ? 'farm' : 'farms'}
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {firms.map((firm) => (
              <Card key={firm._id} className="group hover:shadow-md transition-all duration-200 overflow-hidden">
                <div className="h-1 bg-green-500" />
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-green-50 rounded-lg text-green-600">
                      <Sprout className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
                      <Cpu className="h-3 w-3 mr-1" />
                      {firm.sensors?.length ?? 0} sensors
                    </Badge>
                  </div>
                  <CardTitle className="mt-3 text-base font-bold text-gray-800">
                    {typeof firm.crops === 'object' ? firm.crops?.name || 'Unnamed Crop' : 'Unnamed Crop'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    {firm.location?.latitude?.toFixed(2) ?? '—'}, {firm.location?.longitude?.toFixed(2) ?? '—'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    {firm.plantationDate ? new Date(firm.plantationDate).toLocaleDateString() : '—'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <AnalyticsCharts />
    </div>
  )
}
