import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Droplets, Power, Clock, Zap, PauseCircle } from "lucide-react";

interface Field {
  id: string;
  name: string;
  autoMode: boolean;
  isRunning: boolean;
  moistureLevel: number;
  duration: number;
}

export function IrrigationControl() {
  const [fields, setFields] = useState<Field[]>([
    { id: "1", name: "Field A", autoMode: true, isRunning: false, moistureLevel: 45, duration: 30 },
    { id: "2", name: "Field B", autoMode: false, isRunning: true, moistureLevel: 70, duration: 45 },
    { id: "3", name: "Field C", autoMode: true, isRunning: false, moistureLevel: 52, duration: 30 },
  ]);

  const toggleAutoMode = (id: string) => {
    setFields(fields.map(field =>
      field.id === id ? { ...field, autoMode: !field.autoMode, isRunning: false } : field
    ));
  };

  const toggleIrrigation = (id: string) => {
    setFields(fields.map(field =>
      field.id === id ? { ...field, isRunning: !field.isRunning } : field
    ));
  };

  const updateDuration = (id: string, value: number[]) => {
    setFields(fields.map(field =>
      field.id === id ? { ...field, duration: value[0] } : field
    ));
  };

  const getMoistureColor = (level: number) => {
    if (level < 40) return "bg-orange-500";
    if (level < 70) return "bg-yellow-500";
    return "bg-green-600";
  };

  const getMoistureTextColor = (level: number) => {
    if (level < 40) return "text-orange-500";
    if (level < 70) return "text-yellow-500";
    return "text-green-600";
  };

  return (
    <div className="p-4 md:p-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map(field => (
          <Card
            key={field.id}
            className="rounded-2xl border-none shadow-lg bg-white/80 backdrop-blur-md transition hover:shadow-xl w-full max-w-xs mx-auto"
          >
            <CardHeader className="p-4 pb-1">
              <CardTitle className="flex items-center justify-between">
                <span className="text-base font-semibold text-gray-700">{field.name}</span>
                {field.autoMode ? (
                  <Zap className="h-5 w-5 text-green-500" />
                ) : field.isRunning ? (
                  <Droplets className="h-5 w-5 text-blue-500 animate-pulse" />
                ) : (
                  <PauseCircle className="h-5 w-5 text-gray-400" />
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Moisture Display */}
              <div className="flex items-end justify-between">
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${getMoistureTextColor(field.moistureLevel)}`}>
                    {field.moistureLevel}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">%</span>
                </div>
                <div className="flex gap-0.5 h-6 items-end">
                  <div className={`w-1.5 rounded-full ${field.moistureLevel > 20 ? getMoistureColor(field.moistureLevel) : 'bg-gray-300'} h-2`}></div>
                  <div className={`w-1.5 rounded-full ${field.moistureLevel > 40 ? getMoistureColor(field.moistureLevel) : 'bg-gray-300'} h-3`}></div>
                  <div className={`w-1.5 rounded-full ${field.moistureLevel > 60 ? getMoistureColor(field.moistureLevel) : 'bg-gray-300'} h-4`}></div>
                  <div className={`w-1.5 rounded-full ${field.moistureLevel > 80 ? getMoistureColor(field.moistureLevel) : 'bg-gray-300'} h-5`}></div>
                </div>
              </div>

              {/* Moisture Bar */}
              <div className="relative w-full h-8 flex items-center bg-gray-200/50 rounded-lg overflow-hidden p-0.5">
                <div
                  className={`absolute left-0 h-7 rounded-lg transition-all duration-300 ease-out ${getMoistureColor(field.moistureLevel)}`}
                  style={{ width: `${Math.max(20, field.moistureLevel)}%` }}
                />
                <span className="absolute left-2 text-xs text-gray-500">Dry</span>
                <span className="absolute right-2 text-xs text-gray-500">Wet</span>
              </div>

              {/* Auto Mode */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <Label htmlFor={`auto-${field.id}`} className="flex items-center gap-1.5 text-sm font-medium text-gray-800 cursor-pointer">
                  <Zap className="h-4 w-4 text-green-600" />
                  Auto
                </Label>
                <Switch
                  id={`auto-${field.id}`}
                  checked={field.autoMode}
                  onCheckedChange={() => toggleAutoMode(field.id)}
                  className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                />
              </div>

              {/* Duration Control */}
              <div className={`space-y-1 transition-opacity duration-300 ${field.autoMode ? 'opacity-40 pointer-events-none' : ''}`}>
                <Label className="flex items-center justify-between text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-gray-500" />
                    Duration
                  </div>
                  <span className="font-semibold text-blue-600 text-sm">{field.duration} min</span>
                </Label>
                <Slider
                  value={[field.duration]}
                  onValueChange={(value) => updateDuration(field.id, value)}
                  min={10}
                  max={120}
                  step={5}
                  className="w-full [&>span:first-child]:h-1.5 [&>span:first-child]:bg-gray-300 [&>span:first-child>span]:bg-blue-600 [&>span:last-child]:h-4 [&>span:last-child]:w-4 [&>span:last-child]:bg-blue-600 [&>span:last-child]:border-2 [&>span:last-child]:border-white"
                />
              </div>

              {/* Start / Stop Button */}
              <Button
                onClick={() => toggleIrrigation(field.id)}
                className={`w-full text-sm font-semibold flex items-center justify-center py-2 rounded-lg transition-colors duration-200 ${
                  field.isRunning
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-600 hover:bg-green-700"
                } ${field.autoMode ? "opacity-40 cursor-not-allowed" : ""}`}
                disabled={field.autoMode}
              >
                <Power className="mr-1 h-4 w-4" />
                {field.isRunning ? "Stop" : "Start"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
