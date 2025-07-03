
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, TrendingUp, User } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/dashboard',
      isActive: location.pathname === '/dashboard'
    },
    {
      icon: TrendingUp,
      label: 'Products',
      path: '/plans',
      isActive: location.pathname === '/plans'
    },
    {
      icon: User,
      label: 'Account',
      path: '/profile',
      isActive: location.pathname === '/profile'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 safe-area-bottom z-50 shadow-lg">
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-3 gap-2">
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center py-3 px-2 rounded-lg transition-colors ${
                  item.isActive 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="h-5 w-5 mb-1 flex-shrink-0" />
                <span className="text-xs font-medium text-center">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
