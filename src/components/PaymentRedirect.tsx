
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2 } from 'lucide-react';

interface PaymentRedirectProps {
  onCancel: () => void;
}

const PaymentRedirect: React.FC<PaymentRedirectProps> = ({ onCancel }) => {
  useEffect(() => {
    // Redirect to Flutterwave payment link after a short delay
    const timer = setTimeout(() => {
      window.open('https://flutterwave.com/pay/9jogljssaeri', '_blank');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handlePayNow = () => {
    window.open('https://flutterwave.com/pay/9jogljssaeri', '_blank');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        </div>
        <CardTitle className="text-2xl">Redirecting to Payment</CardTitle>
        <CardDescription>
          You will be redirected to complete your payment securely
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handlePayNow}
          className="w-full"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          PAY NOW
        </Button>
        <Button 
          onClick={onCancel}
          variant="outline"
          className="w-full"
        >
          Cancel
        </Button>
        <p className="text-xs text-gray-500 text-center">
          If the redirect doesn't work automatically, click "PAY NOW" above
        </p>
      </CardContent>
    </Card>
  );
};

export default PaymentRedirect;
