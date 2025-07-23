import React from 'react';
import { ArrowDownCircle, ArrowUpCircle, Filter } from 'lucide-react';

// Mock transaction data
const transactions = [
  {
    id: 1,
    date: '2025-04-15',
    description: 'Purchased Premium Website',
    points: 250,
    type: 'earned'
  },
  {
    id: 2,
    date: '2025-04-10',
    description: 'Referred Ahmed Mohamed',
    points: 500,
    type: 'earned'
  },
  {
    id: 3,
    date: '2025-04-05',
    description: 'Redeemed for Discount',
    points: -200,
    type: 'spent'
  },
  {
    id: 4,
    date: '2025-03-28',
    description: 'Purchased Business Website',
    points: 350,
    type: 'earned'
  },
  {
    id: 5,
    date: '2025-03-20',
    description: 'Bonus for 1 Year Membership',
    points: 1000,
    type: 'earned'
  }
];

const TransactionHistory: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Transaction History</h2>
        <button className="flex items-center text-gray-500 hover:text-indigo-600">
          <Filter size={16} className="mr-1" />
          <span className="text-sm">Filter</span>
        </button>
      </div>
      
      <div className="divide-y divide-gray-100">
        {transactions.map(transaction => (
          <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {transaction.type === 'earned' ? (
                  <ArrowUpCircle size={20} className="text-green-500 mr-3" />
                ) : (
                  <ArrowDownCircle size={20} className="text-amber-500 mr-3" />
                )}
                <div>
                  <p className="font-medium text-gray-800">{transaction.description}</p>
                  <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
              </div>
              <div className={`font-semibold ${transaction.type === 'earned' ? 'text-green-600' : 'text-amber-600'}`}>
                {transaction.type === 'earned' ? '+' : ''}{transaction.points} points
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
          View All Transactions
        </button>
      </div>
    </div>
  );
};

export default TransactionHistory;