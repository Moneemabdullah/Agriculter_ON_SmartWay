import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
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
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      <div className="max-w-6xl mx-auto">

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {fields.map(field => (
            <Card
              key={field.id}
              className="relative overflow-hidden border-none shadow-xl bg-white rounded-[2rem] transition-all duration-300 hover:shadow-2xl border border-gray-100"
            >
              {/* Active Status Glow */}
              {field.isRunning && (
                <div className="absolute top-0 left-0 w-full h-1 bg-[#7ab42c] shadow-[0_0_15px_rgba(122,180,44,0.8)] animate-pulse" />
              )}

              <CardHeader className="p-8 pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black text-[#7ab42c] uppercase tracking-[0.2em] bg-[#7ab42c]/10 px-2 py-1 rounded-md">
                      Zone {field.id}
                    </span>
                    <CardTitle className="text-2xl font-bold text-[#1a4d3c] mt-2">{field.name}</CardTitle>
                  </div>
                  <div className={`p-4 rounded-2xl transition-all duration-500 ${field.isRunning ? 'bg-[#7ab42c] text-white rotate-12' : 'bg-gray-100 text-gray-400'}`}>
                    <Waves className={`h-6 w-6 ${field.isRunning ? 'animate-pulse' : ''}`} />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-8">
                {/* Moisture Card - FarmHub Green Style */}
                <div className="bg-[#1a4d3c] rounded-[1.5rem] p-6 text-white relative overflow-hidden group">
                  <div className="relative z-10 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Moisture</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black italic">{field.moistureLevel}</span>
                        <span className="text-xl font-bold opacity-40">%</span>
                      </div>
                    </div>
                    {/* Visual Moisture Bars */}
                    <div className="flex items-end gap-2 h-14">
                      {[20, 40, 60, 80, 100].map((v) => (
                        <div 
                          key={v}
                          className={`w-2.5 rounded-full transition-all duration-700 ${field.moistureLevel >= v ? 'bg-[#7ab42c]' : 'bg-white/10'}`} 
                          style={{ height: `${v}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Subtle background decoration */}
                  <div className="absolute -right-4 -bottom-4 text-white/5 rotate-12">
                    <Waves size={100} />
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Smart Auto Mode - Gray BG Fix */}
                  <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    field.autoMode 
                    ? 'border-[#7ab42c]/40 bg-[#7ab42c]/5' 
                    : 'border-gray-200 bg-gray-100/80' 
                  }`}>
                    <div className="flex items-center gap-3">
                      <Zap size={20} className={field.autoMode ? 'text-[#7ab42c]' : 'text-gray-500'} />
                      <Label className="font-bold text-[#1a4d3c] text-sm cursor-pointer">Smart Auto-Mode</Label>
                    </div>
                    <Switch
                      checked={field.autoMode}
                      onCheckedChange={() => toggleAutoMode(field.id)}
                      className="data-[state=checked]:bg-[#7ab42c] data-[state=unchecked]:bg-gray-400"
                    />
                  </div>

                  {/* Slider Section - Gray Background Track Fix */}
                  <div className={`space-y-5 transition-all ${field.autoMode ? 'opacity-20 grayscale pointer-events-none' : 'opacity-100'}`}>
                    <div className="flex justify-between items-center px-1">
                      <span className="flex items-center gap-2 text-[#1a4d3c] font-bold text-xs uppercase tracking-tighter">
                        <Clock size={16} className="text-[#7ab42c]" /> Manual Duration
                      </span>
                      <span className="px-4 py-1.5 bg-gray-200 text-[#1a4d3c] text-xs font-black rounded-lg">
                        {field.duration} MIN
                      </span>
                    </div>
                    
                    {/* CUSTOM SLIDER STYLING */}
                    <Slider
                      value={[field.duration]}
                      onValueChange={(val) => handleDurationChange(field.id, val)}
                      max={120}
                      min={5}
                      step={5}
                      className={`cursor-pointer rounded-full h-3 bg-gray-200 border border-gray-300 [&_[role=slider]]:bg-[#1a4d3c] [&_[role=slider]]:border-[#7ab42c] [&_[role=slider]]:border-4`}
                    />
                  </div>
                </div>

                {/* Main Action Button */}
                <Button
                  onClick={() => toggleIrrigation(field.id)}
                  disabled={field.autoMode}
                  className={`w-full h-16 rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all shadow-xl active:scale-95 ${
                    field.isRunning
                      ? "bg-red-500 hover:bg-red-600 text-white shadow-red-100"
                      : "bg-[#1a4d3c] hover:bg-[#1a4d3c] text-white shadow-[#1a4d3c]/20"
                  } ${field.autoMode ? 'bg-gray-100 text-gray-300 shadow-none border border-gray-200' : ''}`}
                >
                  {field.isRunning ? (
                    <><Power size={18} className="mr-2" /> Stop System</>
                  ) : (
                    <><Power size={18} className="mr-2 text-[#7ab42c]" /> Run Field</>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}