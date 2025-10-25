import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { useState } from 'react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  field?: string;
}

const initialAlerts: Alert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Low Soil Moisture',
    message: 'Soil moisture has dropped below 30% threshold. Immediate irrigation recommended.',
    timestamp: '2025-10-21T10:30:00',
    field: 'Field A',
  },
  {
    id: '2',
    type: 'warning',
    title: 'High Temperature Alert',
    message: 'Temperature has exceeded 35°C. Monitor crop stress levels.',
    timestamp: '2025-10-21T09:15:00',
    field: 'Field C',
  },
  {
    id: '3',
    type: 'success',
    title: 'Irrigation Completed',
    message: 'Automated irrigation cycle completed successfully. Soil moisture restored to optimal levels.',
    timestamp: '2025-10-21T08:45:00',
    field: 'Field B',
  },
  {
    id: '4',
    type: 'info',
    title: 'Sensor Data Update',
    message: 'All sensors are online and transmitting data normally.',
    timestamp: '2025-10-21T08:00:00',
  },
  {
    id: '5',
    type: 'warning',
    title: 'Low Humidity',
    message: 'Humidity levels below 40%. Consider misting system activation.',
    timestamp: '2025-10-21T07:30:00',
    field: 'Field A',
  },
];

const alertConfig = {
  critical: {
    icon: AlertTriangle,
    color: 'bg-red-100 text-red-800 border-red-200',
    iconColor: 'text-red-600',
  },
  warning: {
    icon: AlertTriangle,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    iconColor: 'text-yellow-600',
  },
  info: {
    icon: Info,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    iconColor: 'text-blue-600',
  },
  success: {
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800 border-green-200',
    iconColor: 'text-green-600',
  },
};

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000 / 60);
    
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2>System Alerts</h2>
        <Button variant="outline" size="sm">
          Mark All as Read
        </Button>
      </div>

      <div className="space-y-3">
        {alerts.map(alert => {
          const config = alertConfig[alert.type];
          const Icon = config.icon;
          
          return (
            <Card key={alert.id} className={`border ${config.color}`}>
              <CardContent className="flex items-start gap-3 p-4">
                <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      {alert.field && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {alert.field}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs opacity-70">{getTimeAgo(alert.timestamp)}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {alerts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
            <p className="text-gray-500">No alerts at this time</p>
            <p className="text-sm text-gray-400">All systems operating normally</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
