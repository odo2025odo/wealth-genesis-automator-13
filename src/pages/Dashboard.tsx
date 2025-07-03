
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useInvestment } from '@/contexts/InvestmentContext';
import Navbar from '@/components/Navbar';
import BottomNavigation from '@/components/BottomNavigation';
import WelcomeBonusModal from '@/components/WelcomeBonusModal';
import QuickActions from '@/components/QuickActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user } = useAuth();
  const { investments, updateInvestments, formatNaira } = useInvestment();
  const [showBalance, setShowBalance] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    if (user) {
      // Check if user is new (just registered) and hasn't seen welcome modal
      const hasSeenWelcome = localStorage.getItem(`welcome_shown_${user.id}`);
      if (!hasSeenWelcome && user.balance >= 500) {
        setShowWelcomeModal(true);
        localStorage.setItem(`welcome_shown_${user.id}`, 'true');
      }
    }
  }, [user]);

  useEffect(() => {
    updateInvestments();
    const interval = setInterval(updateInvestments, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [updateInvestments]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Welcome Message */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Here's your investment overview</p>
        </div>

        {/* Balance Card */}
        <Card className="mb-6 bg-gradient-to-r from-green-600 to-green-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Account Balance</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
              className="text-white hover:bg-white/20"
            >
              {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {showBalance ? formatNaira(user.balance) : '₦ ****'}
            </div>
            <p className="text-green-100">Available for investment</p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <QuickActions />
      </div>

      <BottomNavigation />
      
      {/* Welcome Bonus Modal */}
      <WelcomeBonusModal 
        isOpen={showWelcomeModal} 
        onClose={() => setShowWelcomeModal(false)}
        userName={user.name}
      />
    </div>
  );
};

export default Dashboard;
