import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Eye, Search, Sprout, Calendar, Tag, X } from 'lucide-react';
import api from "@/api/axios";

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

const months = [
  { value: 1, label: 'Jan' }, { value: 2, label: 'Feb' }, { value: 3, label: 'Mar' },
  { value: 4, label: 'Apr' }, { value: 5, label: 'May' }, { value: 6, label: 'Jun' },
  { value: 7, label: 'Jul' }, { value: 8, label: 'Aug' }, { value: 9, label: 'Sep' },
  { value: 10, label: 'Oct' }, { value: 11, label: 'Nov' }, { value: 12, label: 'Dec' },
];

export function CropManagement() {
  const [crops, setCrops] = useState<ICrop[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<ICrop | null>(null);
  const [form, setForm] = useState<any>({
    name: '', caregory: '', season: '',
    showingStart: 1, showingEnd: 12,
    harvestStart: 1, harvestEnd: 12,
  });

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

  useEffect(() => { fetchCrops(); }, []);

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
    if (!confirm('Are you sure you want to delete this crop?')) return;
    try {
      await api.delete(`/crops/${id}`);
      setCrops(crops.filter(c => c._id !== id));
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
      } else {
        await api.post('/crops', payload);
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
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Crop Inventory</h2>
          <p className="text-sm text-gray-500">Add and manage crop types used on your farms</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search crops..."
              className="pl-10 w-64 bg-white"
            />
          </div>
          <Button onClick={openCreate} className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add New Crop
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <Sprout className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No crops registered</h3>
          <p className="text-gray-500">Get started by adding your first crop type.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(crop => (
            <Card key={crop._id} className="group shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="h-1.5 bg-green-500" />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-green-50 rounded-xl text-green-600">
                    <Sprout className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-none font-semibold text-xs">
                    {crop.season || '—'}
                  </Badge>
                </div>
                <CardTitle className="mt-4 text-xl font-bold text-gray-800">
                  {crop.name}
                </CardTitle>
                <p className="text-xs text-gray-400 font-mono tracking-tight uppercase">ID: {crop._id.slice(-6)}</p>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Tag className="h-4 w-4 mr-2 text-gray-400" />
                  {(crop as any).caregory || 'Uncategorized'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  Sow: {months[crop.showingPeriod?.startMonth ? crop.showingPeriod.startMonth - 1 : 0]?.label} &ndash; {months[crop.showingPeriod?.endMonth ? crop.showingPeriod.endMonth - 1 : 11]?.label}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-amber-500" />
                  Harvest: {months[crop.harvestPeriod?.startMonth ? crop.harvestPeriod.startMonth - 1 : 0]?.label} &ndash; {months[crop.harvestPeriod?.endMonth ? crop.harvestPeriod.endMonth - 1 : 11]?.label}
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 gap-2 p-4">
                <Button variant="ghost" size="sm" className="flex-1 text-gray-600 hover:text-green-600 hover:bg-green-50" onClick={() => openView(crop)}>
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </Button>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-600" onClick={() => openEdit(crop)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-600" onClick={() => handleDelete(crop._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white shadow-2xl w-full max-w-xl overflow-hidden rounded-2xl">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {isViewOnly ? 'Crop Details' : selectedCrop ? 'Update Crop' : 'Register New Crop'}
                </h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mt-1">Crop Information</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1">Crop Name</label>
                    <Input disabled={isViewOnly} required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="e.g. Tomatoes" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1">Category</label>
                    <Input disabled={isViewOnly} required value={form.caregory} onChange={(e) => setForm({...form, caregory: e.target.value})} placeholder="e.g. Vegetables" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 ml-1">Season</label>
                  <Input disabled={isViewOnly} required value={form.season} onChange={(e) => setForm({...form, season: e.target.value})} placeholder="e.g. Spring" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1">Sowing Start</label>
                    <select
                      disabled={isViewOnly}
                      value={form.showingStart}
                      onChange={(e) => setForm({...form, showingStart: e.target.value})}
                      className="w-full flex h-11 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    >
                      {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1">Sowing End</label>
                    <select
                      disabled={isViewOnly}
                      value={form.showingEnd}
                      onChange={(e) => setForm({...form, showingEnd: e.target.value})}
                      className="w-full flex h-11 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    >
                      {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1">Harvest Start</label>
                    <select
                      disabled={isViewOnly}
                      value={form.harvestStart}
                      onChange={(e) => setForm({...form, harvestStart: e.target.value})}
                      className="w-full flex h-11 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    >
                      {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 ml-1">Harvest End</label>
                    <select
                      disabled={isViewOnly}
                      value={form.harvestEnd}
                      onChange={(e) => setForm({...form, harvestEnd: e.target.value})}
                      className="w-full flex h-11 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    >
                      {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </div>
                </div>
                {!isViewOnly && (
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 px-8 shadow-md">
                      {selectedCrop ? 'Update Records' : 'Save Crop'}
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
