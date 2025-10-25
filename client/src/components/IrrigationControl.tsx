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
      // When switching to Auto Mode, stop any manual irrigation
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

  // Helper to determine moisture level background color
  const getMoistureColor = (level: number) => {
    if (level < 40) return "bg-orange-500"; // Low (Warning)
    if (level < 70) return "bg-yellow-500"; // Adequate
    return "bg-green-600"; // Optimal (Healthy)
  };

  // Helper to determine moisture level text color
  const getMoistureTextColor = (level: number) => {
    if (level < 40) return "text-orange-500";
    if (level < 70) return "text-yellow-500";
    return "text-green-600";
  };

  return (
    <div className="space-y-8 p-6 md:p-10">
      <h2 className="text-3xl font-extrabold text-gray-800 text-center">Smart Agriculture and Monitoring</h2>
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 justify-center">
        {fields.map(field => (
          <Card 
            key={field.id} 
            className="rounded-3xl border-none shadow-xl bg-white/70 backdrop-blur-md transition-shadow hover:shadow-2xl w-full max-w-sm mx-auto"
          >
            <CardHeader className="p-6 pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="text-xl font-semibold text-gray-700">{field.name}</span>
                {/* Status Icon */}
                {field.autoMode ? (
                  <Zap className="h-6 w-6 text-green-500" />
                ) : field.isRunning ? (
                  <Droplets className="h-6 w-6 text-blue-500 animate-pulse" />
                ) : (
                  <PauseCircle className="h-6 w-6 text-gray-400" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Current Moisture Level - Large Display */}
              <div className="flex items-end justify-between">
                <div className="flex items-baseline gap-1">
                  <span className={`text-6xl font-extrabold ${getMoistureTextColor(field.moistureLevel)}`}>
                    {field.moistureLevel}
                  </span>
                  <span className="text-xl font-semibold text-gray-500">%</span>
                </div>
                {/* Visual Status bars for moisture (based on image reference) */}
                <div className="flex gap-1 h-8 items-end">
                    <div className={`w-2 rounded-full ${field.moistureLevel > 20 ? getMoistureColor(field.moistureLevel) : 'bg-gray-300'} h-3`}></div>
                    <div className={`w-2 rounded-full ${field.moistureLevel > 40 ? getMoistureColor(field.moistureLevel) : 'bg-gray-300'} h-5`}></div>
                    <div className={`w-2 rounded-full ${field.moistureLevel > 60 ? getMoistureColor(field.moistureLevel) : 'bg-gray-300'} h-7`}></div>
                    <div className={`w-2 rounded-full ${field.moistureLevel > 80 ? getMoistureColor(field.moistureLevel) : 'bg-gray-300'} h-9`}></div>
                </div>
              </div>

              {/* Moisture Range Visual (Bar - based on image reference) */}
              <div className="relative w-full h-12 flex items-center bg-gray-200/50 rounded-xl overflow-hidden p-1">
                <span className="absolute left-2 text-sm text-gray-500">Dry</span>
                <div
                  className={`absolute left-0 h-10 rounded-lg transition-all duration-300 ease-out ${getMoistureColor(field.moistureLevel)}`}
                  style={{ width: `${Math.max(20, field.moistureLevel)}%` }}
                />
                <span className="absolute right-2 text-sm text-gray-500">Wet</span>
              </div>

              {/* Auto Mode Switch */}
              <div className="flex items-center justify-between pt-4 pb-2 border-t border-gray-200">
                <Label htmlFor={`auto-${field.id}`} className="flex items-center gap-2 text-base font-medium text-gray-800 cursor-pointer">
                  <Zap className="h-5 w-5 text-green-600" />
                  Auto Mode
                </Label>
                <Switch
                  id={`auto-${field.id}`}
                  checked={field.autoMode}
                  onCheckedChange={() => toggleAutoMode(field.id)}
                  className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                />
              </div>

              {/* Duration Control (Manual Only) */}
              <div className={`space-y-3 transition-opacity duration-300 ${field.autoMode ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                <Label className="flex items-center justify-between text-base font-medium text-gray-800">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    Manual Duration
                  </div>
                  <span className="font-bold text-lg text-blue-600">{field.duration} min</span>
                </Label>
                <Slider
                  value={[field.duration]}
                  onValueChange={(value) => updateDuration(field.id, value)}
                  min={10}
                  max={120}
                  step={5}
                  // Custom Slider Styling for blue track (water) and clean thumb
                  className="w-full [&>span:first-child]:h-2 [&>span:first-child]:bg-gray-300 [&>span:first-child>span]:bg-blue-600 [&>span:last-child]:h-5 [&>span:last-child]:w-5 [&>span:last-child]:bg-blue-600 [&>span:last-child]:border-4 [&>span:last-child]:border-white"
                />
              </div>

              {/* Irrigation Button */}
              <Button
                onClick={() => toggleIrrigation(field.id)}
                className={`w-full text-base font-bold flex items-center justify-center py-3 rounded-xl transition-colors duration-200 ${
                  field.isRunning
                    ? "bg-red-500 hover:bg-red-600" // Stop (Red)
                    : "bg-green-600 hover:bg-green-700" // Start (Green - Agriculture)
                } ${field.autoMode ? "opacity-40 cursor-not-allowed" : ""}`}
                disabled={field.autoMode}
              >
                <Power className="mr-2 h-5 w-5" />
                {field.isRunning ? "Stop Irrigation" : "Start Irrigation"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}