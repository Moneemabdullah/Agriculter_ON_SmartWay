import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import { Card, CardContent } from "../ui/card";
import { 
  Activity, Wifi, Battery, MapPin, AlertTriangle, 
  RefreshCw, SignalHigh, Timer, ShieldCheck, Zap
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface ISensor {
  _id: string;
  sensorId: string;
  status?: "online" | "offline" | "maintenance";
  lastPulse?: string;
  firmId?: string;
}

const Monitoring: React.FC = () => {
  const [sensors, setSensors] = useState<ISensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const fetchSensors = async () => {
    setLoading(true);
    try {
      const res = await api.get("/sensors/all");
      setSensors(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch sensors", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  const filteredSensors = sensors.filter(s => {
    if (filter === "online") return s.status !== "offline";
    if (filter === "offline") return s.status === "offline";
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#09090b] text-emerald-500">
        <RefreshCw className="h-12 w-12 animate-spin mb-4" />
        <p className="font-mono text-sm tracking-[0.3em] animate-pulse">INITIALIZING DATA STACK...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-200 p-6 font-sans">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
            <h1 className="text-xl font-bold tracking-tight text-white uppercase font-mono">
              System Observer <span className="text-slate-500">v2.4.0</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-mono">Network latency: 24ms | Active Nodes: {sensors.length}</p>
        </div>

        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-sm">
          {["all", "online", "offline"].map((f) => (
            <Button
              key={f}
              variant="ghost"
              onClick={() => setFilter(f)}
              className={`h-8 px-4 text-[10px] font-mono uppercase rounded-none transition-all ${
                filter === f ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* SENSOR GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {filteredSensors.map((s) => (
          <Card key={s._id} className="bg-[#111113] border-slate-800 border-l-2 border-l-orange-500 rounded-none hover:bg-[#161618] transition-colors">
            <CardContent className="p-4">

              <div className="flex justify-between items-center mb-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-slate-500 uppercase leading-none">Node ID</p>
                  <h3 className="text-sm font-bold text-emerald-400 font-mono tracking-wider">{s.sensorId}</h3>
                </div>
                <Badge className={`rounded-none font-mono text-[10px] uppercase ${
                  s.status === 'offline' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  {s.status || 'Active'}
                </Badge>
              </div>

              <div className="space-y-4 mb-6">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase">
                    <span className="flex items-center gap-1"><SignalHigh size={12}/> Signal Strength</span>
                    <span>{s.status === 'offline' ? '0%' : '94%'}</span>
                  </div>
                  <div className="h-1 bg-slate-800 w-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${s.status === 'offline' ? 'w-0' : 'w-[94%] bg-emerald-500'}`} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase">
                    <span className="flex items-center gap-1"><Zap size={12}/> Power Efficiency</span>
                    <span>{s.status === 'offline' ? '0%' : '82%'}</span>
                  </div>
                  <div className="h-1 bg-slate-800 w-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${s.status === 'offline' ? 'w-0' : 'w-[82%] bg-orange-500'}`} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-slate-800 pt-4 mt-2 font-mono">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase">Last Pulse</p>
                  <p className="text-[11px] text-slate-300">
                    {s.lastPulse ? new Date(s.lastPulse).toLocaleTimeString() : "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-500 uppercase">Location</p>
                  <p className="text-[11px] text-slate-300 truncate">
                    {s.firmId ? "ZONE_ALPHA_01" : "UNASSIGNED"}
                  </p>
                </div>
              </div>

              {/* Status Action Bar */}
              <div className={`mt-4 py-1 px-2 border flex items-center gap-2 ${
                s.status === 'offline' 
                ? 'bg-red-950/20 border-red-900/50 text-red-500' 
                : 'bg-emerald-950/20 border-emerald-900/50 text-emerald-500'
              }`}>
                {s.status === 'offline' ? <AlertTriangle size={12}/> : <ShieldCheck size={12}/>}
                <span className="text-[9px] font-bold uppercase tracking-tighter">
                  {s.status === 'offline' ? "Critical: Heartbeat Lost" : "Stability: Nominal"}
                </span>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSensors.length === 0 && (
        <div className="flex flex-col items-center justify-center py-40 border border-dashed border-slate-800">
          <Activity className="h-10 w-10 text-slate-800 mb-4" />
          <p className="font-mono text-xs text-slate-600 uppercase">No active streams detected in this sector</p>
        </div>
      )}
    </div>
  );
};

export default Monitoring;