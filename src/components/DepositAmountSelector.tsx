
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BankTransferModal from './BankTransferModal';

interface DepositAmountSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
  minAmount?: number;
  maxAmount?: number;
}

const DepositAmountSelector: React.FC<DepositAmountSelectorProps> = ({ 
  isOpen, 
  onClose, 
  planName = "General Deposit",
  minAmount = 3000,
  maxAmount = 500000
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showBankTransfer, setShowBankTransfer] = useState(false);

  // Predefined amounts based on typical investment amounts
  const predefinedAmounts = [3000, 6000, 10000, 20000, 30000, 50000, 70000, 100000, 200000, 500000];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(value);
    setSelectedAmount(value ? parseInt(value) : null);
  };

  const handleRechargeNow = () => {
    if (selectedAmount && selectedAmount >= minAmount && selectedAmount <= maxAmount) {
      setShowBankTransfer(true);
    }
  };

  const finalAmount = selectedAmount || 0;

  return (
    <>
      <Dialog open={isOpen && !showBankTransfer} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Amount</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              {predefinedAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "default" : "outline"}
                  onClick={() => handleAmountSelect(amount)}
                  className="h-12 text-sm"
                >
                  ₦{amount.toLocaleString()}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Custom Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                <Input
                  type="text"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-gray-500">
                Min: ₦{minAmount.toLocaleString()} - Max: ₦{maxAmount.toLocaleString()}
              </p>
            </div>

            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-semibold"
              onClick={handleRechargeNow}
              disabled={!selectedAmount || selectedAmount < minAmount || selectedAmount > maxAmount}
            >
              Recharge Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BankTransferModal
        isOpen={showBankTransfer}
        onClose={() => {
          setShowBankTransfer(false);
          onClose();
        }}
        amount={finalAmount}
        planName={planName}
      />
    </>
  );
};

export default DepositAmountSelector;
