import React, { useState } from 'react';
import { MapPin, Clock, User, CheckCircle, MessageCircle, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AssistanceRequest } from '../../types';

interface VolunteerDashboardProps {
  requests: AssistanceRequest[];
}

export const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({ requests }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<AssistanceRequest | null>(null);

  const filters = [
    { id: 'all', label: 'All Requests' },
    { id: 'medical', label: 'Medical' },
    { id: 'food', label: 'Food & Water' },
    { id: 'shelter', label: 'Shelter' },
    { id: 'transportation', label: 'Transportation' },
    { id: 'rescue', label: 'Rescue' },
  ];

  const filteredRequests = requests.filter(request => {
    if (selectedFilter === 'all') return true;
    return request.type === selectedFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medical': return '🏥';
      case 'food': return '🍽️';
      case 'shelter': return '🏠';
      case 'transportation': return '🚗';
      case 'rescue': return '🚁';
      default: return '🤝';
    }
  };

  const handleAcceptRequest = (request: AssistanceRequest) => {
    alert(`You have accepted the request: ${request.title}`);
    // In a real app, this would update the request status and notify the requester
  };

  const handleContactRequester = (request: AssistanceRequest) => {
    setSelectedRequest(request);
    // In a real app, this would open a chat interface
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Volunteer Hub</h2>
            <p className="text-sm text-gray-600 mt-1">
              Help people in need by responding to assistance requests
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{filteredRequests.length}</p>
            <p className="text-sm text-gray-500">Available Requests</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedFilter === filter.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{getTypeIcon(request.type)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(request.priority)}`}>
                        {request.priority} priority
                      </span>
                      <span className="text-sm text-gray-500 capitalize">{request.type}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{request.description}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {request.location.address}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {request.requester.name}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleAcceptRequest(request)}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept Request
                  </button>
                  <button
                    onClick={() => handleContactRequester(request)}
                    className="flex items-center px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Requester
                  </button>
                </div>
              </div>

              <div className="ml-4 text-right">
                <div className="text-sm text-gray-500">
                  Distance
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  2.3 km
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests available</h3>
            <p className="text-gray-600">
              {selectedFilter === 'all'
                ? 'There are currently no assistance requests in your area.'
                : `No ${selectedFilter} requests available at the moment.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};