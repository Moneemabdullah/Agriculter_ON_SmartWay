import { useEffect, useState } from 'react'
import { SensorCard } from './SensorCard'
import { Thermometer, Droplets, Wind, Activity } from 'lucide-react'
import { AnalyticsCharts } from './AnalyticsCharts'

export function DashboardOverview() {
  const [temperature, setTemperature] = useState(null)
  const [humidity, setHumidity] = useState(null)

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
  }, [])

  return (
    <div className="space-y-8 p-4 md:p-6">
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

      <AnalyticsCharts />
    </div>
  )
}
