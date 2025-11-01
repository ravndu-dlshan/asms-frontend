'use client';

import { useState, type ComponentType } from 'react';
import { Plus, Package, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import PartRequestList from './components/PartRequestList';
import PartRequestForm from './components/PartRequestForm';

const PartRequestFormTyped = PartRequestForm as unknown as ComponentType<{ onClose: () => void; onSubmit: (newRequest: unknown) => void }>;

export default function PartRequestsPage() {
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState([
    {
      id: '#PR-2024-001',
      partName: 'Brake Pad Set',
      vehicleModel: 'Toyota Camry 2020',
      quantity: 2,
      requestDate: '2024-10-15',
      status: 'pending'
    },
    {
      id: '#PR-2024-002',
      partName: 'Oil Filter',
      vehicleModel: 'Honda Civic 2019',
      quantity: 1,
      requestDate: '2024-10-14',
      status: 'approved'
    },
    {
      id: '#PR-2024-003',
      partName: 'Spark Plugs',
      vehicleModel: 'Ford F-150 2021',
      quantity: 4,
      requestDate: '2024-10-13',
      status: 'delivered'
    },
    {
      id: '#PR-2024-004',
      partName: 'Air Filter',
      vehicleModel: 'BMW X5 2022',
      quantity: 1,
      requestDate: '2024-10-12',
      status: 'rejected'
    },
    {
      id: '#PR-2024-005',
      partName: 'Wiper Blades',
      vehicleModel: 'Mercedes C-Class 2020',
      quantity: 2,
      requestDate: '2024-10-11',
      status: 'delivered'
    },
    {
      id: '#PR-2024-006',
      partName: 'Battery',
      vehicleModel: 'Audi A4 2021',
      quantity: 1,
      requestDate: '2024-10-10',
      status: 'approved'
    }
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (newRequest: any) => {
    setRequests([newRequest, ...requests]);
  };

  const stats = [
    {
      label: 'Total Requests',
      value: requests.length,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-400'
    },
    {
      label: 'Pending',
      value: requests.filter(r => r.status === 'pending').length,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
      iconColor: 'text-yellow-400'
    },
    {
      label: 'Approved',
      value: requests.filter(r => r.status === 'approved').length,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-400'
    },
    {
      label: 'Delivered',
      value: requests.filter(r => r.status === 'delivered').length,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-400'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Part Requests</h1>
          <p className="text-gray-400">Manage your part requests and track their status</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-lg shadow-orange-500/30"
        >
          <Plus className="w-5 h-5" />
          <span>Request New Part</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <PartRequestList requests={requests} />
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Part Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Part Name:</p>
                <p className="text-white font-medium">Brake Pad Set</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Availability:</p>
                <p className="text-green-400 font-medium">In Stock</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Quantity:</p>
                <p className="text-white font-medium">15 units</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Est. Delivery:</p>
                <p className="text-white font-medium">2-3 days</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Supplier:</p>
                <p className="text-white font-medium">AutoParts Inc.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-6 border border-orange-500/20">
            <h3 className="text-lg font-bold text-orange-400 mb-3">💡 Quick Tips</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Check stock before requesting</li>
              <li>• Specify vehicle model clearly</li>
              <li>• Mark urgent requests as high priority</li>
              <li>• Track delivery status regularly</li>
            </ul>
          </div>
        </div>
      {showForm && (
        <PartRequestFormTyped
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}
      
</div>    </div>
  );
}
