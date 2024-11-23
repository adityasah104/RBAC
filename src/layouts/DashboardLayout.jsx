import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Settings, LogOut, Home, 
  Shield, ChevronDown, Menu, X 
} from 'lucide-react';

const DashboardLayout = ({ children, currentUser }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

// In DashboardLayout.tsx
const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      path: '/dashboard',
      allowedRoles: ['admin', 'moderator', 'client']
    },
    {
      title: 'User Management',
      icon: <Users className="w-5 h-5" />,
      path: '/dashboard/users',
      allowedRoles: ['admin', 'moderator']
    },
    {
      title: 'Role Management',
      icon: <Shield className="w-5 h-5" />,
      path: '/dashboard/roles',
      allowedRoles: ['admin']
    },
  ];

  const hasAccess = (allowedRoles) => {
    return allowedRoles.includes(currentUser.role);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                {isSidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              <h1 className="ml-4 text-xl font-semibold">Admin Dashboard</h1>
            </div>

            {/* Profile Dropdown */}
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {currentUser.name[0].toUpperCase()}
                  </div>
                  <div className="text-sm text-left">
                    <p className="font-medium">{currentUser.name}</p>
                    <p className="text-gray-500 capitalize">{currentUser.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <button
                        onClick={() => navigate('/dashboard/profile')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`fixed left-0 top-16 h-full bg-white shadow-md transition-width duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col py-4">
          {menuItems.map((item, index) => (
            hasAccess(item.allowedRoles) && (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 ${
                  isSidebarOpen ? 'justify-start space-x-4' : 'justify-center'
                }`}
              >
                {item.icon}
                {isSidebarOpen && <span>{item.title}</span>}
              </button>
            )
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={`pt-16 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;