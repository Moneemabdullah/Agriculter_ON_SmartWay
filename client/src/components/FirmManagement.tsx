import React, { useEffect, useState } from 'react';
import api from '../utils/axios';
import { Plus, Eye, Edit2, Trash2, X } from 'lucide-react';

/* ================= TYPES ================= */

interface ISensorShort {
  _id: string;
  sensorId: string;
}

interface IFirm {
  _id: string;
  location: {
    latitude: number;
    longitude: number;
  };
  plantationDate: string;
  crops: {
    _id: string;
    name?: string;
  };
  sensors?: ISensorShort[];
}

interface ICrop {
  _id: string;
  name: string;
}

/* ================= COMPONENT ================= */

const FirmManagement: React.FC = () => {
  const [firms, setFirms] = useState<IFirm[]>([]);
  const [crops, setCrops] = useState<ICrop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState<IFirm | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  // form state (backend aligned)
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    plantationDate: '',
    cropId: '',
  });

  // sensor modal & form state
  const [isSensorModalOpen, setIsSensorModalOpen] = useState(false);
  const [activeFirmForSensor, setActiveFirmForSensor] = useState<IFirm | null>(null);
  const [sensorForm, setSensorForm] = useState({ sensorId: '' });
  const [sensorLoading, setSensorLoading] = useState(false);
  const [sensorError, setSensorError] = useState<string | null>(null);

  /* ================= FETCH ================= */

  const fetchFirms = async () => {
    setLoading(true);
    try {
      const res = await api.get('/firms');
      const firmsData: IFirm[] = res.data?.data || [];

      // fetch sensors for each firm in parallel (use owner route which accepts firmId as param)
      const sensorPromises = firmsData.map(async (firm) => {
        try {
          const sres = await api.get(`/sensors/owner/${firm._id}`);
          return sres.data?.data || [];
        } catch {
          return [];
        }
      });

      const sensorsArr = await Promise.all(sensorPromises);

      const merged = firmsData.map((f, idx) => ({ ...f, sensors: sensorsArr[idx] }));
      setFirms(merged);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch firms');
    } finally {
      setLoading(false);
    }
  };

  const fetchCrops = async () => {
    try {
      const res = await api.get('/crops');
      setCrops(res.data?.data || []);
    } catch {
      console.warn('Failed to fetch crops');
    }
  };

  useEffect(() => {
    fetchFirms();
    fetchCrops();
  }, []);

  /* ================= MODAL ================= */

  const handleOpenModal = (firm: IFirm | null = null, view = false) => {
    setSelectedFirm(firm);
    setIsViewOnly(view);

    setFormData({
      latitude: firm ? String(firm.location.latitude) : '',
      longitude: firm ? String(firm.location.longitude) : '',
      plantationDate: firm?.plantationDate
        ? new Date(firm.plantationDate).toISOString().split('T')[0]
        : '',
      cropId: firm?.crops?._id || '',
    });

    setIsModalOpen(true);
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this firm?')) return;
    try {
      await api.delete(`/firms/${id}`);
      setFirms(prev => prev.filter(f => f._id !== id));
    } catch {
      alert('Failed to delete firm');
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { latitude, longitude, plantationDate, cropId } = formData;

    if (!latitude || !longitude || !plantationDate || !cropId) {
      alert('All fields are required');
      return;
    }

    const payload = {
      location: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      crops: cropId,
      plantationDate,
    };

    try {
      if (selectedFirm) {
        await api.patch(`/firms/${selectedFirm._id}`, payload);
      } else {
        await api.post('/firms', payload);
      }

      setIsModalOpen(false);
      fetchFirms();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save firm');
    }
  };

  /* ================= ADD SENSOR ================= */

  const handleAddSensor = (firm: IFirm) => {
    setActiveFirmForSensor(firm);
    setSensorForm({ sensorId: '' });
    setSensorError(null);
    setIsSensorModalOpen(true);
  };

  const submitAddSensor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sensorForm.sensorId || !activeFirmForSensor) {
      alert('Sensor ID is required');
      return;
    }
    setSensorLoading(true);
    try {
      await api.post('/sensors', { sensorId: sensorForm.sensorId, firmId: activeFirmForSensor._id });
      setIsSensorModalOpen(false);
      setActiveFirmForSensor(null);
      fetchFirms();
    } catch (err: any) {
      setSensorError(err?.response?.data?.message || 'Failed to add sensor');
    } finally {
      setSensorLoading(false);
    }
  };

  const handleDeleteSensor = async (sensorId: string) => {
    if (!confirm('Are you sure you want to remove this sensor?')) return;
    try {
      await api.delete(`/sensors/id/${sensorId}`);
      fetchFirms();
    } catch {
      alert('Failed to delete sensor');
    }
  }; 

  /* ================= UI ================= */

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Firm Management</h2>
          <p className="text-sm text-gray-500">Manage your farms</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} /> Add Firm
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {firms.map(f => (
            <div key={f._id} className="bg-white p-4 rounded-xl border">
              <h3 className="font-bold">
                Lat: {f.location.latitude}, Lng: {f.location.longitude}
              </h3>

              <p className="text-sm text-gray-500">
                Crop: {f.crops?.name || f.crops?._id}
              </p>

              <p className="text-sm text-gray-500">
                {new Date(f.plantationDate).toLocaleDateString()}
              </p>

              {f.sensors && f.sensors.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-semibold">Sensors:</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {f.sensors.map(s => (
                      <div key={(s as any)._id} className="bg-gray-100 px-2 py-1 rounded flex items-center gap-2">
                        <span className="text-xs">{(s as any).sensorId}</span>
                        <button onClick={() => handleDeleteSensor((s as any).sensorId)} className="text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-4 flex-wrap">
                <button onClick={() => handleOpenModal(f, true)}><Eye /></button>
                <button onClick={() => handleOpenModal(f)}><Edit2 /></button>

                <button
                  className="text-green-600 text-sm"
                  onClick={() => handleAddSensor(f)}
                >
                  + Add Sensor
                </button>

                <button onClick={() => handleDelete(f._id)}><Trash2 /></button>
              </div> 
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold">
                {isViewOnly
                  ? 'Firm Details'
                  : selectedFirm
                  ? 'Update Firm'
                  : 'New Firm'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <input
                disabled={isViewOnly}
                placeholder="Latitude"
                className="w-full border p-2 rounded"
                value={formData.latitude}
                onChange={e =>
                  setFormData({ ...formData, latitude: e.target.value })
                }
              />

              <input
                disabled={isViewOnly}
                placeholder="Longitude"
                className="w-full border p-2 rounded"
                value={formData.longitude}
                onChange={e =>
                  setFormData({ ...formData, longitude: e.target.value })
                }
              />

              <input
                type="date"
                disabled={isViewOnly}
                className="w-full border p-2 rounded"
                value={formData.plantationDate}
                onChange={e =>
                  setFormData({
                    ...formData,
                    plantationDate: e.target.value,
                  })
                }
              />

              <select
                disabled={isViewOnly}
                className="w-full border p-2 rounded"
                value={formData.cropId}
                onChange={e =>
                  setFormData({ ...formData, cropId: e.target.value })
                }
              >
                <option value="">Select Crop</option>
                {crops.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {!isViewOnly && (
                <button className="w-full bg-green-600 text-white py-2 rounded">
                  {selectedFirm ? 'Update Firm' : 'Create Firm'}
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ================= SENSOR MODAL ================= */}
      {isSensorModalOpen && activeFirmForSensor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold">Add Sensor to Firm</h3>
              <button onClick={() => setIsSensorModalOpen(false)}><X /></button>
            </div>

            <form onSubmit={submitAddSensor} className="p-4 space-y-3">
              <p className="text-sm text-gray-500">Firm: Lat {activeFirmForSensor.location.latitude}, Lng {activeFirmForSensor.location.longitude}</p>
              <input
                placeholder="Sensor ID"
                className="w-full border p-2 rounded"
                value={sensorForm.sensorId}
                onChange={e => setSensorForm({ sensorId: e.target.value })}
              />

              {sensorError && <p className="text-red-600 text-sm">{sensorError}</p>}

              <div className="flex gap-2">
                <button type="submit" disabled={sensorLoading} className="flex-1 bg-green-600 text-white py-2 rounded">
                  {sensorLoading ? 'Adding...' : 'Add Sensor'}
                </button>
                <button type="button" onClick={() => setIsSensorModalOpen(false)} className="flex-1 border py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirmManagement;
