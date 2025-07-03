
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useInvestment } from '@/contexts/InvestmentContext';
import { nigerianBanks } from '@/utils/nigerianBanks';
import { Loader2, DollarSign, AlertCircle } from 'lucide-react';
import WithdrawalPinSetup from './WithdrawalPinSetup';
import WithdrawalPinVerification from './WithdrawalPinVerification';

const WithdrawalForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInvestmentRequiredModal, setShowInvestmentRequiredModal] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showPinVerification, setShowPinVerification] = useState(false);
  const [hasWithdrawalPin, setHasWithdrawalPin] = useState(false);

  const { user } = useAuth();
  const { requestWithdrawal, formatNaira, investments } = useInvestment();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // Check if user has withdrawal PIN
      const users = JSON.parse(localStorage.getItem('hyip_users') || '[]');
      const userData = users.find((u: any) => u.id === user.id);
      setHasWithdrawalPin(!!userData?.withdrawalPin);
    }
  }, [user]);

  const handleWithdrawClick = () => {
    if (!user) return;

    // Check if user has any investments
    const userInvestments = investments.filter(inv => inv.userId === user.id);
    if (userInvestments.length === 0) {
      setShowInvestmentRequiredModal(true);
      return;
    }

    // Check if user has withdrawal PIN
    if (!hasWithdrawalPin) {
      setShowPinSetup(true);
      return;
    }

    // Open withdrawal form
    setIsOpen(true);
  };

  const handlePinSet = () => {
    setHasWithdrawalPin(true);
    setIsOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const withdrawalAmount = parseFloat(amount);
    
    if (withdrawalAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }

    if (withdrawalAmount < 1000) {
      toast({
        title: "Minimum Withdrawal",
        description: "Minimum withdrawal amount is ₦1,000",
        variant: "destructive",
      });
      return;
    }

    if (withdrawalAmount > user.balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }

    if (!bankName || !accountNumber || !accountName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (accountNumber.length !== 10) {
      toast({
        title: "Invalid Account Number",
        description: "Account number must be exactly 10 digits",
        variant: "destructive",
      });
      return;
    }

    // Show PIN verification before processing withdrawal
    setShowPinVerification(true);
  };

  const handlePinVerified = () => {
    setIsSubmitting(true);
    try {
      const withdrawalAmount = parseFloat(amount);
      requestWithdrawal(withdrawalAmount, bankName, accountNumber, accountName);
      toast({
        title: "Withdrawal Requested",
        description: "Your withdrawal request has been submitted for processing",
      });
      
      // Reset form
      setAmount('');
      setBankName('');
      setAccountNumber('');
      setAccountName('');
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Failed to submit withdrawal request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Button 
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        onClick={handleWithdrawClick}
      >
        <DollarSign className="h-4 w-4 mr-2" />
        Request Withdrawal
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request Withdrawal</DialogTitle>
            <DialogDescription>
              Available Balance: {formatNaira(user.balance)}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <Label htmlFor="amount">Withdrawal Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Minimum withdrawal ₦1,000"
                min="1000"
                max={user.balance}
                required
              />
            </div>

            <div>
              <Label htmlFor="bank">Select Bank</Label>
              <Select value={bankName} onValueChange={setBankName} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your bank" />
                </SelectTrigger>
                <SelectContent>
                  {nigerianBanks.map((bank) => (
                    <SelectItem key={bank.code} value={bank.name}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter 10-digit account number"
                maxLength={10}
                minLength={10}
                required
              />
            </div>

            <div>
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Enter account holder's full name"
                required
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Continue to PIN Verification'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* PIN Setup Modal */}
      <WithdrawalPinSetup
        isOpen={showPinSetup}
        onClose={() => setShowPinSetup(false)}
        onPinSet={handlePinSet}
      />

      {/* PIN Verification Modal */}
      <WithdrawalPinVerification
        isOpen={showPinVerification}
        onClose={() => setShowPinVerification(false)}
        onVerified={handlePinVerified}
      />

      {/* Investment Required Modal */}
      <Dialog open={showInvestmentRequiredModal} onOpenChange={setShowInvestmentRequiredModal}>
        <DialogContent className="max-w-sm mx-auto">
          <div className="relative bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
            {/* Main Content */}
            <div className="text-center space-y-4">
              {/* Warning Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-green-800">
                  Investment Required
                </h2>
                <p className="text-green-700 text-sm leading-relaxed">
                  You must invest before you can make a withdrawal
                </p>
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => setShowInvestmentRequiredModal(false)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
              >
                Start Investing Now
              </Button>
            </div>

            {/* Bottom decorative line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-400 rounded-b-xl"></div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WithdrawalForm;
