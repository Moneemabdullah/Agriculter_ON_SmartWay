import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Upload, Edit, Trash2, Eye } from 'lucide-react';
import api from '../utils/axios';

interface ICrop {
  _id: string;
  name: string;
  caregory: string;
  season: string;
  showingPeriod?: { startMonth: number; endMonth: number };
  harvestPeriod?: { startMonth: number; endMonth: number };
  idealConditions?: any;
  createdAt?: string;
}

export function CropManagement() {
  const [crops, setCrops] = useState<ICrop[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<ICrop | null>(null);
  const [form, setForm] = useState<any>({ name: '', caregory: '', season: '', showingStart: 1, showingEnd: 12, harvestStart: 1, harvestEnd: 12 });

  const fetchCrops = async () => {
    setLoading(true);
    try {
      const res = await api.get('/crops');
      setCrops(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch crops', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const openCreate = () => {
    setSelectedCrop(null);
    setForm({ name: '', caregory: '', season: '', showingStart: 1, showingEnd: 12, harvestStart: 1, harvestEnd: 12 });
    setIsViewOnly(false);
    setIsModalOpen(true);
  };

  const openEdit = (crop: ICrop) => {
    setSelectedCrop(crop);
    setForm({
      name: crop.name || '',
      caregory: (crop as any).caregory || '',
      season: crop.season || '',
      showingStart: crop.showingPeriod?.startMonth || 1,
      showingEnd: crop.showingPeriod?.endMonth || 12,
      harvestStart: crop.harvestPeriod?.startMonth || 1,
      harvestEnd: crop.harvestPeriod?.endMonth || 12,
    });
    setIsViewOnly(false);
    setIsModalOpen(true);
  };

  const openView = (crop: ICrop) => {
    setSelectedCrop(crop);
    setForm({
      name: crop.name || '',
      caregory: (crop as any).caregory || '',
      season: crop.season || '',
      showingStart: crop.showingPeriod?.startMonth || 1,
      showingEnd: crop.showingPeriod?.endMonth || 12,
      harvestStart: crop.harvestPeriod?.startMonth || 1,
      harvestEnd: crop.harvestPeriod?.endMonth || 12,
    });
    setIsViewOnly(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this crop?')) return;
    try {
      await api.delete(`/crops/${id}`);
      setCrops(crops.filter(c => c._id !== id));
      alert('Crop deleted');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete crop');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        name: form.name,
        caregory: form.caregory,
        season: form.season,
        showingPeriod: { startMonth: Number(form.showingStart), endMonth: Number(form.showingEnd) },
        harvestPeriod: { startMonth: Number(form.harvestStart), endMonth: Number(form.harvestEnd) },
      };
      if (selectedCrop) {
        await api.put(`/crops/${selectedCrop._id}`, payload);
        alert('Crop updated');
      } else {
        await api.post('/crops', payload);
        alert('Crop added');
      }
      setIsModalOpen(false);
      fetchCrops();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save crop');
    }
  };

  const [query, setQuery] = useState('');
  const filtered = crops.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Crop Inventory</h2>
          <p className="text-sm text-gray-500">Add and manage crop types used on your farms</p>
          <p className="text-xs text-gray-400 mt-1">{crops.length} crops • Showing {filtered.length}</p>
        </div>
        <div className="flex items-center gap-3">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search crops..." className="rounded-lg border p-2 text-sm" />
          <Button onClick={openCreate} className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700">
            <Upload className="mr-2 h-4 w-4" />
            Add New Crop
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500">No crops match your search.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(crop => (
            <Card key={crop._id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video w-full overflow-hidden bg-gradient-to-tr from-green-100 to-white flex items-center justify-center">
                <span className="text-green-700 text-lg font-semibold">{crop.name[0]?.toUpperCase()}</span>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg font-bold">{crop.name}</span>
                  <Badge className="bg-green-100 text-green-800">{crop.season}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <div>Category: <span className="font-medium">{(crop as any).caregory}</span></div>
                  <div>Showing: {crop.showingPeriod?.startMonth} - {crop.showingPeriod?.endMonth}</div>
                  <div>Harvest: {crop.harvestPeriod?.startMonth} - {crop.harvestPeriod?.endMonth}</div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openView(crop)}>
                    <Eye className="mr-1 h-3 w-3" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(crop)}>
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(crop._id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">{isViewOnly ? 'Crop Details' : selectedCrop ? 'Edit Crop' : 'New Crop'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input disabled={isViewOnly} required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full rounded-lg border p-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input disabled={isViewOnly} required value={form.caregory} onChange={(e) => setForm({...form, caregory: e.target.value})} className="w-full rounded-lg border p-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
                <input disabled={isViewOnly} required value={form.season} onChange={(e) => setForm({...form, season: e.target.value})} className="w-full rounded-lg border p-2" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Showing Start (month)</label>
                  <input disabled={isViewOnly} type="number" min={1} max={12} value={form.showingStart} onChange={(e) => setForm({...form, showingStart: e.target.value})} className="w-full rounded-lg border p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Showing End (month)</label>
                  <input disabled={isViewOnly} type="number" min={1} max={12} value={form.showingEnd} onChange={(e) => setForm({...form, showingEnd: e.target.value})} className="w-full rounded-lg border p-2" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Start (month)</label>
                  <input disabled={isViewOnly} type="number" min={1} max={12} value={form.harvestStart} onChange={(e) => setForm({...form, harvestStart: e.target.value})} className="w-full rounded-lg border p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Harvest End (month)</label>
                  <input disabled={isViewOnly} type="number" min={1} max={12} value={form.harvestEnd} onChange={(e) => setForm({...form, harvestEnd: e.target.value})} className="w-full rounded-lg border p-2" />
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="py-2 px-4 rounded-lg border">Cancel</button>
                {!isViewOnly && <button type="submit" className="py-2 px-4 rounded-lg bg-green-600 text-white">{selectedCrop ? 'Save Changes' : 'Create Crop'}</button>}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
