
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Investment {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  amount: number;
  roi: number;
  duration: number;
  dailyEarning: number;
  totalReturn: number;
  startDate: string;
  endDate: string;
  status: 'pending' | 'active' | 'completed';
  daysCompleted: number;
  totalEarned: number;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  carName: string;
  carImage: string;
  minAmount: number;
  maxAmount: number;
  roi: number;
  duration: number;
  totalReturn: number;
  description: string;
  popular?: boolean;
}

export interface PendingPayment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  amount: number;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'rejected';
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface InvestmentContextType {
  plans: InvestmentPlan[];
  investments: Investment[];
  pendingPayments: PendingPayment[];
  withdrawalRequests: WithdrawalRequest[];
  createInvestment: (planId: string, amount: number) => string;
  confirmPayment: (paymentId: string) => void;
  rejectPayment: (paymentId: string) => void;
  updateInvestments: () => void;
  requestWithdrawal: (amount: number, bankName: string, accountNumber: string, accountName: string) => string;
  approveWithdrawal: (withdrawalId: string) => void;
  rejectWithdrawal: (withdrawalId: string) => void;
  formatNaira: (amount: number) => string;
}

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined);

const defaultPlans: InvestmentPlan[] = [
  {
    id: '1',
    name: 'Plan 1',
    carName: 'Toyota Camry 2025',
    carImage: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop',
    minAmount: 2000,
    maxAmount: 2000,
    roi: 16,
    duration: 30,
    totalReturn: 9600,
    description: 'Reliable starter plan - Earn ₦320 daily for 30 days',
  },
  {
    id: '2',
    name: 'Plan 2',
    carName: 'Mazda CX-5 2025',
    carImage: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop',
    minAmount: 4000,
    maxAmount: 4000,
    roi: 16,
    duration: 30,
    totalReturn: 19200,
    description: 'Smooth performance - Earn ₦640 daily for 30 days',
  },
  {
    id: '3',
    name: 'Plan 3',
    carName: 'BMW X3 2025',
    carImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
    minAmount: 6000,
    maxAmount: 6000,
    roi: 16,
    duration: 30,
    totalReturn: 28800,
    description: 'Luxury comfort - Earn ₦960 daily for 30 days',
  },
  {
    id: '4',
    name: 'Plan 4',
    carName: 'Mercedes-Benz C-Class 2025',
    carImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop',
    minAmount: 10000,
    maxAmount: 10000,
    roi: 16,
    duration: 30,
    totalReturn: 48000,
    description: 'Premium elegance - Earn ₦1,600 daily for 30 days',
    popular: true,
  },
  {
    id: '5',
    name: 'Plan 5',
    carName: 'Tesla Model S 2025',
    carImage: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop',
    minAmount: 20000,
    maxAmount: 20000,
    roi: 16,
    duration: 30,
    totalReturn: 96000,
    description: 'Electric innovation - Earn ₦3,200 daily for 30 days',
  },
  {
    id: '6',
    name: 'Plan 6',
    carName: 'Lamborghini Huracan 2025',
    carImage: '/lovable-uploads/8f50fe21-8893-4f81-a696-dcd0c9c516cd.png',
    minAmount: 30000,
    maxAmount: 30000,
    roi: 16,
    duration: 30,
    totalReturn: 144000,
    description: 'Italian supercar - Earn ₦4,800 daily for 30 days',
  },
];

export const InvestmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plans] = useState<InvestmentPlan[]>(defaultPlans);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);

  useEffect(() => {
    const savedInvestments = localStorage.getItem('hyip_investments');
    if (savedInvestments) {
      setInvestments(JSON.parse(savedInvestments));
    }

    const savedPayments = localStorage.getItem('hyip_pending_payments');
    if (savedPayments) {
      setPendingPayments(JSON.parse(savedPayments));
    }

    const savedWithdrawals = localStorage.getItem('hyip_withdrawal_requests');
    if (savedWithdrawals) {
      setWithdrawalRequests(JSON.parse(savedWithdrawals));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hyip_investments', JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    localStorage.setItem('hyip_pending_payments', JSON.stringify(pendingPayments));
  }, [pendingPayments]);

  useEffect(() => {
    localStorage.setItem('hyip_withdrawal_requests', JSON.stringify(withdrawalRequests));
  }, [withdrawalRequests]);

  const formatNaira = (amount: number): string => {
    return `₦${amount.toLocaleString('en-NG')}`;
  };

  const createInvestment = (planId: string, amount: number): string => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) throw new Error('Plan not found');

    const paymentId = Date.now().toString();
    const user = JSON.parse(localStorage.getItem('hyip_user') || '{}');

    const pendingPayment: PendingPayment = {
      id: paymentId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      planId,
      planName: plan.name,
      amount,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    setPendingPayments(prev => [...prev, pendingPayment]);
    return paymentId;
  };

  const confirmPayment = (paymentId: string) => {
    const payment = pendingPayments.find(p => p.id === paymentId);
    if (!payment) return;

    const plan = plans.find(p => p.id === payment.planId);
    if (!plan) return;

    // Create investment
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duration);

    const dailyEarning = (payment.amount * plan.roi) / 100;
    const totalReturn = dailyEarning * plan.duration;

    const investment: Investment = {
      id: Date.now().toString(),
      userId: payment.userId,
      planId: payment.planId,
      planName: payment.planName,
      amount: payment.amount,
      roi: plan.roi,
      duration: plan.duration,
      dailyEarning,
      totalReturn,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: 'active',
      daysCompleted: 0,
      totalEarned: 0,
    };

    setInvestments(prev => [...prev, investment]);

    // Update user balance
    const users = JSON.parse(localStorage.getItem('hyip_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === payment.userId);
    if (userIndex !== -1) {
      users[userIndex].balance += payment.amount;
      users[userIndex].totalInvested += payment.amount;
      localStorage.setItem('hyip_users', JSON.stringify(users));
    }

    // Remove from pending payments
    setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
  };

  const rejectPayment = (paymentId: string) => {
    setPendingPayments(prev => prev.filter(p => p.id !== paymentId));
  };

  const updateInvestments = () => {
    const now = new Date();
    
    setInvestments(prev => prev.map(investment => {
      if (investment.status !== 'active') return investment;

      const startDate = new Date(investment.startDate);
      const daysPassed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysPassed >= investment.duration) {
        return {
          ...investment,
          status: 'completed' as const,
          daysCompleted: investment.duration,
          totalEarned: investment.totalReturn,
        };
      }

      return {
        ...investment,
        daysCompleted: daysPassed,
        totalEarned: daysPassed * investment.dailyEarning,
      };
    }));
  };

  const requestWithdrawal = (amount: number, bankName: string, accountNumber: string, accountName: string): string => {
    const user = JSON.parse(localStorage.getItem('hyip_user') || '{}');
    const withdrawalId = Date.now().toString();

    const withdrawal: WithdrawalRequest = {
      id: withdrawalId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      amount,
      bankName,
      accountNumber,
      accountName,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    setWithdrawalRequests(prev => [...prev, withdrawal]);
    return withdrawalId;
  };

  const approveWithdrawal = (withdrawalId: string) => {
    const withdrawal = withdrawalRequests.find(w => w.id === withdrawalId);
    if (!withdrawal) return;

    // Update user balance
    const users = JSON.parse(localStorage.getItem('hyip_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === withdrawal.userId);
    if (userIndex !== -1) {
      users[userIndex].balance -= withdrawal.amount;
      localStorage.setItem('hyip_users', JSON.stringify(users));
    }

    // Update withdrawal status
    setWithdrawalRequests(prev => 
      prev.map(w => w.id === withdrawalId ? { ...w, status: 'approved' as const } : w)
    );
  };

  const rejectWithdrawal = (withdrawalId: string) => {
    setWithdrawalRequests(prev => 
      prev.map(w => w.id === withdrawalId ? { ...w, status: 'rejected' as const } : w)
    );
  };

  return (
    <InvestmentContext.Provider value={{
      plans,
      investments,
      pendingPayments,
      withdrawalRequests,
      createInvestment,
      confirmPayment,
      rejectPayment,
      updateInvestments,
      requestWithdrawal,
      approveWithdrawal,
      rejectWithdrawal,
      formatNaira,
    }}>
      {children}
    </InvestmentContext.Provider>
  );
};

export const useInvestment = () => {
  const context = useContext(InvestmentContext);
  if (context === undefined) {
    throw new Error('useInvestment must be used within an InvestmentProvider');
  }
  return context;
};
