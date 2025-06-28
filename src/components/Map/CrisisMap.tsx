import React, { useState } from 'react';
import { MapPin, Filter, Layers, AlertTriangle, HandHeart, Zap } from 'lucide-react';
import { Alert, AssistanceRequest } from '../../types';

interface CrisisMapProps {
  alerts: Alert[];
  requests: AssistanceRequest[];
}

export const CrisisMap: React.FC<CrisisMapProps> = ({ alerts, requests }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<Alert | AssistanceRequest | null>(null);

  const filters = [
    { id: 'all', label: 'All Events', icon: Layers },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'requests', label: 'Requests', icon: HandHeart },
    { id: 'critical', label: 'Critical', icon: Zap },
  ];

  const getMarkerColor = (item: Alert | AssistanceRequest) => {
    if ('severity' in item) {
      switch (item.severity) {
        case 'critical': return 'bg-red-600';
        case 'high': return 'bg-red-500';
        case 'medium': return 'bg-yellow-500';
        case 'low': return 'bg-green-500';
        default: return 'bg-gray-500';
      }
    } else {
      switch (item.priority) {
        case 'urgent': return 'bg-red-600';
        case 'high': return 'bg-red-500';
        case 'medium': return 'bg-yellow-500';
        case 'low': return 'bg-green-500';
        default: return 'bg-gray-500';
      }
    }
  };

  const filteredItems = [...alerts, ...requests].filter(item => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'alerts') return 'severity' in item;
    if (selectedFilter === 'requests') return 'priority' in item;
    if (selectedFilter === 'critical') {
      return ('severity' in item && item.severity === 'critical') || 
             ('priority' in item && item.priority === 'urgent');
    }
    return true;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Filter Bar */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Crisis Map</h3>
          <div className="flex items-center space-x-2">
            {filters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === filter.id
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-96 bg-gray-100">
        {/* Simulated Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 opacity-50" />
        
        {/* Map Markers */}
        <div className="absolute inset-0 p-4">
          {filteredItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform ${getMarkerColor(item)}`}
              style={{
                left: `${20 + (index * 15) % 60}%`,
                top: `${20 + (index * 20) % 60}%`,
              }}
            >
              <div className="w-full h-full rounded-full animate-pulse" />
            </button>
          ))}
        </div>

        {/* Location Info Panel */}
        {selectedItem && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {'severity' in selectedItem ? (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  ) : (
                    <HandHeart className="h-4 w-4 text-blue-500" />
                  )}
                  <span className="text-sm font-medium text-gray-900">
                    {'severity' in selectedItem ? 'Emergency Alert' : 'Assistance Request'}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{selectedItem.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{selectedItem.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {selectedItem.location.address}
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-600 rounded-full mr-2" />
              Critical
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
              Medium
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
              Low
            </div>
          </div>
          <span>{filteredItems.length} active incidents</span>
        </div>
      </div>
    </div>
  );
};