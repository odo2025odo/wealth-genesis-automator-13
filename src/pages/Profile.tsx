import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useInvestment } from '@/contexts/InvestmentContext';
import Navbar from '@/components/Navbar';
import WithdrawalForm from '@/components/WithdrawalForm';
import ReferralInfo from '@/components/ReferralInfo';
import ChangePassword from '@/components/ChangePassword';
import TransactionHistory from '@/components/TransactionHistory';
import DepositHistory from '@/components/DepositHistory';
import WithdrawHistory from '@/components/WithdrawHistory';
import BottomNavigation from '@/components/BottomNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Phone, 
  Shield, 
  LogOut, 
  Award, 
  History, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Headphones, 
  Lock,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Clock,
  Users,
  ArrowDown,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Profile = () => {
  const { user, logout } = useAuth();
  const { investments, updateInvestments, formatNaira } = useInvestment();
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [showActiveInvestments, setShowActiveInvestments] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [showDepositHistory, setShowDepositHistory] = useState(false);
  const [showWithdrawHistory, setShowWithdrawHistory] = useState(false);

  useEffect(() => {
    updateInvestments();
    const interval = setInterval(updateInvestments, 60000);
    return () => clearInterval(interval);
  }, [updateInvestments]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userInvestments = investments.filter(inv => inv.userId === user.id);
  const activeInvestments = userInvestments.filter(inv => inv.status === 'active');
  const totalActiveAmount = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalEarningsToday = activeInvestments.reduce((sum, inv) => sum + inv.dailyEarning, 0);
  const totalEarnings = userInvestments.reduce((sum, inv) => sum + inv.totalEarned, 0);

  const handleLogout = () => {
    logout();
  };

  const handleWhatsAppSupport = () => {
    const whatsappNumber = '+2348062787664';
    const message = `Hello, I need support with my account. My phone number is ${user.phoneNumber}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const menuItems = [
    {
      icon: History,
      label: 'Transaction History',
      onClick: () => setShowTransactionHistory(!showTransactionHistory),
      color: 'text-orange-600'
    },
    {
      icon: ArrowDownLeft,
      label: 'Withdraw History',
      onClick: () => setShowWithdrawHistory(!showWithdrawHistory),
      color: 'text-orange-600'
    },
    {
      icon: ArrowUpRight,
      label: 'Deposit History',
      onClick: () => setShowDepositHistory(!showDepositHistory),
      color: 'text-orange-600'
    },
    {
      icon: Headphones,
      label: 'Customer Support',
      onClick: handleWhatsAppSupport,
      color: 'text-green-600'
    },
    {
      icon: Lock,
      label: 'Change Password',
      onClick: () => setShowChangePassword(!showChangePassword),
      color: 'text-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="max-w-md mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Account Profile</h1>
          <p className="text-gray-600 text-sm">Manage your account information and settings</p>
        </div>

        {/* Profile Information */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Full Name</p>
                <p className="font-semibold text-gray-900">{user.name}</p>
              </div>
              {user.faceVerified && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-1">Phone Number</p>
              <p className="font-semibold flex items-center gap-2 text-gray-900">
                <Phone className="h-4 w-4" />
                {user.phoneNumber}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{formatNaira(user.balance)}</div>
              <p className="text-xs text-muted-foreground">Available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Investments</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{formatNaira(totalActiveAmount)}</div>
              <p className="text-xs text-muted-foreground">{activeInvestments.length} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-green-600">{formatNaira(totalEarningsToday)}</div>
              <p className="text-xs text-muted-foreground">Daily return</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-green-600">{formatNaira(totalEarnings)}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4 mb-6">
          {/* Withdrawal Toggle */}
          <Card>
            <CardHeader>
              <Button
                variant="ghost"
                onClick={() => setShowWithdrawal(!showWithdrawal)}
                className="w-full flex items-center justify-between p-0 h-auto"
              >
                <div className="flex items-center gap-2">
                  <ArrowDown className="h-5 w-5" />
                  <CardTitle className="text-base">Withdrawal</CardTitle>
                </div>
                {showWithdrawal ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CardHeader>
            {showWithdrawal && (
              <CardContent>
                <CardDescription className="mb-4">Request withdrawal to your Nigerian bank account</CardDescription>
                <WithdrawalForm />
              </CardContent>
            )}
          </Card>

          {/* Active Investments Toggle */}
          <Card>
            <CardHeader>
              <Button
                variant="ghost"
                onClick={() => setShowActiveInvestments(!showActiveInvestments)}
                className="w-full flex items-center justify-between p-0 h-auto"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <CardTitle className="text-base">Active Investments</CardTitle>
                </div>
                {showActiveInvestments ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CardHeader>
            {showActiveInvestments && (
              <CardContent>
                <CardDescription className="mb-4">Your current investment plans and progress</CardDescription>
                {activeInvestments.length > 0 ? (
                  <div className="space-y-4">
                    {activeInvestments.map((investment) => {
                      const progressPercentage = (investment.daysCompleted / investment.duration) * 100;
                      const remainingDays = investment.duration - investment.daysCompleted;
                      
                      return (
                        <div key={investment.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{investment.planName}</h3>
                              <p className="text-gray-600">Investment: {formatNaira(investment.amount)}</p>
                            </div>
                            <Badge variant="secondary">{investment.roi}% Daily</Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Days Completed</p>
                              <p className="font-semibold">{investment.daysCompleted} of {investment.duration}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Earned So Far</p>
                              <p className="font-semibold text-green-600">{formatNaira(investment.totalEarned)}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{remainingDays} days remaining</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You don't have any active investments yet.</p>
                    <a href="/plans" className="text-blue-600 hover:underline">
                      Browse Investment Plans
                    </a>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Transaction History Toggle */}
          {showTransactionHistory && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionHistory />
              </CardContent>
            </Card>
          )}

          {/* Deposit History Toggle */}
          {showDepositHistory && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Deposit History</CardTitle>
              </CardHeader>
              <CardContent>
                <DepositHistory />
              </CardContent>
            </Card>
          )}

          {/* Withdraw History Toggle */}
          {showWithdrawHistory && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Withdraw History</CardTitle>
              </CardHeader>
              <CardContent>
                <WithdrawHistory />
              </CardContent>
            </Card>
          )}

          {/* Change Password Toggle */}
          {showChangePassword && (
            <div className="mb-6">
              <ChangePassword />
            </div>
          )}
        </div>

        {/* Menu Items */}
        <Card className="mb-6">
          <CardContent className="p-0">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index}>
                  <button
                    onClick={item.onClick}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gray-100 ${item.color}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-gray-900">{item.label}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                  {index < menuItems.length - 1 && (
                    <Separator className="mx-4" />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Investment History */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Investment History</CardTitle>
            <CardDescription>All your past and current investments</CardDescription>
          </CardHeader>
          <CardContent>
            {userInvestments.length > 0 ? (
              <div className="space-y-4">
                {userInvestments.map((investment) => (
                  <div key={investment.id} className="flex justify-between items-center border rounded-lg p-4">
                    <div>
                      <h3 className="font-semibold">{investment.planName}</h3>
                      <p className="text-sm text-gray-600">
                        Started: {new Date(investment.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatNaira(investment.amount)}</p>
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
              <p className="text-center text-gray-500 py-8">No investment history yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Card>
          <CardContent className="pt-6">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
