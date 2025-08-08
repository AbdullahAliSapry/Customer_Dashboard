import React from 'react';
import { useTranslation } from 'react-i18next';

const LoadingState: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{t('priceOffers.loadingOfferDetails')}</p>
      </div>
    </div>
  );
};

export default LoadingState; 