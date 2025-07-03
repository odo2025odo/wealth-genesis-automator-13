import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import WelcomeBonusModal from '@/components/WelcomeBonusModal';
import { TrendingUp, Shield } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showWelcomeBonus, setShowWelcomeBonus] = useState(false);
  const { register, updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Clear all investment history on app load
  React.useEffect(() => {
    localStorage.removeItem('hyip_investments');
    localStorage.removeItem('hyip_investment_history');
    console.log('Investment history cleared');
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove leading zero from phone number
    if (e.target.name === 'phoneNumber') {
      value = value.replace(/^0+/, '');
    }
    
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    if (formData.phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const success = await register(formData.phoneNumber, formData.password, formData.name);
      if (success) {
        // Add welcome bonus of 1000 naira
        updateUser({ balance: 1000 });
        
        toast({
          title: "Registration Successful",
          description: "Welcome to WealthGenesis!",
        });
        
        // Show welcome bonus popup
        setShowWelcomeBonus(true);
      } else {
        toast({
          title: "Registration Failed",
          description: "Phone number already exists",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWelcomeBonusClose = () => {
    setShowWelcomeBonus(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <TrendingUp className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Join WealthGenesis</CardTitle>
            <CardDescription>
              Create your account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="flex">
                  <div className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                    <span className="text-sm text-gray-600">+234</span>
                  </div>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    placeholder="8012345678"
                    className="rounded-l-none"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter your phone number without the leading zero
                </p>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a password"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Login here
                </Link>
              </p>
            </div>
            
            {/* CBN Authorization Statement */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-2 text-green-700">
                <Shield className="h-4 w-4" />
                <p className="text-xs font-semibold text-center">
                  AUTHORIZED AND SECURED BY CBN
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <WelcomeBonusModal
        isOpen={showWelcomeBonus}
        onClose={handleWelcomeBonusClose}
        userName={formData.name}
      />
    </div>
  );
};

export default Register;
