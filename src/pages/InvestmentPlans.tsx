
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useInvestment } from '@/contexts/InvestmentContext';
import Navbar from '@/components/Navbar';
import InvestmentPlanSelector from '@/components/InvestmentPlanSelector';
import { useToast } from '@/hooks/use-toast';

const InvestmentPlans = () => {
  const { user, processReferralCommission } = useAuth();
  const { plans } = useInvestment();
  const { toast } = useToast();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleInvest = (planId: string, amount: number) => {
    // Process referral commission if applicable
    if (user.referredBy) {
      processReferralCommission(user.id, amount);
    }

    // Show bank transfer details
    toast({
      title: "Investment Initiated",
      description: `Please transfer ₦${amount.toLocaleString()} to the account details shown`,
      duration: 5000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Investment Plans</h1>
          <p className="text-xl text-gray-600">Choose the perfect plan for your investment goals</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {plans.map((plan) => (
            <InvestmentPlanSelector
              key={plan.id}
              plan={plan}
              onInvest={handleInvest}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestmentPlans;
