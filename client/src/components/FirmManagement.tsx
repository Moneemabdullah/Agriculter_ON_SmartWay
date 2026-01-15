import {
    Activity,
    Calendar,
    Edit,
    Eye,
    Map as MapIcon,
    MapPin,
    Plus,
    Search, Sprout,
    Trash2,
    User,
    X
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import api from '../utils/axios';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';

// --- Interfaces ---
interface ICrop {
  _id: string;
  name: string;
  category?: string;
}

interface ISensor {
  sensorId: string;
  createdAt: string;
  status?: string;
}

interface IFirm {
  _id: string;
  location: { latitude: number; longitude: number };
  crops: ICrop | string;
  sensors?: ISensor[];
  plantationDate: string;
  owner?: { _id?: string; name?: string; email?: string };
  createdAt?: string;
}

export default function FirmManagement() {
  const [firms, setFirms] = useState<IFirm[]>([]);
  const [crops, setCrops] = useState<ICrop[]>([]);
  const [availableSensors, setAvailableSensors] = useState<Array<{_id: string, sensorId: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState<IFirm | null>(null);
  const [newSensorId, setNewSensorId] = useState('');
  const [form, setForm] = useState({ latitude: '', longitude: '', cropId: '', plantationDate: '' });
  const [query, setQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // --- API Calls ---
  const fetchCrops = async () => {
    try {
      const res = await api.get('/crops');
      setCrops(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch crops', err);
    }
  };

  const fetchSensors = async () => {
    try {
      const res = await api.get('/sensors');
      setAvailableSensors(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch sensors', err);
    }
  };

  const fetchFirms = async () => {
    setLoading(true);
    try {
      const res = await api.get('/firms');
      setFirms(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch firms', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
    fetchSensors();
    fetchFirms();
  }, []);

  // --- Helper ---
  const getDisplayName = (val: any) => {
    if (!val) return 'Unassigned';
    if (typeof val === 'string') return val;
    return val.name || val.email || 'Unknown User';
  };

  const openCreate = () => {
    setSelectedFirm(null);
    setForm({ latitude: '', longitude: '', cropId: '', plantationDate: '' });
    setIsViewOnly(false);
    setShowMap(false);
    setIsModalOpen(true);
  };

  const openEdit = (firm: IFirm) => {
    setSelectedFirm(firm);
    setForm({
      latitude: String(firm.location?.latitude ?? ''),
      longitude: String(firm.location?.longitude ?? ''),
      cropId: typeof firm.crops === 'string' ? firm.crops : (firm.crops as ICrop)?._id,
      plantationDate: firm.plantationDate ? new Date(firm.plantationDate).toISOString().slice(0, 10) : '',
    });
    setIsViewOnly(false);
    setShowMap(false);
    setIsModalOpen(true);
  };

  const openView = (firm: IFirm) => {
    setSelectedFirm(firm);
    setForm({
      latitude: String(firm.location?.latitude ?? ''),
      longitude: String(firm.location?.longitude ?? ''),
      cropId: typeof firm.crops === 'string' ? firm.crops : (firm.crops as ICrop)?._id,
      plantationDate: firm.plantationDate ? new Date(firm.plantationDate).toISOString().slice(0, 10) : '',
    });
    setIsViewOnly(true);
    setShowMap(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this farm?')) return;
    try {
      await api.delete(`/firms/${id}`);
      // Refetch the list after deletion
      await fetchFirms();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete firm');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        location: { latitude: Number(form.latitude), longitude: Number(form.longitude) },
        crops: form.cropId,
        plantationDate: new Date(form.plantationDate),
      };

      if (selectedFirm) {
        await api.patch(`/firms/${selectedFirm._id}`, payload);
      } else {
        await api.post('/firms', payload);
      }

      // Always refetch after create/update to ensure persistence
      await fetchFirms();
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Operation failed');
    }
  };

  const handleAddSensor = async () => {
    if (!selectedFirm || !newSensorId) return;
    try {
      const res = await api.post(`/firms/${selectedFirm._id}/sensors`, { sensorId: newSensorId });
      // Refetch the full farm list after adding sensor
      await fetchFirms();
      setSelectedFirm(res.data?.data);
      setNewSensorId('');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to link sensor');
    }
  };

  // Map click handler
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert pixel coordinates to lat/lng (simplified for demo)
    // This is a basic conversion - for production, use a proper map library like Leaflet
    const lat = (23.8103 + (1 - y / rect.height) * 0.5).toFixed(6);
    const lng = (90.4125 + (x / rect.width) * 0.5).toFixed(6);
    
    setForm({ ...form, latitude: lat, longitude: lng });
  };

  const filtered = firms.filter((f) => {
    const cropName = typeof f.crops === 'string' ? '' : (f.crops as ICrop)?.name || '';
    return (
      f._id.toLowerCase().includes(query.toLowerCase()) ||
      cropName.toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Farm Management</h1>
          <p className="text-slate-500 mt-1">Manage agricultural plots and sensor deployments.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Search by crop..." 
              className="pl-10 w-64 bg-white border-slate-200" 
            />
          </div>
          <Button onClick={openCreate} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all">
            <Plus className="mr-2 h-4 w-4" /> Add New Farm
          </Button>
        </div>
      </div>

      {/* Farms Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <Sprout className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No farms registered</h3>
          <p className="text-slate-500">Get started by creating your first agricultural plot.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((firm) => (
            <Card key={firm._id} className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white">
              <div className="h-1.5 bg-emerald-500" />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                    <Sprout className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none font-semibold">
                    {firm.sensors?.length ?? 0} Sensors
                  </Badge>
                </div>
                <CardTitle className="mt-4 text-xl font-bold text-slate-800">
                  {(firm.crops as ICrop)?.name || 'Unnamed Plot'}
                </CardTitle>
                <p className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">UID: {firm._id}</p>
              </CardHeader>

              <CardContent className="space-y-4 pt-2">
                <div className="space-y-2.5">
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                    {firm.location?.latitude.toFixed(4)}, {firm.location?.longitude.toFixed(4)}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                    Planted {firm.plantationDate ? new Date(firm.plantationDate).toLocaleDateString() : '—'}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <User className="h-4 w-4 mr-2 text-slate-400" />
                    <span className="truncate">{getDisplayName(firm.owner)}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-slate-50/50 gap-2 p-4">
                <Button variant="ghost" size="sm" className="flex-1 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50" onClick={() => openView(firm)}>
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </Button>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-600" onClick={() => openEdit(firm)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-600" onClick={() => handleDelete(firm._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-4xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {isViewOnly ? 'Farm Overview' : selectedFirm ? 'Update Plot' : 'Register New Farm'}
                </h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">Farm Information System</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                
                {/* Map Section - Only show when not in view mode */}
                {!isViewOnly && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-500 ml-1">Location Picker</label>
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setShowMap(!showMap)}
                        className="text-xs"
                      >
                        <MapIcon className="h-3 w-3 mr-1" />
                        {showMap ? 'Hide Map' : 'Show Map'}
                      </Button>
                    </div>
                    
                    {showMap && (
                      <div 
                        ref={mapRef}
                        onClick={handleMapClick}
                        className="relative w-full h-64 rounded-xl border-2 border-emerald-200 cursor-crosshair overflow-hidden shadow-inner"
                        style={{
                          background: 'linear-gradient(to bottom, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)',
                          backgroundSize: 'cover'
                        }}
                      >
                        {/* Grid lines for map effect */}
                        <div className="absolute inset-0" style={{
                          backgroundImage: `
                            linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                          `,
                          backgroundSize: '40px 40px'
                        }} />
                        
                        {/* Road-like lines */}
                        <div className="absolute inset-0">
                          <div className="absolute top-1/4 left-0 right-0 h-1 bg-yellow-600/30"></div>
                          <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-700/40"></div>
                          <div className="absolute top-3/4 left-0 right-0 h-1 bg-yellow-600/30"></div>
                          <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-yellow-600/30"></div>
                          <div className="absolute left-1/2 top-0 bottom-0 w-1.5 bg-gray-700/40"></div>
                          <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-yellow-600/30"></div>
                        </div>

                        {/* Buildings/Trees for effect */}
                        <div className="absolute top-4 left-8 w-6 h-6 bg-green-700/40 rounded"></div>
                        <div className="absolute top-12 right-12 w-8 h-8 bg-green-800/40 rounded-full"></div>
                        <div className="absolute bottom-8 left-16 w-5 h-5 bg-amber-700/40 rounded-sm"></div>
                        <div className="absolute bottom-16 right-20 w-7 h-7 bg-green-700/40 rounded-full"></div>
                        
                        <div className="absolute inset-0 flex items-center justify-center text-emerald-700 font-bold text-sm pointer-events-none bg-white/30 backdrop-blur-[1px]">
                          🗺️ Click anywhere to set coordinates
                        </div>
                        
                        {form.latitude && form.longitude && (
                          <div 
                            className="absolute pointer-events-none z-10"
                            style={{
                              left: `${((parseFloat(form.longitude) - 90.4125) / 0.5) * 100}%`,
                              top: `${(1 - (parseFloat(form.latitude) - 23.8103) / 0.5) * 100}%`,
                              transform: 'translate(-50%, -100%)'
                            }}
                          >
                            <div className="relative">
                              <MapPin className="h-8 w-8 text-red-600 filter drop-shadow-lg" fill="#dc2626" />
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-600/30 rounded-full blur-sm"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 ml-1">Latitude</label>
                    <Input 
                      disabled={isViewOnly} 
                      required 
                      type="number" 
                      step="any"
                      value={form.latitude} 
                      onChange={(e) => setForm({ ...form, latitude: e.target.value })} 
                      className="rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 ml-1">Longitude</label>
                    <Input 
                      disabled={isViewOnly} 
                      required 
                      type="number" 
                      step="any"
                      value={form.longitude} 
                      onChange={(e) => setForm({ ...form, longitude: e.target.value })} 
                      className="rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">Target Crop</label>
                  <select 
                    disabled={isViewOnly} 
                    required 
                    value={form.cropId} 
                    onChange={(e) => setForm({ ...form, cropId: e.target.value })} 
                    className="w-full flex h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  >
                    <option value="">Select a crop type...</option>
                    {crops.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-1">Plantation Date</label>
                  <Input 
                    disabled={isViewOnly} 
                    required 
                    type="date" 
                    value={form.plantationDate} 
                    onChange={(e) => setForm({ ...form, plantationDate: e.target.value })} 
                    className="rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all"
                  />
                </div>

                {!isViewOnly && (
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 px-8 rounded-xl shadow-lg shadow-emerald-200">
                      {selectedFirm ? 'Update Records' : 'Save Farm'}
                    </Button>
                  </div>
                )}
              </form>

              {/* View-Only Sensor Section */}
              {isViewOnly && selectedFirm && (
                <div className="px-8 pb-8 space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-emerald-500" /> 
                        Connected Sensors
                      </h4>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest text-slate-400 rounded-md">
                        {selectedFirm.sensors?.length || 0} Total Units
                      </Badge>
                    </div>

                    <div className="flex gap-2 mb-6">
                      <select
                        value={newSensorId}
                        onChange={(e) => setNewSensorId(e.target.value)}
                        className="flex-1 h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      >
                        <option value="">Select a sensor from available list...</option>
                        {availableSensors
                          .filter(sensor => 
                            !selectedFirm.sensors?.some(s => s.sensorId === sensor.sensorId)
                          )
                          .map((sensor) => (
                            <option key={sensor._id} value={sensor.sensorId}>
                              {sensor.sensorId} (ID: {sensor._id})
                            </option>
                          ))
                        }
                      </select>
                      <Button 
                        onClick={handleAddSensor}
                        size="sm" 
                        disabled={!newSensorId}
                        className="bg-slate-900 hover:bg-black text-white h-10 px-4 rounded-xl shadow-md transition-all"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Link Sensor
                      </Button>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                      {selectedFirm.sensors && selectedFirm.sensors.length > 0 ? (
                        selectedFirm.sensors.map((s, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white p-3 border border-slate-100 rounded-2xl shadow-sm hover:border-emerald-100 transition-all group">
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                              <div>
                                <p className="text-xs font-mono font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">{s.sensorId}</p>
                                <p className="text-[10px] text-slate-400 italic">Sync Date: {new Date(s.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                               <Badge className="bg-emerald-50 text-emerald-600 text-[9px] font-bold border-none px-2 py-0.5">ONLINE</Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          <p className="text-xs text-slate-400">No hardware components linked yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
