import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, DollarSign } from 'lucide-react';
import { StorePriceOffer, PriceOfferStatus } from '../../../../interfaces/StorePriceOffers';
import Button from '../../../../components/ui/Button';
import StatusBadge from '../../components/StatusBadge';

interface DetailsHeaderProps {
  offer: StorePriceOffer;
  isRTL: boolean;
  isExpired: boolean;
  onBack: () => void;
}

const DetailsHeader: React.FC<DetailsHeaderProps> = ({ 
  offer, 
  isRTL, 
  isExpired, 
  onBack 
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${isRTL ? 'space-x-reverse' : 'space-x'} space-x-4`}>
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <DollarSign className={`${isRTL ? 'mr-3' : 'ml-3'} text-blue-600`} size={32} />
                  {t('priceOffers.offerDetails')} #{offer.id.slice(0, 8)}
                </h1>
                <p className="mt-2 text-sm text-gray-600">{t('priceOffers.offerDetailsSubtitle')}</p>
              </div>
            </div>
            <div className={`flex items-center ${isRTL ? 'space-x-reverse' : 'space-x'} space-x-3`}>
              <StatusBadge status={offer.status} />
              {isExpired && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-200">
                  {t('priceOffers.expired')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsHeader; 