import React from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign } from 'lucide-react';
import { StorePriceOffer } from '../../../../interfaces/StorePriceOffers';

interface SummaryCardProps {
  offer: StorePriceOffer;
  isRTL: boolean;
  calculateTotal: () => number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ offer, isRTL, calculateTotal }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <DollarSign size={20} className={`${isRTL ? 'mr-2' : 'ml-2'} text-green-600`} />
          {t('priceOffers.summary')}
        </h2>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
          <span className="text-gray-600 font-medium">{t('priceOffers.totalAmount')}:</span>
          <span className="text-2xl font-bold text-green-600">
            {calculateTotal().toFixed(2)} {t('common.currency')}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">{t('priceOffers.itemsCount')}:</span>
          <span className="font-semibold text-gray-900">{offer.items.length}</span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard; 