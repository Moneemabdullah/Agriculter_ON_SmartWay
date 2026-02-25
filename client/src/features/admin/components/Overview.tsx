import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Cpu, Activity, Database, AlertCircle, CheckCircle2, 
  Search, RefreshCw, Layers, Users, ShieldCheck, 
  ArrowUpRight, MoreHorizontal, Filter, Sprout
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import SensorDetails from './SensorDetails';

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
  const [selectedSensor, setSelectedSensor] = useState<ISensor | null>(null);

  const [totalSensors, setTotalSensors] = useState(0);
  const [systemHealth, setSystemHealth] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const fetchDashboardData = async () => {
    setLoading(true);

    // fetch users (unprotected)
    try {
      const userRes = await api.get('/users');
      setTotalUsers(userRes.data?.data?.length || 0);
    } catch (e) {
      console.warn('Failed to fetch users', e);
      setTotalUsers(0);
    }

    // fetch sensors (admin endpoint)
    try {
      const sensorRes = await api.get('/sensors/all');
      setSensors(sensorRes.data?.data || []);
      setTotalSensors(sensorRes.data?.data?.length || 0);

      // compute fallback health
      const health = sensorRes.data?.data ? Math.round((sensorRes.data.data.filter((s:any)=>s.status!="offline").length / (sensorRes.data.data.length||1)) * 100) : 0;
      setSystemHealth(health);
    } catch (e) {
      console.warn('Failed to fetch /sensors/all (may require admin). Falling back to user-scoped sensors endpoint', e);
      // Try to fetch user-scoped sensors
      try {
        const res = await api.get('/sensors');
        setSensors(res.data?.data || []);
        setTotalSensors(res.data?.data?.length || 0);
        const health = res.data?.data ? Math.round((res.data.data.filter((s:any)=>s.status!="offline").length / (res.data.data.length||1)) * 100) : 0;
        setSystemHealth(health);
      } catch (er) {
        console.warn('Failed to fetch any sensors', er);
        setSensors([]);
        setTotalSensors(0);
        setSystemHealth(0);
      }
    }

    // fetch firms count (optional)
    try {
      const firmRes = await api.get('/firms');
      setTotalFirms(firmRes.data?.data?.length || 0);
    } catch (e) {
      console.warn('Failed to fetch firms', e);
      setTotalFirms(0);
    }

    // Try to get admin summary (counts & health & balance)
    try {
      const summary = await api.get('/admin/summary');
      const d = summary.data?.data || {};
      if (typeof d.totalSensors === 'number') setTotalSensors(d.totalSensors);
      if (typeof d.onlinePercent === 'number') setSystemHealth(d.onlinePercent);
      if (typeof d.totalBalance === 'number') setTotalBalance(d.totalBalance);
    } catch (e) {
      console.warn('Failed to fetch /admin/summary (likely not admin). Using computed values', e);
    }

    setLoading(false);
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
              Dashboard
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search sensors or transactions..." 
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

      {/* --- Financial Summary (new) --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <FinanceCard title="Total Users" value={totalUsers} color="bg-emerald-600" loading={loading} />
        <FinanceCard title="Total Sensors" value={totalSensors} color="bg-blue-600" loading={loading} />
        <FinanceCard title="System Health" value={`${systemHealth}%`} color="bg-amber-500" loading={loading} />
        <FinanceCard title="Total Balance" value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalBalance || 0)} color="bg-slate-900" loading={loading} />
      </div>

      {/* --- Main dashboard grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Main column (spans 2) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
            <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">Finances</CardTitle>
                <p className="text-sm text-slate-400 mt-1">Overview of account flows</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="text-xs uppercase">Income</Badge>
                <Badge className="text-xs uppercase">Expenses</Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="h-64">
                {/* Simple chart using recharts */}
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[{name:'1 Apr', income:120, expenses:200},{name:'2 Apr', income:200, expenses:150},{name:'3 Apr', income:180, expenses:170},{name:'4 Apr', income:220, expenses:140},{name:'5 Apr', income:260, expenses:180}]}> 
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="income" stroke="#34d399" dot={false} />
                    <Line type="monotone" dataKey="expenses" stroke="#fb7185" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Transaction History</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-md bg-slate-50">
                    <div>
                      <p className="text-sm font-bold">Aaron Evans</p>
                      <p className="text-xs text-slate-400">Food • March 29, 2022</p>
                    </div>
                    <div className="text-sm font-bold text-slate-900">$45</div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-md bg-white border">
                    <div>
                      <p className="text-sm font-bold">Clement Stewart</p>
                      <p className="text-xs text-slate-400">Shopping • March 27, 2022</p>
                    </div>
                    <div className="text-sm font-bold text-rose-500">-$241</div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-md bg-slate-50">
                    <div>
                      <p className="text-sm font-bold">Jessica Johanne</p>
                      <p className="text-xs text-slate-400">Others • March 25, 2022</p>
                    </div>
                    <div className="text-sm font-bold text-slate-900">$100</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Existing Inventory table kept below */}
          <Card className="border-none shadow-2xl shadow-slate-200/30 bg-white rounded-3xl overflow-hidden">
            <CardHeader className="px-6 pt-6 pb-4 border-b border-slate-50">
              <CardTitle className="text-xl font-bold text-slate-900">Infrastructure Inventory</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                      <th className="px-6 py-4">Node Status</th>
                      <th className="px-6 py-4">Hardware Identity</th>
                      <th className="px-6 py-4">Deployment</th>
                      <th className="px-6 py-4">System Logs</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredSensors.map((s) => (
                      <tr key={s._id} onClick={() => setSelectedSensor(s)} className="cursor-pointer hover:bg-slate-50/30 transition-all duration-200 group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`h-2.5 w-2.5 rounded-full ${s.status === 'offline' ? 'bg-rose-500' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse'}`} />
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-tighter">{s.status || "Operational"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{s.sensorId}</span>
                            <span className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{s._id.slice(-8)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
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
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-600">Last Pulse</span>
                            <span className="text-[10px] text-slate-400 font-medium">{s.lastPulse ? new Date(s.lastPulse).toLocaleString() : "Just now"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-300 hover:text-slate-600">
                            <MoreHorizontal size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <aside className="space-y-6">
          <Card className="p-6 bg-linear-to-br from-slate-800 to-slate-900 text-white rounded-3xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-300">My Card</p>
                <h3 className="text-xl font-black mt-2">VISA</h3>
                <p className="tracking-widest text-sm mt-4">5995 7474 1103 7513</p>
                <div className="flex items-center justify-between mt-6">
                  <div>
                    <p className="text-xs text-slate-300">Card Holder</p>
                    <p className="font-bold">Admin</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-300">Valid</p>
                    <p className="font-bold">11/24</p>
                  </div>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-slate-700 flex items-center justify-center">•••</div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl">
            <h4 className="text-sm font-bold">Quick Transaction</h4>
            <div className="flex items-center gap-3 mt-4">
              <div className="h-8 w-8 rounded-full bg-slate-100" />
              <div className="h-8 w-8 rounded-full bg-slate-100" />
              <div className="h-8 w-8 rounded-full bg-slate-100" />
            </div>
            <div className="mt-4">
              <Input placeholder="$ Amount" className="rounded-xl" />
              <Button className="mt-3 w-full">Send</Button>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl">
            <h4 className="text-sm font-bold">My Goals</h4>
            <div className="mt-3 space-y-3">
              <div className="bg-slate-50 p-3 rounded">
                <p className="text-xs text-slate-500">New iMac</p>
                <div className="w-full bg-slate-100 h-2 mt-2 rounded"><div className="h-2 w-[20%] bg-emerald-600 rounded"></div></div>
              </div>
              <div className="bg-slate-50 p-3 rounded">
                <p className="text-xs text-slate-500">New Macbook 14"</p>
                <div className="w-full bg-slate-100 h-2 mt-2 rounded"><div className="h-2 w-[40%] bg-emerald-600 rounded"></div></div>
              </div>
            </div>
          </Card>
        </aside>
      </div>

    </div>
  );
};

const FinanceCard = ({ title, value, color, loading }: any) => (
  <Card className={`p-4 ${color === 'bg-slate-900' ? 'text-white' : ''} rounded-2xl shadow-sm`}>
    <div className="flex items-center justify-between">
      <p className="text-xs font-bold uppercase text-slate-400">{title}</p>
      <div className="text-xs font-bold text-slate-400">●</div>
    </div>
    <div className={`mt-3 text-2xl font-black ${color === 'bg-slate-900' ? 'text-white' : 'text-slate-900'}`}>
      {loading ? (
        <div className="h-8 w-24 bg-slate-200/50 rounded animate-pulse" />
      ) : (
        value
      )}
    </div>
  </Card>
);

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