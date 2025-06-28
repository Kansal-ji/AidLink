import React, { useState, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { StatsCard } from './components/Dashboard/StatsCard';
import { RecentActivity } from './components/Dashboard/RecentActivity';
import { CrisisMap } from './components/Map/CrisisMap';
import { CreateAlert } from './components/Alerts/CreateAlert';
import { RequestHelp } from './components/Requests/RequestHelp';
import { VolunteerDashboard } from './components/Volunteer/VolunteerDashboard';
import { CrisisNews } from './components/News/CrisisNews';
import { AuthContainer } from './components/Auth/AuthContainer';
import { useAuth } from './hooks/useAuth';
import { mockAlerts, mockRequests } from './data/mockData';
import { AlertTriangle, HandHeart, Users, CheckCircle } from 'lucide-react';

function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount] = useState(3);

  const handleNotificationClick = () => {
    console.log('Notifications clicked');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Active Alerts"
                value={mockAlerts.filter(a => a.status === 'active').length}
                icon={AlertTriangle}
                color="red"
                trend={{ value: 12, isPositive: false }}
              />
              <StatsCard
                title="Help Requests"
                value={mockRequests.filter(r => r.status === 'pending').length}
                icon={HandHeart}
                color="blue"
                trend={{ value: 8, isPositive: true }}
              />
              <StatsCard
                title="Active Volunteers"
                value={45}
                icon={Users}
                color="green"
                trend={{ value: 15, isPositive: true }}
              />
              <StatsCard
                title="Resolved Today"
                value={12}
                icon={CheckCircle}
                color="yellow"
                trend={{ value: 5, isPositive: true }}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CrisisMap alerts={mockAlerts} requests={mockRequests} />
              </div>
              <div>
                <RecentActivity alerts={mockAlerts} requests={mockRequests} />
              </div>
            </div>
          </div>
        );
      case 'map':
        return <CrisisMap alerts={mockAlerts} requests={mockRequests} />;
      case 'alerts':
        return <CreateAlert />;
      case 'requests':
        return user?.role === 'volunteer' ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-4xl mb-4">🚫</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
            <p className="text-gray-600">Volunteers cannot create help requests. Use the Volunteer Hub to respond to requests.</p>
          </div>
        ) : <RequestHelp />;
      case 'volunteer':
        return user?.role === 'volunteer' ? (
          <VolunteerDashboard requests={mockRequests.filter(r => r.status === 'pending')} />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-4xl mb-4">🚫</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Volunteer Access Only</h3>
            <p className="text-gray-600">This section is only available for registered volunteers.</p>
          </div>
        );
      case 'news':
        return <CrisisNews />;
      case 'messages':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Messages</h3>
            <p className="text-gray-600">Real-time messaging interface would be implemented here.</p>
          </div>
        );
      case 'admin':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Admin Panel</h3>
            <p className="text-gray-600">Administrative dashboard for managing the platform would be implemented here.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600">User settings and preferences would be configured here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthContainer />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        onNotificationClick={handleNotificationClick}
        notificationCount={notificationCount}
      />
      
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 p-6 lg:ml-0">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;