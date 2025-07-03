
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift, CheckCircle, Sparkles } from 'lucide-react';

interface WelcomeBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const WelcomeBonusModal: React.FC<WelcomeBonusModalProps> = ({
  isOpen,
  onClose,
  userName
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <div className="relative bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
          {/* Decorative elements */}
          <div className="absolute top-2 right-2">
            <Sparkles className="h-6 w-6 text-green-500 animate-pulse" />
          </div>
          <div className="absolute top-2 left-2">
            <Sparkles className="h-4 w-4 text-green-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          
          {/* Main Content */}
          <div className="text-center space-y-4">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <CheckCircle className="h-6 w-6 text-green-600 bg-white rounded-full" />
                </div>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-green-800">
                Welcome, {userName}! 🎉
              </h2>
              <p className="text-green-700 text-sm leading-relaxed">
                Congratulations! Your account has been successfully created.
              </p>
            </div>

            {/* Bonus Amount */}
            <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
              <div className="flex flex-col items-center space-y-1">
                <p className="text-sm text-gray-600 font-medium">Welcome Bonus</p>
                <div className="text-3xl font-bold text-green-600">
                  ₦1,000
                </div>
                <p className="text-xs text-gray-500">Added to your balance</p>
              </div>
            </div>

            {/* Success Message */}
            <div className="bg-green-500 text-white rounded-lg p-3">
              <p className="text-sm font-medium">
                ✨ Your bonus has been automatically credited to your account!
              </p>
            </div>

            {/* Action Button */}
            <Button 
              onClick={onClose}
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
  );
};

export default WelcomeBonusModal;
