
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useInvestment } from '@/contexts/InvestmentContext';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft, TrendingUp } from 'lucide-react';

const TransactionHistory = () => {
  const { user } = useAuth();
  const { formatNaira } = useInvestment();

  if (!user) return null;

  // Get all transactions from localStorage
  const investments = JSON.parse(localStorage.getItem('hyip_investments') || '[]')
    .filter((inv: any) => inv.userId === user.id);
  
  const withdrawals = JSON.parse(localStorage.getItem('hyip_withdrawal_requests') || '[]')
    .filter((w: any) => w.userId === user.id);

  const deposits = JSON.parse(localStorage.getItem('hyip_pending_payments') || '[]')
    .filter((p: any) => p.userId === user.id && p.status === 'confirmed');

  // Combine all transactions
  const allTransactions = [
    ...investments.map((inv: any) => ({
      id: inv.id,
      type: 'investment',
      amount: inv.amount,
      date: inv.startDate,
      status: inv.status,
      description: `Investment in ${inv.planName}`
    })),
    ...withdrawals.map((w: any) => ({
      id: w.id,
      type: 'withdrawal',
      amount: w.amount,
      date: w.timestamp,
      status: w.status,
      description: `Withdrawal to ${w.bankName}`
    })),
    ...deposits.map((d: any) => ({
      id: d.id,
      type: 'deposit',
      amount: d.amount,
      date: d.timestamp,
      status: d.status,
      description: `Deposit for ${d.planName}`
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'investment':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'withdrawal':
        return <ArrowDownLeft className="h-4 w-4 text-red-600" />;
      case 'deposit':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      default:
        return <TrendingUp className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'confirmed':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
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
      {allTransactions.length > 0 ? (
        allTransactions.map((transaction) => (
          <div key={transaction.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                {getTransactionIcon(transaction.type)}
                <div>
                  <p className="font-semibold capitalize">{transaction.type}</p>
                  <p className="text-sm text-gray-600">{transaction.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatNaira(transaction.amount)}</p>
                <Badge className={getStatusColor(transaction.status)}>
                  {transaction.status}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {new Date(transaction.date).toLocaleDateString()} at {new Date(transaction.date).toLocaleTimeString()}
            </p>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No transactions found.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
