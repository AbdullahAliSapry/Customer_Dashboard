import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, TrendingUp, Trash2 } from 'lucide-react';
import { PriceOfferStatus } from '../../../interfaces/StorePriceOffers';

interface StatusBadgeProps {
  status: PriceOfferStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { t } = useTranslation();

  const statusConfig = {
    [PriceOfferStatus.Pending]: { 
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200', 
      text: t('priceOffers.pending'),
      icon: <Clock size={12} />
    },
    [PriceOfferStatus.Accepted]: { 
      color: 'bg-green-50 text-green-700 border-green-200', 
      text: t('priceOffers.accepted'),
      icon: <TrendingUp size={12} />
    },
    [PriceOfferStatus.Rejected]: { 
      color: 'bg-red-50 text-red-700 border-red-200', 
      text: t('priceOffers.rejected'),
      icon: <Trash2 size={12} />
    }
  };

  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      {config.icon}
      <span className="mr-1">{config.text}</span>
    </span>
  );
};

export default StatusBadge; 