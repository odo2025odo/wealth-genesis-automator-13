
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useInvestment } from '@/contexts/InvestmentContext';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';

const DepositHistory = () => {
  const { user } = useAuth();
  const { formatNaira } = useInvestment();

  if (!user) return null;

  // Get deposit history from localStorage
  const deposits = JSON.parse(localStorage.getItem('hyip_pending_payments') || '[]')
    .filter((p: any) => p.userId === user.id)
    .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {deposits.length > 0 ? (
        deposits.map((deposit: any) => (
          <div key={deposit.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-semibold">Deposit</p>
                  <p className="text-sm text-gray-600">For {deposit.planName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatNaira(deposit.amount)}</p>
                <Badge className={getStatusColor(deposit.status)}>
                  {deposit.status}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {new Date(deposit.timestamp).toLocaleDateString()} at {new Date(deposit.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No deposit history found.</p>
        </div>
      )}
    </div>
  );
};

export default DepositHistory;
