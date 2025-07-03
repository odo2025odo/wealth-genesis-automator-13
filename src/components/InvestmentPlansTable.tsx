
import React from 'react';
import { useInvestment } from '@/contexts/InvestmentContext';
import { useNavigate } from 'react-router-dom';

const InvestmentPlansTable = () => {
  const { plans, formatNaira } = useInvestment();
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white mb-6">
        <h1 className="text-2xl font-bold text-center mb-2">PROVEST</h1>
        <p className="text-center text-green-100 mb-2">Investment Plans</p>
        <p className="text-center text-sm mb-6">Invest with PROVEST and earn 16% daily interest for 30 days!</p>
        
        <div className="bg-blue-900 rounded-lg p-4 mb-4">
          <h2 className="text-xl font-bold text-center text-yellow-400 mb-4">Our Plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-blue-600">
                  <th className="text-left py-2 text-yellow-400 font-bold">Plan</th>
                  <th className="text-left py-2 text-yellow-400 font-bold">Price</th>
                  <th className="text-left py-2 text-yellow-400 font-bold">Daily Income</th>
                  <th className="text-left py-2 text-yellow-400 font-bold">Total Income after 30 days</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-blue-600/30">
                  <td className="py-2 font-medium text-white">Plan 1</td>
                  <td className="py-2 text-yellow-400">₦2,000</td>
                  <td className="py-2 text-yellow-400">₦320</td>
                  <td className="py-2 text-yellow-400">₦9,600</td>
                </tr>
                <tr className="border-b border-blue-600/30">
                  <td className="py-2 font-medium text-white">Plan 2</td>
                  <td className="py-2 text-yellow-400">₦4,000</td>
                  <td className="py-2 text-yellow-400">₦640</td>
                  <td className="py-2 text-yellow-400">₦19,200</td>
                </tr>
                <tr className="border-b border-blue-600/30">
                  <td className="py-2 font-medium text-white">Plan 3</td>
                  <td className="py-2 text-yellow-400">₦6,000</td>
                  <td className="py-2 text-yellow-400">₦960</td>
                  <td className="py-2 text-yellow-400">₦28,800</td>
                </tr>
                <tr className="border-b border-blue-600/30">
                  <td className="py-2 font-medium text-white">Plan 4</td>
                  <td className="py-2 text-yellow-400">₦10,000</td>
                  <td className="py-2 text-yellow-400">₦1,600</td>
                  <td className="py-2 text-yellow-400">₦48,400</td>
                </tr>
                <tr className="border-b border-blue-600/30">
                  <td className="py-2 font-medium text-white">Plan 5</td>
                  <td className="py-2 text-yellow-400">₦20,000</td>
                  <td className="py-2 text-yellow-400">₦3,200</td>
                  <td className="py-2 text-yellow-400">₦96,000</td>
                </tr>
                <tr className="border-b border-blue-600/30">
                  <td className="py-2 font-medium text-white">Plan 6</td>
                  <td className="py-2 text-yellow-400">₦30,000</td>
                  <td className="py-2 text-yellow-400">₦4,800</td>
                  <td className="py-2 text-yellow-400">₦144,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPlansTable;
