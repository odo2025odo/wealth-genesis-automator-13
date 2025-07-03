
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import BottomNavigation from '@/components/BottomNavigation';
import ReferralInfo from '@/components/ReferralInfo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign } from 'lucide-react';

const Referrals = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Get all users to find referrals
  const allUsers = JSON.parse(localStorage.getItem('hyip_users') || '[]');
  const myReferrals = allUsers.filter((u: any) => u.referredBy === user.id);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Team & Referrals</h1>
          <p className="text-gray-600">Manage your referral network and earnings</p>
        </div>

        {/* Referral Info Card */}
        <div className="mb-8">
          <ReferralInfo />
        </div>

        {/* Referral Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myReferrals.length}</div>
              <p className="text-xs text-muted-foreground">People you've referred</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Referral Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₦{(user.referralEarnings || 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total earned from referrals</p>
            </CardContent>
          </Card>
        </div>

        {/* Referral List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Referrals</CardTitle>
            <CardDescription>People who joined using your referral link</CardDescription>
          </CardHeader>
          <CardContent>
            {myReferrals.length > 0 ? (
              <div className="space-y-4">
                {myReferrals.map((referral: any, index: number) => (
                  <div key={referral.id} className="flex justify-between items-center border rounded-lg p-4">
                    <div>
                      <h3 className="font-semibold">{referral.name}</h3>
                      <p className="text-sm text-gray-600">{referral.phoneNumber}</p>
                      <p className="text-xs text-gray-500">
                        Joined: {new Date(parseInt(referral.id)).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₦{referral.totalInvested.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Total Invested</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">You haven't referred anyone yet.</p>
                <p className="text-sm text-gray-400">Share your referral link to start earning commissions!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Referrals;
