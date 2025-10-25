import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Upload, Edit, Trash2, Eye } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Crop {
  id: string;
  name: string;
  type: string;
  field: string;
  plantedDate: string;
  status: 'healthy' | 'attention' | 'critical';
  image: string;
  expectedHarvest: string;
}

const crops: Crop[] = [
  {
    id: '1',
    name: 'Tomatoes',
    type: 'Vegetable',
    field: 'Field A',
    plantedDate: '2025-09-15',
    status: 'healthy',
    image: 'https://images.unsplash.com/photo-1471194402529-8e0f5a675de6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBwbGFudHN8ZW58MXx8fHwxNzYwOTcxMjEyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    expectedHarvest: '2025-11-15',
  },
  {
    id: '2',
    name: 'Lettuce',
    type: 'Vegetable',
    field: 'Field B',
    plantedDate: '2025-10-01',
    status: 'healthy',
    image: 'https://images.unsplash.com/photo-1724565923646-2b0b3b5db71d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZXR0dWNlJTIwZmFybWluZ3xlbnwxfHx8fDE3NjEwNjE4ODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    expectedHarvest: '2025-11-10',
  },
  {
    id: '3',
    name: 'Bell Peppers',
    type: 'Vegetable',
    field: 'Field C',
    plantedDate: '2025-09-20',
    status: 'attention',
    image: 'https://images.unsplash.com/photo-1682073572475-8484f75a071f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbmhvdXNlJTIwY3JvcHN8ZW58MXx8fHwxNzYxMDYxODgwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    expectedHarvest: '2025-11-20',
  },
];

const statusColors = {
  healthy: 'bg-green-100 text-green-800',
  attention: 'bg-yellow-100 text-yellow-800',
  critical: 'bg-red-100 text-red-800',
};

export function CropManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2>Crop Inventory</h2>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Add New Crop
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {crops.map(crop => (
          <Card key={crop.id} className="overflow-hidden">
            <div className="aspect-video w-full overflow-hidden bg-gray-100">
              <ImageWithFallback
                src={crop.image}
                alt={crop.name}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{crop.name}</span>
                <Badge className={statusColors[crop.status]}>
                  {crop.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Type</p>
                  <p>{crop.type}</p>
                </div>
                <div>
                  <p className="text-gray-500">Field</p>
                  <p>{crop.field}</p>
                </div>
                <div>
                  <p className="text-gray-500">Planted</p>
                  <p>{new Date(crop.plantedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Harvest</p>
                  <p>{new Date(crop.expectedHarvest).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="mr-1 h-3 w-3" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
