import React, { useEffect, useState } from "react";
import api from "../..//utils/axios";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "../ui/card";
import { 
  Cpu, Activity, Database, AlertCircle, CheckCircle2, 
  Search, RefreshCw, Layers, Users, ShieldCheck, 
  ArrowUpRight, MoreHorizontal, Filter, Sprout
} from "lucide-react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface ISensor {
  _id: string;
  sensorId: string;
  status?: "online" | "offline" | "maintenance";
  lastPulse?: string;
  firmId?: string;
}

const Overview: React.FC = () => {
  const [sensors, setSensors] = useState<ISensor[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalFirms, setTotalFirms] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetching all data in parallel for speed
      const [sensorRes, userRes, firmRes] = await Promise.all([
        api.get("/sensors/all"),
        api.get("/users"), 
        api.get("/firms")
      ]);

      setSensors(sensorRes.data?.data || []);
      setTotalUsers(userRes.data?.data?.length || 0);
      setTotalFirms(firmRes.data?.data?.length || 0);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = {
    total: sensors.length,
    active: sensors.filter(s => s.status !== "offline").length,
    unlinked: sensors.filter(s => !s.firmId).length,
    health: sensors.length > 0 ? Math.round((sensors.filter(s => s.status === 'online').length / sensors.length) * 100) : 0
  };

  const filteredSensors = sensors.filter(s => 
    s.sensorId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-16 w-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
          <Database className="h-6 w-6 text-emerald-600" />
        </div>
        <p className="mt-8 text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">
          Initialising Core Systems...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 space-y-8 animate-in fade-in duration-500">
      
      {/* Top Header Section */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Live Infrastructure Monitoring
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Overview</h1>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search nodes..." 
              className="pl-10 bg-white border-slate-200 rounded-xl focus:ring-emerald-500 h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={fetchDashboardData} className="bg-slate-900 hover:bg-black text-white rounded-xl px-5 h-11">
            <RefreshCw className="mr-2 h-4 w-4" /> Sync
          </Button>
        </div>
      </header>

      {/* --- Main Statistics Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ModernStatCard 
          title="Total Sensors" 
          value={stats.total} 
          change={`${stats.health}% Health`}
          icon={<Cpu size={20} />} 
          color="bg-blue-600"
        />
        <ModernStatCard 
          title="Global Users" 
          value={totalUsers} 
          change="Live"
          icon={<Users size={20} />} 
          color="bg-violet-600"
        />
        <ModernStatCard 
          title="Active Firms" 
          value={totalFirms} 
          change="+4% MoM"
          icon={<Sprout size={20} />} 
          color="bg-emerald-600"
        />
        <ModernStatCard 
          title="Pending Sync" 
          value={stats.unlinked} 
          change="Needs Action"
          icon={<AlertCircle size={20} />} 
          color="bg-amber-500"
        />
      </div>

      {/* --- Data Table Section --- */}
      <Card className="border-none shadow-2xl shadow-slate-200/60 bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="px-8 pt-8 pb-4 flex flex-row items-center justify-between border-b border-slate-50">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900">Infrastructure Inventory</CardTitle>
            <p className="text-sm text-slate-400 mt-1">Direct access to hardware authentication nodes.</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-slate-600">
            <Filter className="h-4 w-4 mr-2" /> Filters
          </Button>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                  <th className="px-8 py-5">Node Status</th>
                  <th className="px-8 py-5">Hardware Identity</th>
                  <th className="px-8 py-5">Deployment</th>
                  <th className="px-8 py-5">System Logs</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredSensors.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/30 transition-all duration-200 group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`h-2.5 w-2.5 rounded-full ${s.status === 'offline' ? 'bg-rose-500' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse'}`} />
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-tighter">
                          {s.status || "Operational"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{s.sensorId}</span>
                        <span className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{s._id.slice(-8)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {s.firmId ? (
                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-full text-[10px] font-black tracking-widest">
                          <CheckCircle2 size={12} /> LINKED
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 w-fit px-3 py-1 rounded-full text-[10px] font-black tracking-widest">
                          <Activity size={12} /> STANDBY
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-600">Last Pulse</span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {s.lastPulse ? new Date(s.lastPulse).toLocaleString() : "Just now"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-300 hover:text-slate-600">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredSensors.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <Database className="h-12 w-12 text-slate-200 mb-4" />
                <h3 className="text-slate-400 font-bold uppercase text-xs tracking-widest">No hardware found</h3>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ModernStatCard = ({ title, value, change, icon, color }: any) => (
  <Card className="border-none shadow-lg shadow-slate-200/40 bg-white rounded-4xl group hover:-translate-y-1 transition-all duration-300">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} p-3 rounded-2xl text-white shadow-lg shadow-inherit`}>
          {icon}
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">
          <ArrowUpRight size={12} /> {change}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 mt-1">{value}</h3>
      </div>
    </CardContent>
  </Card>
);

export default Overview;