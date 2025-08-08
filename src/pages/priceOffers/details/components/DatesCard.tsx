import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'lucide-react';
import { StorePriceOffer } from '../../../../interfaces/StorePriceOffers';

interface DatesCardProps {
  offer: StorePriceOffer;
  isRTL: boolean;
  isExpired: boolean;
  formatDate: (date: Date) => string;
}

const DatesCard: React.FC<DatesCardProps> = ({ 
  offer, 
  isRTL, 
  isExpired, 
  formatDate 
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Calendar size={20} className={`${isRTL ? 'mr-2' : 'ml-2'} text-blue-600`} />
          {t('priceOffers.dates')}
        </h2>
      </div>
      <div className="p-6 space-y-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            {t('priceOffers.createdDate')}
          </p>
          <p className="font-semibold text-gray-900">{formatDate(offer.createdAt)}</p>
        </div>
        <div className={`p-3 rounded-lg ${isExpired ? 'bg-red-50' : 'bg-gray-50'}`}>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            {t('priceOffers.expiryDate')}
          </p>
          <p className={`font-semibold ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
            {formatDate(offer.expiryDate)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DatesCard; 