
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useInvestment } from '@/contexts/InvestmentContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, Users, DollarSign, TrendingUp } from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();
  const { pendingPayments, confirmPayment, rejectPayment, investments } = useInvestment();
  const { toast } = useToast();

  if (!user || !user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleConfirmPayment = (paymentId: string) => {
    confirmPayment(paymentId);
    toast({
      title: "Payment Confirmed",
      description: "Investment has been activated successfully",
    });
  };

  const handleRejectPayment = (paymentId: string) => {
    rejectPayment(paymentId);
    toast({
      title: "Payment Rejected",
      description: "Payment has been rejected",
      variant: "destructive",
    });
  };

  const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const activeInvestments = investments.filter(inv => inv.status === 'active');
  const completedInvestments = investments.filter(inv => inv.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage payments and monitor platform activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPayments.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalInvestments.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeInvestments.length}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedInvestments.length}</div>
              <p className="text-xs text-muted-foreground">Finished plans</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Payments */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pending Payment Confirmations</CardTitle>
            <CardDescription>Review and confirm user payments</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingPayments.length > 0 ? (
              <div className="space-y-4">
                {pendingPayments.map((payment) => (
                  <div key={payment.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{payment.userName}</h3>
                        <p className="text-gray-600">{payment.userEmail}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(payment.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Investment Plan</p>
                        <p className="font-semibold">{payment.planName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-semibold text-green-600">${payment.amount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment ID</p>
                        <p className="font-mono text-sm">{payment.id}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleConfirmPayment(payment.id)}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Confirm Payment
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleRejectPayment(payment.id)}
                        className="flex items-center gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No pending payments to review</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Investments Overview */}
        <Card>
          <CardHeader>
            <CardTitle>All Investments</CardTitle>
            <CardDescription>Complete overview of all platform investments</CardDescription>
          </CardHeader>
          <CardContent>
            {investments.length > 0 ? (
              <div className="space-y-4">
                {investments.map((investment) => (
                  <div key={investment.id} className="flex justify-between items-center border rounded-lg p-4">
                    <div>
                      <h3 className="font-semibold">{investment.planName}</h3>
                      <p className="text-sm text-gray-600">
                        User ID: {investment.userId}
                      </p>
                      <p className="text-sm text-gray-600">
                        Started: {new Date(investment.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${investment.amount}</p>
                      <p className="text-sm text-gray-600">
                        Earned: ${investment.totalEarned.toFixed(2)}
                      </p>
                      <Badge 
                        variant={
                          investment.status === 'active' ? 'default' : 
                          investment.status === 'completed' ? 'secondary' : 'destructive'
                        }
                      >
                        {investment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No investments yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
