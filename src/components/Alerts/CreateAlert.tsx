import React, { useState } from 'react';
import { AlertTriangle, MapPin, Camera, Send } from 'lucide-react';
import { useLocation } from '../../hooks/useLocation';
import { useAuth } from '../../hooks/useAuth';

export const CreateAlert: React.FC = () => {
  const { user } = useAuth();
  const { location, loading: locationLoading } = useLocation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'other' as const,
    severity: 'medium' as const,
    address: '',
    images: [] as File[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const alertTypes = [
    { id: 'fire', label: 'Fire', icon: '🔥' },
    { id: 'flood', label: 'Flood', icon: '🌊' },
    { id: 'medical', label: 'Medical Emergency', icon: '🚑' },
    { id: 'accident', label: 'Accident', icon: '🚗' },
    { id: 'other', label: 'Other', icon: '⚠️' },
  ];

  const severityLevels = [
    { id: 'low', label: 'Low', color: 'text-green-600 bg-green-100' },
    { id: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
    { id: 'high', label: 'High', color: 'text-orange-600 bg-orange-100' },
    { id: 'critical', label: 'Critical', color: 'text-red-600 bg-red-100' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Reset form
    setFormData({
      title: '',
      description: '',
      type: 'other',
      severity: 'medium',
      address: '',
      images: [],
    });
    
    setIsSubmitting(false);
    alert('Alert submitted successfully!');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 3), // Max 3 images
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-900">Create Emergency Alert</h2>
            <p className="text-sm text-gray-600">Report an emergency situation in your area</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Alert Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Emergency Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {alertTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type.id as any }))}
                  className={`p-3 rounded-lg border text-left hover:bg-gray-50 transition-colors ${
                    formData.type === type.id
                      ? 'border-red-300 bg-red-50 ring-1 ring-red-500'
                      : 'border-gray-300'
                  }`}
                >
                  <div className="text-lg mb-1">{type.icon}</div>
                  <div className="text-sm font-medium text-gray-900">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Alert Title
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Brief description of the emergency"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Provide detailed information about the emergency"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Severity Level
            </label>
            <div className="flex space-x-2">
              {severityLevels.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, severity: level.id as any }))}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    formData.severity === level.id
                      ? level.color
                      : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter the address or location"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            {location && (
              <p className="text-xs text-gray-500 mt-1">
                Current location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </p>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <Camera className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload images (max 3)
                </span>
              </label>
            </div>
            {formData.images.length > 0 && (
              <div className="mt-2 flex space-x-2">
                {formData.images.map((file, index) => (
                  <div key={index} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Submit Alert
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};