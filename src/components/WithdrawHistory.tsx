
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useInvestment } from '@/contexts/InvestmentContext';
import { Badge } from '@/components/ui/badge';
import { ArrowDownLeft } from 'lucide-react';

const WithdrawHistory = () => {
  const { user } = useAuth();
  const { formatNaira } = useInvestment();

  if (!user) return null;

  // Get withdrawal history from localStorage
  const withdrawals = JSON.parse(localStorage.getItem('hyip_withdrawal_requests') || '[]')
    .filter((w: any) => w.userId === user.id)
    .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
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
      {withdrawals.length > 0 ? (
        withdrawals.map((withdrawal: any) => (
          <div key={withdrawal.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <ArrowDownLeft className="h-4 w-4 text-red-600" />
                <div>
                  <p className="font-semibold">Withdrawal</p>
                  <p className="text-sm text-gray-600">To {withdrawal.bankName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatNaira(withdrawal.amount)}</p>
                <Badge className={getStatusColor(withdrawal.status)}>
                  {withdrawal.status}
                </Badge>
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Account: {withdrawal.accountNumber} ({withdrawal.accountName})</p>
              <p>{new Date(withdrawal.timestamp).toLocaleDateString()} at {new Date(withdrawal.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No withdrawal history found.</p>
        </div>
      )}
    </div>
  );
};

export default WithdrawHistory;
