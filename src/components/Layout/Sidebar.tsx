import React from 'react';
import { 
  Home, 
  AlertTriangle, 
  HandHeart, 
  MessageCircle, 
  Map, 
  Settings,
  BarChart3,
  Users,
  X,
  Newspaper
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();

  const citizenMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'map', label: 'Crisis Map', icon: Map },
    { id: 'alerts', label: 'Create Alert', icon: AlertTriangle },
    { id: 'requests', label: 'Request Help', icon: HandHeart },
    { id: 'news', label: 'Crisis News', icon: Newspaper },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
  ];

  const volunteerMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'map', label: 'Crisis Map', icon: Map },
    { id: 'volunteer', label: 'Volunteer Hub', icon: Users },
    { id: 'alerts', label: 'Create Alert', icon: AlertTriangle },
    { id: 'news', label: 'Crisis News', icon: Newspaper },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
  ];

  const menuItems = user?.role === 'volunteer' ? volunteerMenuItems : citizenMenuItems;

  const adminItems = [
    { id: 'admin', label: 'Admin Panel', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (id: string) => {
    onTabChange(id);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 lg:hidden">
          <span className="text-lg font-semibold text-gray-900">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`
                  w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200
                  ${activeTab === item.id
                    ? 'bg-red-50 text-red-700 border-r-4 border-red-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}

          {(user?.role === 'admin' || user?.role === 'ngo') && (
            <>
              <div className="pt-6 mt-6 border-t border-gray-200">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Administration
                </p>
              </div>
              {adminItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`
                      w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200
                      ${activeTab === item.id
                        ? 'bg-red-50 text-red-700 border-r-4 border-red-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </>
          )}
        </nav>
      </div>
    </>
  );
};