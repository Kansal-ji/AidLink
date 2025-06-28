import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, HandHeart, CheckCircle, Clock } from 'lucide-react';
import { Alert, AssistanceRequest } from '../../types';

interface RecentActivityProps {
  alerts: Alert[];
  requests: AssistanceRequest[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  alerts,
  requests,
}) => {
  const activities = [
    ...alerts.slice(0, 3).map(alert => ({
      id: alert.id,
      type: 'alert' as const,
      title: alert.title,
      location: alert.location.address,
      time: alert.createdAt,
      severity: alert.severity,
      status: alert.status,
    })),
    ...requests.slice(0, 3).map(request => ({
      id: request.id,
      type: 'request' as const,
      title: request.title,
      location: request.location.address,
      time: request.createdAt,
      priority: request.priority,
      status: request.status,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'in-progress':
      case 'accepted':
        return 'text-blue-600 bg-blue-100';
      case 'resolved':
      case 'completed':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getIcon = (type: string, status: string) => {
    if (type === 'alert') {
      return AlertTriangle;
    }
    if (status === 'completed' || status === 'resolved') {
      return CheckCircle;
    }
    if (status === 'in-progress' || status === 'accepted') {
      return Clock;
    }
    return HandHeart;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = getIcon(activity.type, activity.status);
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Icon className="h-5 w-5 text-gray-400 mt-1" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {activity.location}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};