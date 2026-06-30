import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Power, Clock, Zap, Waves } from "lucide-react";

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
    { id: "1", name: "North Vineyard", autoMode: true, isRunning: false, moistureLevel: 45, duration: 30 },
    { id: "2", name: "East Orchard", autoMode: false, isRunning: true, moistureLevel: 72, duration: 45 },
    { id: "3", name: "Wheat Field", autoMode: true, isRunning: false, moistureLevel: 32, duration: 30 },
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

  const handleDurationChange = (id: string, value: number[]) => {
    setFields(fields.map(field =>
      field.id === id ? { ...field, duration: value[0] } : field
    ));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Irrigation Control</h2>
          <p className="text-sm text-gray-500">Manage field irrigation schedules and monitor moisture levels</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {fields.map(field => (
            <Card
              key={field.id}
              className="relative overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl"
            >
              {/* Active Status Glow */}
              {field.isRunning && (
                <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse" />
              )}

              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold text-green-700 uppercase tracking-wider bg-green-50 px-2 py-1 rounded-md">
                      Zone {field.id}
                    </span>
                    <CardTitle className="text-xl font-bold text-gray-900 mt-2">{field.name}</CardTitle>
                  </div>
                  <div className={`p-3 rounded-xl transition-all duration-500 ${field.isRunning ? 'bg-green-500 text-white rotate-12' : 'bg-gray-100 text-gray-400'}`}>
                    <Waves className={`h-5 w-5 ${field.isRunning ? 'animate-pulse' : ''}`} />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Moisture Card */}
                <div className="bg-green-800 rounded-xl p-5 text-white relative overflow-hidden">
                  <div className="relative z-10 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Moisture</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">{field.moistureLevel}</span>
                        <span className="text-lg font-bold opacity-40">%</span>
                      </div>
                    </div>
                    <div className="flex items-end gap-2 h-12">
                      {[20, 40, 60, 80, 100].map((v) => (
                        <div 
                          key={v}
                          className={`w-2 rounded-full transition-all duration-700 ${field.moistureLevel >= v ? 'bg-green-400' : 'bg-white/10'}`} 
                          style={{ height: `${v}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="absolute -right-4 -bottom-4 text-white/5 rotate-12">
                    <Waves size={80} />
                  </div>
                </div>

                <div className="space-y-5">
                  <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    field.autoMode 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Zap size={18} className={field.autoMode ? 'text-green-600' : 'text-gray-500'} />
                      <Label className="font-medium text-gray-900 text-sm cursor-pointer">Smart Auto-Mode</Label>
                    </div>
                    <Switch
                      checked={field.autoMode}
                      onCheckedChange={() => toggleAutoMode(field.id)}
                      className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-400"
                    />
                  </div>

                  <div className={`space-y-4 transition-all ${field.autoMode ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                    <div className="flex justify-between items-center px-1">
                      <span className="flex items-center gap-2 text-gray-900 font-medium text-xs uppercase tracking-wider">
                        <Clock size={14} className="text-green-600" /> Manual Duration
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-900 text-xs font-bold rounded-lg">
                        {field.duration} MIN
                      </span>
                    </div>

                    <Slider
                      value={[field.duration]}
                      onValueChange={(val) => handleDurationChange(field.id, val)}
                      max={120}
                      min={5}
                      step={5}
                      className="cursor-pointer"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => toggleIrrigation(field.id)}
                  disabled={field.autoMode}
                  className={`w-full h-12 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 ${
                    field.isRunning
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-green-700 hover:bg-green-800 text-white"
                  } ${field.autoMode ? 'bg-gray-100 text-gray-400 shadow-none border border-gray-200' : ''}`}
                >
                  {field.isRunning ? (
                    <><Power size={16} className="mr-2" /> Stop System</>
                  ) : (
                    <><Power size={16} className="mr-2" /> Run Field</>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
    </div>
  );
}