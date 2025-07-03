
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Eye, EyeOff } from 'lucide-react';

interface WithdrawalPinVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

const WithdrawalPinVerification: React.FC<WithdrawalPinVerificationProps> = ({ 
  isOpen, 
  onClose, 
  onVerified 
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    if (pin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "Please enter your 4-digit PIN",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      // Get user data to verify PIN
      const users = JSON.parse(localStorage.getItem('hyip_users') || '[]');
      const userData = users.find((u: any) => u.id === user.id);
      
      if (!userData || userData.withdrawalPin !== pin) {
        toast({
          title: "Incorrect PIN",
          description: "The PIN you entered is incorrect",
          variant: "destructive",
        });
        setPin('');
        return;
      }

      toast({
        title: "PIN Verified",
        description: "You can now proceed with your withdrawal",
      });
      
      onVerified();
      onClose();
      setPin('');
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-xl font-bold">Verify Your PIN</DialogTitle>
          <DialogDescription>
            Enter your 4-digit withdrawal PIN to continue
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="verifyPin">Withdrawal PIN</Label>
            <div className="relative">
              <Input
                id="verifyPin"
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                maxLength={4}
                className="text-center text-2xl tracking-widest"
                required
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPin(!showPin)}
              >
                {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isVerifying || pin.length !== 4}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isVerifying ? 'Verifying...' : 'Verify PIN'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalPinVerification;
