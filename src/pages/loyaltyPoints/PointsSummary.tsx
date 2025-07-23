import React, { useEffect, useState } from 'react';
import { useUser } from './context/UserContext';
import { Wallet, RefreshCw } from 'lucide-react';

const PointsSummary: React.FC = () => {
  const { user } = useUser();
  const [animatedPoints, setAnimatedPoints] = useState(0);
  const [animatedCash, setAnimatedCash] = useState(0);
  
  // Points to cash conversion - 100 points = $1
  const pointsValue = user?.points ? user.points / 100 : 0;

  // Animate points counter on load
  useEffect(() => {
    if (user?.points) {
      let currentPoints = 0;
      const targetPoints = user.points;
      const step = Math.max(1, Math.floor(targetPoints / 20)); // Animate in 20 steps or 1 point at a time
      
      const interval = setInterval(() => {
        currentPoints = Math.min(currentPoints + step, targetPoints);
        setAnimatedPoints(currentPoints);
        
        if (currentPoints >= targetPoints) {
          clearInterval(interval);
        }
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [user?.points]);
  
  // Animate cash counter
  useEffect(() => {
    if (pointsValue > 0) {
      let currentCash = 0;
      const targetCash = pointsValue;
      const step = targetCash / 20; // Animate in 20 steps
      
      const interval = setInterval(() => {
        currentCash = Math.min(currentCash + step, targetCash);
        setAnimatedCash(currentCash);
        
        if (currentCash >= targetCash) {
          clearInterval(interval);
        }
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [pointsValue]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <h2 className="text-white text-xl font-semibold">Your Loyalty Points</h2>
      </div>
      
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800">Total Points</h3>
              </div>
              <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                Last updated: Today
              </span>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-indigo-600">{animatedPoints.toLocaleString()}</span>
              <span className="ml-2 text-sm text-gray-500">points</span>
            </div>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${Math.min(100, (user?.points || 0) / 10)}%` }}
              ></div>
            </div>
            <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
              <span>0 points</span>
              <span>Next tier: 1,000 points</span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <Wallet className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-800">Cash Value</h3>
              </div>
              <button className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium">
                <RefreshCw size={16} className="mr-1" />
                Convert
              </button>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-green-600">${animatedCash.toFixed(2)}</span>
              <span className="ml-2 text-sm text-gray-500">available to redeem</span>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              100 points = $1.00 in redemption value
            </p>
            <button className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Redeem Points
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsSummary;