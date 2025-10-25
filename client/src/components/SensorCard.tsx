import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from './ui/utils'

interface SensorCardProps {
  title: string
  value: string
  unit: string
  icon: LucideIcon
  status: 'normal' | 'warning' | 'critical'
  trend?: 'up' | 'down'
  change?: string
  color: string
}

export function SensorCard({
  title,
  value,
  unit,
  icon: Icon,
  status,
  trend,
  change,
  color,
}: SensorCardProps) {
  const statusColors = {
    normal: 'text-green-600 bg-green-50',
    warning: 'text-yellow-600 bg-yellow-50',
    critical: 'text-red-600 bg-red-50',
  }

  return (
    <Card className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute inset-x-0 bottom-0 h-1 scale-x-0 bg-gradient-to-r from-sky-400 via-emerald-400 to-teal-500 transition-all duration-500 group-hover:scale-x-100" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold text-gray-700 tracking-wide">
          {title}
        </CardTitle>
        <div
          className={cn(
            'rounded-lg p-2 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110',
            color
          )}
        >
          <Icon className="h-5 w-5 text-white drop-shadow-sm" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
            {value}
          </div>
          <span className="text-sm text-gray-500">{unit}</span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium shadow-sm',
              statusColors[status]
            )}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>

          {trend && change && (
            <span
              className={cn(
                'flex items-center gap-1 text-xs font-semibold',
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trend === 'up' ? (
                <span className="inline-block transition-transform group-hover:-translate-y-0.5">
                  ↑
                </span>
              ) : (
                <span className="inline-block transition-transform group-hover:translate-y-0.5">
                  ↓
                </span>
              )}
              {change}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
