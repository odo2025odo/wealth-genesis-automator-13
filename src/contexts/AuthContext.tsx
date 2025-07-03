
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  phoneNumber: string;
  name: string;
  balance: number;
  totalInvested: number;
  totalEarned: number;
  referralCode: string;
  referredBy?: string;
  referralEarnings: number;
  isAdmin?: boolean;
  faceVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (phoneNumber: string, password: string) => Promise<boolean>;
  register: (phoneNumber: string, password: string, name: string, referralCode?: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  generateReferralLink: (userId: string) => string;
  processReferralCommission: (referredUserId: string, investmentAmount: number) => void;
  sendPasswordResetCode: (phoneNumber: string) => Promise<boolean>;
  verifyPasswordResetCode: (phoneNumber: string, code: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate a unique referral code
const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('hyip_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (phoneNumber: string, password: string): Promise<boolean> => {
    // Add country code if not present
    const formattedPhone = phoneNumber.startsWith('+234') ? phoneNumber : `+234${phoneNumber}`;
    
    const users = JSON.parse(localStorage.getItem('hyip_users') || '[]');
    const foundUser = users.find((u: any) => u.phoneNumber === formattedPhone && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('hyip_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = async (phoneNumber: string, password: string, name: string, referralCode?: string): Promise<boolean> => {
    // Add country code if not present
    const formattedPhone = phoneNumber.startsWith('+234') ? phoneNumber : `+234${phoneNumber}`;
    
    const users = JSON.parse(localStorage.getItem('hyip_users') || '[]');
    
    if (users.find((u: any) => u.phoneNumber === formattedPhone)) {
      return false; // User already exists
    }

    // Check if referral code is valid
    let referredBy = undefined;
    if (referralCode) {
      const referrer = users.find((u: any) => u.referralCode === referralCode);
      if (referrer) {
        referredBy = referrer.id;
      }
    }

    const newUser = {
      id: Date.now().toString(),
      phoneNumber: formattedPhone,
      password,
      name,
      balance: 1000, // Welcome bonus of 1000 naira
      totalInvested: 0,
      totalEarned: 0,
      referralCode: generateReferralCode(),
      referredBy,
      referralEarnings: 0,
      isAdmin: formattedPhone === '+2348025720735',
      faceVerified: true
    };

    users.push(newUser);
    localStorage.setItem('hyip_users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('hyip_user', JSON.stringify(userWithoutPassword));
    return true;
  };

  const sendPasswordResetCode = async (phoneNumber: string): Promise<boolean> => {
    const formattedPhone = phoneNumber.startsWith('+234') ? phoneNumber : `+234${phoneNumber}`;
    const users = JSON.parse(localStorage.getItem('hyip_users') || '[]');
    const user = users.find((u: any) => u.phoneNumber === formattedPhone);
    
    if (user) {
      // In a real app, you would send SMS here
      // For demo purposes, we'll just store a reset code
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem(`reset_${formattedPhone}`, resetCode);
      console.log(`Reset code for ${formattedPhone}: ${resetCode}`);
      return true;
    }
    return false;
  };

  const verifyPasswordResetCode = async (phoneNumber: string, code: string, newPassword: string): Promise<boolean> => {
    const formattedPhone = phoneNumber.startsWith('+234') ? phoneNumber : `+234${phoneNumber}`;
    const storedCode = localStorage.getItem(`reset_${formattedPhone}`);
    
    if (storedCode === code) {
      const users = JSON.parse(localStorage.getItem('hyip_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.phoneNumber === formattedPhone);
      
      if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('hyip_users', JSON.stringify(users));
        localStorage.removeItem(`reset_${formattedPhone}`);
        return true;
      }
    }
    return false;
  };

  const generateReferralLink = (userId: string): string => {
    const users = JSON.parse(localStorage.getItem('hyip_users') || '[]');
    const user = users.find((u: any) => u.id === userId);
    if (user) {
      return `${window.location.origin}/register?ref=${user.referralCode}`;
    }
    return '';
  };

  const processReferralCommission = (referredUserId: string, investmentAmount: number) => {
    const users = JSON.parse(localStorage.getItem('hyip_users') || '[]');
    
    // Find the referred user
    const referredUser = users.find((u: any) => u.id === referredUserId);
    if (referredUser && referredUser.referredBy) {
      // Find the referrer
      const referrerIndex = users.findIndex((u: any) => u.id === referredUser.referredBy);
      if (referrerIndex !== -1) {
        // Calculate 1% commission
        const commission = investmentAmount * 0.01;
        users[referrerIndex].referralEarnings = (users[referrerIndex].referralEarnings || 0) + commission;
        users[referrerIndex].balance += commission;
        users[referrerIndex].totalEarned += commission;
        
        localStorage.setItem('hyip_users', JSON.stringify(users));
        
        // Update current user if they are the referrer
        if (user && user.id === users[referrerIndex].id) {
          updateUser({
            referralEarnings: users[referrerIndex].referralEarnings,
            balance: users[referrerIndex].balance,
            totalEarned: users[referrerIndex].totalEarned
          });
        }
        
        console.log(`Referral commission of ₦${commission.toFixed(2)} paid to user ${users[referrerIndex].name}`);
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hyip_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('hyip_user', JSON.stringify(updatedUser));
      
      // Update in users array too
      const users = JSON.parse(localStorage.getItem('hyip_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('hyip_users', JSON.stringify(users));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      updateUser, 
      generateReferralLink,
      processReferralCommission,
      sendPasswordResetCode,
      verifyPasswordResetCode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
