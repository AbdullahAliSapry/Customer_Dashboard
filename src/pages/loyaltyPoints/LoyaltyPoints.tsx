

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from './context/UserContext';
import NoPoints from './NoPoints';
import PointsActivation from './PointsActivation';
import PointsSummary from './PointsSummary';
import TransactionHistory from './TransactionHistory';

const LoyaltyPoints: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();

  // Plan C check
  if (!user || user.plan !== 'C') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('loyalty.loyalty_points')}</h2>
        <div className="p-6 text-center">
          <div className="mb-4 text-amber-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">{t('loyalty.upgrade_required')}</h3>
          <p className="text-gray-600 mb-4">
            {t('loyalty.plan_c_required')}
          </p>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            {t('loyalty.upgrade_to_plan_c')}
          </button>
        </div>
      </div>
    );
  }

  // Loyalty not activated yet
  if (!user.loyaltyEnabled) {
    return <PointsActivation />;
  }

  // No points yet
  if (user.points === 0) {
    return <NoPoints />;
  }

  // Has points
  return (
    <div className="space-y-6">
      <PointsSummary />
      <TransactionHistory />
    </div>
  );
};

export default LoyaltyPoints;