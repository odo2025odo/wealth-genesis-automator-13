
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useInvestment } from '@/contexts/InvestmentContext';
import Navbar from '@/components/Navbar';
import BottomNavigation from '@/components/BottomNavigation';
import WithdrawalForm from '@/components/WithdrawalForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';

const Withdrawals = () => {
  const { user } = useAuth();
  const { formatNaira } = useInvestment();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Get withdrawal history from localStorage
  const withdrawalHistory = JSON.parse(localStorage.getItem('withdrawal_requests') || '[]')
    .filter((withdrawal: any) => withdrawal.userId === user.id)
    .sort((a: any, b: any) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Withdrawals</h1>
          <p className="text-gray-600">Request withdrawals and view your transaction history</p>
        </div>

        {/* Account Balance Card */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">{formatNaira(user.balance)}</div>
            <p className="text-xs text-muted-foreground mb-4">Ready for withdrawal</p>
            <WithdrawalForm />
          </CardContent>
        </Card>

        {/* Withdrawal Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Withdrawal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Processing Time</h4>
                <p className="text-sm text-blue-800">
                  Withdrawal requests are processed within 24-48 hours during business days.
                </p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2">Requirements</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Minimum withdrawal amount: ₦1,000</li>
                  <li>• Account must be verified</li>
                  <li>• Bank details must match your registered information</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal History */}
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
            <CardDescription>Your recent withdrawal requests and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {withdrawalHistory.length > 0 ? (
              <div className="space-y-4">
                {withdrawalHistory.map((withdrawal: any) => (
                  <div key={withdrawal.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(withdrawal.status)}
                          <span className="font-semibold">{formatNaira(withdrawal.amount)}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Requested: {new Date(withdrawal.requestDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(withdrawal.status)}>
                        {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="bg-gray-50 rounded p-3">
                      <h4 className="font-medium text-sm mb-2">Bank Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Bank:</span>
                          <p className="font-medium">{withdrawal.bankName}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Account:</span>
                          <p className="font-medium">{withdrawal.accountNumber}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Name:</span>
                          <p className="font-medium">{withdrawal.accountName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No withdrawal requests yet.</p>
                <p className="text-sm text-gray-400">Make your first withdrawal request above!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Withdrawals;
