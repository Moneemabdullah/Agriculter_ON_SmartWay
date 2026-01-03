import React, { useEffect, useState } from 'react';
import api from '../utils/axios';
import { Plus, Eye, Edit2, Trash2, X } from 'lucide-react'; // Recommended for icons

interface IFirm {
  _id: string;
  location: string;
  plantationDate: string;
  sensors: any[];
  crops: { _id?: string; name?: string };
}

interface ICrop { _id: string; name: string }
interface ISensor { _id: string; sensorId: string }

export const FirmManagement: React.FC = () => {
  const [firms, setFirms] = useState<IFirm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState<IFirm | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [formData, setFormData] = useState({ location: '', plantationDate: '', cropId: '', sensors: [] as string[] });

  const [crops, setCrops] = useState<ICrop[]>([]);
  const [sensorsList, setSensorsList] = useState<ISensor[]>([]);

  const fetchFirms = async () => {
    setLoading(true);
    try {
      const res = await api.get('/firms');
      setFirms(res.data?.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error fetching firms');
    } finally {
      setLoading(false);
    }
  };

  const fetchCrops = async () => {
    try {
      const res = await api.get('/crops');
      setCrops(res.data?.data || []);
    } catch (err) {
      console.warn('Failed to fetch crops');
    }
  };

  const fetchSensors = async () => {
    try {
      const res = await api.get('/sensors');
      setSensorsList(res.data?.data || []);
    } catch (err) {
      console.warn('Failed to fetch sensors');
    }
  };

  useEffect(() => { fetchFirms(); fetchCrops(); fetchSensors();
    const onUpdated = () => fetchSensors();
    window.addEventListener('sensors-updated', onUpdated);
    return () => { window.removeEventListener('sensors-updated', onUpdated); };
  }, []);

  // Handlers
  const handleOpenModal = (firm: IFirm | null = null, viewMode = false) => {
    setSelectedFirm(firm);
    setIsViewOnly(viewMode);
    setFormData({
      location: firm?.location || '',
      plantationDate: firm?.plantationDate ? new Date(firm.plantationDate).toISOString().split('T')[0] : '',
      cropId: (firm?.crops?._id as string) || '',
      sensors: firm?.sensors ? firm.sensors.map((s:any) => (s._id || s)) : []
    } as any);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this firm?")) return;
    try {
      await api.delete(`/firms/${id}`);
      setFirms(firms.filter(f => f._id !== id));
    } catch (err) {
      alert("Failed to delete firm");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    const { location, plantationDate, cropId, sensors } = formData as any;
    const missing: string[] = [];
    if (!location) missing.push('location');
    if (!cropId) missing.push('crops');
    if (!sensors || (Array.isArray(sensors) && sensors.length === 0)) missing.push('sensors');
    if (!plantationDate) missing.push('plantationDate');
    if (missing.length) {
      alert(`Please fill required fields: ${missing.join(', ')}`);
      return;
    }

    try {
      // Build payload matching the server expectations
      const payload = {
        location,
        crops: cropId,
        sensors: sensors,
        plantationDate,
      } as any;

      if (selectedFirm) {
        await api.patch(`/firms/${selectedFirm._id}`, payload);
      } else {
        await api.post('/firms', payload);
      }

      setIsModalOpen(false);
      fetchFirms();
    } catch (err: any) {
      console.error('Error saving firm', err);
      const message = err?.response?.data?.message || err?.message || 'Error saving firm';
      alert(message);
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Firm Management</h3>
          <p className="text-sm text-gray-500">Monitor and manage your plantation assets</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-lg bg-green-600 text-white px-4 py-2 font-medium hover:bg-green-700 transition-colors shadow-sm"
        >
          <Plus size={18} /> Add Firm
        </button>
      </div>

      {/* Grid Content */}
      <div className="mt-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-xl" />)}
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {firms.map((f) => (
              <div key={f._id} className="group relative rounded-xl border border-gray-200 p-5 bg-white hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{f.location}</h4>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">ID: {f._id.slice(-6)}</p>
                  </div>
                  <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full border border-green-100">
                    {f.sensors?.length || 0} Sensors
                  </span>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Plantation Date:</span>
                    <span className="text-gray-700 font-medium">{new Date(f.plantationDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Current Crop:</span>
                    <span className="text-green-600 font-bold">{f.crops?.name || 'Unassigned'}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                  <button onClick={() => handleOpenModal(f, true)} className="flex-1 flex justify-center py-2 rounded-md bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => handleOpenModal(f, false)} className="flex-1 flex justify-center py-2 rounded-md bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(f._id)} className="flex-1 flex justify-center py-2 rounded-md bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit/View Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                {isViewOnly ? 'Firm Details' : selectedFirm ? 'Update Firm' : 'New Firm'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  disabled={isViewOnly}
                  className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-green-500 outline-none disabled:bg-gray-50"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plantation Date</label>
                <input 
                  type="date"
                  disabled={isViewOnly}
                  className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-green-500 outline-none disabled:bg-gray-50"
                  value={formData.plantationDate}
                  onChange={(e) => setFormData({...formData, plantationDate: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop</label>
                <select
                  disabled={isViewOnly}
                  className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-green-500 outline-none bg-white"
                  value={(formData as any).cropId}
                  onChange={(e) => setFormData({...formData, cropId: e.target.value})}
                  required
                >
                  <option value="">Select Crop</option>
                  {crops.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sensors</label>
                <select
                  multiple
                  disabled={isViewOnly}
                  className="w-full rounded-lg border-gray-300 border p-2.5 h-32 focus:ring-2 focus:ring-green-500 outline-none bg-white"
                  value={(formData as any).sensors}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions).map(o => o.value);
                    setFormData({...formData, sensors: selected});
                  }}
                >
                  {sensorsList.map(s => (
                    <option key={s._id} value={s._id}>{s.sensorId} — {s._id.slice(-6)}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">Select one or more sensors you already added in Settings.</p>
              </div>

              {!isViewOnly && (
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 shadow-md">
                    {selectedFirm ? 'Save Changes' : 'Create Firm'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirmManagement;