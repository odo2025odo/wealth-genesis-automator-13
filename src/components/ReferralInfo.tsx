
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Copy, Share2, Users, DollarSign } from 'lucide-react';

const ReferralInfo = () => {
  const { user, generateReferralLink } = useAuth();
  const { toast } = useToast();
  const [referralLink, setReferralLink] = useState('');

  React.useEffect(() => {
    if (user) {
      setReferralLink(generateReferralLink(user.id));
    }
  }, [user, generateReferralLink]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
    });
  };

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join WealthGenesis',
        text: 'Start your investment journey with WealthGenesis!',
        url: referralLink,
      });
    } else {
      copyToClipboard();
    }
  };

  if (!user) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Referral Program
        </CardTitle>
        <CardDescription>
          Earn 1% commission on every successful investment from your referrals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              ₦{(user.referralEarnings || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Referral Earnings</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <Badge variant="secondary" className="mb-2">
              {user.referralCode}
            </Badge>
            <div className="text-sm text-gray-600">Your Referral Code</div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Your Referral Link:</label>
          <div className="flex gap-2">
            <Input
              value={referralLink}
              readOnly
              className="text-xs"
            />
            <Button size="sm" onClick={copyToClipboard} variant="outline">
              <Copy className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={shareReferralLink}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">How it works:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Share your referral link with friends</li>
            <li>• They register using your link</li>
            <li>• You earn 1% commission on their investments</li>
            <li>• Earnings are added directly to your balance</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralInfo;
