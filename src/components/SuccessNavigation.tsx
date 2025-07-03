
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, LayoutDashboard } from 'lucide-react';

const SuccessNavigation = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
      <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
          className="flex items-center justify-center gap-2"
        >
          <Home className="h-4 w-4" />
          Home
        </Button>
        <Button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center justify-center gap-2"
        >
          <LayoutDashboard className="h-4 w-4" />
          User Dashboard
        </Button>
      </div>
    </div>
  );
};

export default SuccessNavigation;
