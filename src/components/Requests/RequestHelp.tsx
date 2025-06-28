import React, { useState } from 'react';
import { HandHeart, MapPin, Clock, Send } from 'lucide-react';
import { useLocation } from '../../hooks/useLocation';
import { useAuth } from '../../hooks/useAuth';

export const RequestHelp: React.FC = () => {
  const { user } = useAuth();
  const { location, loading: locationLoading } = useLocation();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'other' as const,
    priority: 'medium' as const,
    address: '',
    urgentBy: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const helpTypes = [
    { id: 'medical', label: 'Medical Help', icon: '🏥', color: 'text-red-600 bg-red-50' },
    { id: 'food', label: 'Food & Water', icon: '🍽️', color: 'text-orange-600 bg-orange-50' },
    { id: 'shelter', label: 'Shelter', icon: '🏠', color: 'text-blue-600 bg-blue-50' },
    { id: 'transportation', label: 'Transportation', icon: '🚗', color: 'text-green-600 bg-green-50' },
    { id: 'rescue', label: 'Rescue', icon: '🚁', color: 'text-red-600 bg-red-50' },
    { id: 'other', label: 'Other', icon: '🤝', color: 'text-gray-600 bg-gray-50' },
  ];

  const priorityLevels = [
    { id: 'low', label: 'Low Priority', color: 'text-green-600 bg-green-100' },
    { id: 'medium', label: 'Medium Priority', color: 'text-yellow-600 bg-yellow-100' },
    { id: 'high', label: 'High Priority', color: 'text-orange-600 bg-orange-100' },
    { id: 'urgent', label: 'Urgent', color: 'text-red-600 bg-red-100' },
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
      priority: 'medium',
      address: '',
      urgentBy: '',
    });
    
    setIsSubmitting(false);
    alert('Help request submitted successfully! Volunteers will be notified.');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
            <HandHeart className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-900">Request Assistance</h2>
            <p className="text-sm text-gray-600">Connect with volunteers who can help you</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Help Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Type of Assistance Needed
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {helpTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type.id as any }))}
                  className={`p-3 rounded-lg border text-left hover:bg-gray-50 transition-colors ${
                    formData.type === type.id
                      ? 'border-blue-300 bg-blue-50 ring-1 ring-blue-500'
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
              Request Title
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Brief description of what you need"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Provide specific details about your situation and what help you need"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Priority Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {priorityLevels.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority: level.id as any }))}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    formData.priority === level.id
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
              Your Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter your current address or location"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {location && (
              <p className="text-xs text-gray-500 mt-1">
                Current location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </p>
            )}
          </div>

          {/* Urgency Timeline */}
          <div>
            <label htmlFor="urgentBy" className="block text-sm font-medium text-gray-700 mb-2">
              When do you need help by? (Optional)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="datetime-local"
                id="urgentBy"
                value={formData.urgentBy}
                onChange={(e) => setFormData(prev => ({ ...prev, urgentBy: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Contact Information Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <HandHeart className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-900">How volunteers will contact you</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Volunteers will be able to message you through the platform once they accept your request. 
                  Your personal contact information will only be shared with verified responders.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Submit Request
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};