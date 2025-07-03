
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, ArrowDown, User, TrendingUp } from 'lucide-react';
import DepositAmountSelector from './DepositAmountSelector';

const QuickActions = () => {
  const navigate = useNavigate();
  const [showDepositModal, setShowDepositModal] = useState(false);

  const actions = [
    {
      icon: ArrowUp,
      label: 'Deposit',
      color: 'bg-green-600',
      onClick: () => setShowDepositModal(true)
    },
    {
      icon: ArrowDown,
      label: 'Withdraw',
      color: 'bg-green-600',
      onClick: () => navigate('/withdrawals')
    },
    {
      icon: User,
      label: 'Invite',
      color: 'bg-green-600',
      onClick: () => navigate('/referrals')
    },
    {
      icon: TrendingUp,
      label: 'Products',
      color: 'bg-green-600',
      onClick: () => navigate('/plans')
    }
  ];

  return (
    <>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <div
                key={index}
                onClick={action.onClick}
                className="bg-gray-100 rounded-lg p-6 flex flex-col items-center cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <div className={`${action.color} rounded-full p-4 mb-3`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <span className="font-medium text-gray-800">{action.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <DepositAmountSelector
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        planName="General Deposit"
        minAmount={3000}
        maxAmount={500000}
      />
    </>
  );
};

export default QuickActions;
