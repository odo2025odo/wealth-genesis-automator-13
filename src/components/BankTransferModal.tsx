
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BankTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  planName: string;
}

const BankTransferModal: React.FC<BankTransferModalProps> = ({ 
  isOpen, 
  onClose, 
  amount, 
  planName 
}) => {
  const { toast } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const bankDetails = {
    bank: 'OPAY',
    accountNumber: '6141289098',
    accountName: 'CHIBUZO KINGSLEY ODO'
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast({
        title: "Copied!",
        description: `${field} copied to clipboard`,
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the details manually",
        variant: "destructive",
      });
    }
  };

  const handlePaymentConfirmation = () => {
    setPaymentConfirmed(true);
    toast({
      title: "Payment Confirmation Received",
      description: "Your payment is pending confirmation. You will be notified once it's processed.",
      duration: 5000,
    });
  };

  if (paymentConfirmed) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-600">
              <CheckCircle className="h-5 w-5" />
              Pending Confirmation
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 text-center">
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">Payment Received!</h3>
              <p className="text-orange-800 mb-4">
                Your payment of ₦{amount.toLocaleString()} for {planName} is being processed.
              </p>
              <p className="text-sm text-orange-700">
                You will receive a confirmation notification once your payment has been verified.
              </p>
            </div>

            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Bank Transfer Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Investment Details</h3>
            <p className="text-blue-800">Plan: {planName}</p>
            <p className="text-blue-800 font-bold">Amount: ₦{amount.toLocaleString()}</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Transfer to:</h3>
            
            {/* Bank Name */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Bank</p>
                <p className="font-medium">{bankDetails.bank}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(bankDetails.bank, 'Bank name')}
                className="ml-2"
              >
                {copiedField === 'Bank name' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Account Number */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Account Number</p>
                <p className="font-medium font-mono">{bankDetails.accountNumber}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(bankDetails.accountNumber, 'Account number')}
                className="ml-2"
              >
                {copiedField === 'Account number' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Account Name */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Account Name</p>
                <p className="font-medium">{bankDetails.accountName}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(bankDetails.accountName, 'Account name')}
                className="ml-2"
              >
                {copiedField === 'Account name' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Transfer exactly ₦{amount.toLocaleString()}</li>
              <li>• Your investment will be activated after payment confirmation</li>
              <li>• Keep your transfer receipt for reference</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={handlePaymentConfirmation}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              I have made the payment
            </Button>
            <Button onClick={onClose} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BankTransferModal;
