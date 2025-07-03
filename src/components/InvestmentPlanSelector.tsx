
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { useInvestment } from '@/contexts/InvestmentContext';
import { useAuth } from '@/contexts/AuthContext';
import BankTransferModal from './BankTransferModal';

interface InvestmentPlanSelectorProps {
  plan: any;
  onInvest: (planId: string, amount: number) => void;
}

const InvestmentPlanSelector: React.FC<InvestmentPlanSelectorProps> = ({ plan, onInvest }) => {
  const [customAmount, setCustomAmount] = useState(plan.minAmount);
  const [showBankTransfer, setShowBankTransfer] = useState(false);
  const { formatNaira } = useInvestment();
  const { user } = useAuth();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || plan.minAmount;
    if (value >= plan.minAmount && value <= plan.maxAmount) {
      setCustomAmount(value);
    }
  };

  const calculateDailyReturn = (amount: number) => {
    return (amount * plan.roi) / 100;
  };

  const calculateTotalReturn = (amount: number) => {
    const dailyReturn = calculateDailyReturn(amount);
    return dailyReturn * plan.duration;
  };

  const handleInvestClick = () => {
    onInvest(plan.id, customAmount);
    setShowBankTransfer(true);
  };

  // Define colors for each plan
  const planColors = {
    '1': 'bg-red-500',
    '2': 'bg-blue-500', 
    '3': 'bg-green-500',
    '4': 'bg-purple-500',
    '5': 'bg-orange-500',
    '6': 'bg-pink-500',
  };

  const cardColor = planColors[plan.id as keyof typeof planColors] || 'bg-gray-500';

  return (
    <>
      <Card className={`relative hover:shadow-lg transition-shadow ${plan.popular ? 'border-2 border-blue-500' : ''}`}>
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
            <Badge className="bg-blue-600 text-white px-4 py-1 flex items-center gap-1">
              <Star className="h-3 w-3" />
              Most Popular
            </Badge>
          </div>
        )}
        
        <CardHeader className="text-center pb-4">
          {/* Car Image */}
          <div className="w-full h-32 mb-4 rounded-lg overflow-hidden">
            <img 
              src={plan.carImage} 
              alt={plan.carName}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback image if the main image fails to load
                e.currentTarget.src = 'https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=400&h=300&fit=crop';
              }}
            />
          </div>
          
          <CardTitle className="text-lg font-bold">{plan.carName}</CardTitle>
          
          <div className={`${cardColor} text-white p-4 rounded-lg mt-4`}>
            <div className="text-xl font-bold mb-2">{plan.name}</div>
            <div className="text-sm mb-2">{plan.carName}</div>
            <div className="text-sm mb-4">{plan.description}</div>
            
            <div className="text-3xl font-bold mb-2 text-yellow-300">{plan.roi}%</div>
            <div className="text-xs">Daily Return</div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Plan Price:</span>
              <span className="font-semibold text-sm">{formatNaira(plan.minAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Daily Income:</span>
              <span className="font-semibold text-sm">{formatNaira(calculateDailyReturn(plan.minAmount))}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Total Income after 30 days:</span>
              <span className="font-semibold text-sm">{formatNaira(calculateTotalReturn(plan.minAmount))}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Duration:</span>
              <span className="font-semibold text-sm">{plan.duration} days</span>
            </div>
          </div>

          <Button 
            className="w-full mt-4 text-sm font-bold bg-green-600 hover:bg-green-700 text-white" 
            onClick={handleInvestClick}
          >
            INVEST NOW
          </Button>
        </CardContent>
      </Card>

      <BankTransferModal
        isOpen={showBankTransfer}
        onClose={() => setShowBankTransfer(false)}
        amount={customAmount}
        planName={plan.name}
      />
    </>
  );
};

export default InvestmentPlanSelector;
