// src/app/employee/part-requests/components/PartRequestForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Package, Car, Hash, AlertCircle, CheckCircle } from 'lucide-react';

interface PartRequestFormProps {
  onClose: () => void;
  onSubmit: (data: unknown) => void;
}

export default function PartRequestForm({ onClose, onSubmit }: PartRequestFormProps) {
  const [formData, setFormData] = useState({
    partName: '',
    vehicleModel: '',
    quantity: 1,
    priority: 'medium',
    notes: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.partName.trim()) {
      newErrors.partName = 'Part name is required';
    }
    if (!formData.vehicleModel.trim()) {
      newErrors.vehicleModel = 'Vehicle model is required';
    }
    if (formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }
    if (formData.quantity > 100) {
      newErrors.quantity = 'Quantity cannot exceed 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newRequest = {
      ...formData,
      id: `#PR-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setShowSuccess(true);

    // Wait for success animation
    setTimeout(() => {
      onSubmit(newRequest);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-800 max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Success Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl animate-fadeIn">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-scaleIn">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Request Submitted!</h3>
              <p className="text-gray-400">Your part request has been added successfully</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Request New Part</h2>
            <p className="text-gray-400 text-sm mt-1">Fill in the details to submit a part request</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Part Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              <Package className="inline w-4 h-4 mr-2" />
              Part Name *
            </label>
            <input
              type="text"
              name="partName"
              value={formData.partName}
              onChange={handleChange}
              placeholder="e.g., Brake Pad Set, Oil Filter"
              disabled={isSubmitting}
              className={`w-full bg-gray-800 border ${
                errors.partName ? 'border-red-500' : 'border-gray-700'
              } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            {errors.partName && (
              <p className="text-red-400 text-sm mt-1 flex items-center animate-slideDown">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.partName}
              </p>
            )}
          </div>

          {/* Vehicle Model */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              <Car className="inline w-4 h-4 mr-2" />
              Vehicle Model *
            </label>
            <input
              type="text"
              name="vehicleModel"
              value={formData.vehicleModel}
              onChange={handleChange}
              placeholder="e.g., Toyota Camry 2020"
              disabled={isSubmitting}
              className={`w-full bg-gray-800 border ${
                errors.vehicleModel ? 'border-red-500' : 'border-gray-700'
              } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            {errors.vehicleModel && (
              <p className="text-red-400 text-sm mt-1 flex items-center animate-slideDown">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.vehicleModel}
              </p>
            )}
          </div>

          {/* Quantity and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                <Hash className="inline w-4 h-4 mr-2" />
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                max="100"
                disabled={isSubmitting}
                className={`w-full bg-gray-800 border ${
                  errors.quantity ? 'border-red-500' : 'border-gray-700'
                } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              {errors.quantity && (
                <p className="text-red-400 text-sm mt-1 text-xs animate-slideDown">{errors.quantity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Any additional information or special requirements..."
              disabled={isSubmitting}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Request</span>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}