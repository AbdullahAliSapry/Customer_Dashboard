import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Eye, Edit, Trash2 } from 'lucide-react';
import { StorePriceOffer, PriceOfferStatus } from '../../../interfaces/StorePriceOffers';
import Button from '../../../components/ui/Button';
import StatusBadge from './StatusBadge';

interface OfferTableRowProps {
  offer: StorePriceOffer;
  isRTL: boolean;
  onViewDetails: (offerId: string) => void;
  onEdit: (offer: StorePriceOffer) => void;
  onDelete: (offerId: string) => void;
  formatDate: (date: Date) => string;
  calculateTotal: (items: any[]) => number;
}

const OfferTableRow: React.FC<OfferTableRowProps> = ({
  offer,
  isRTL,
  onViewDetails,
  onEdit,
  onDelete,
  formatDate,
  calculateTotal
}) => {
  const { t } = useTranslation();

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-semibold text-gray-900">
          #{offer.id.slice(0, 8)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={14} className={`${isRTL ? 'mr-2' : 'ml-2'} text-gray-400`} />
          {formatDate(offer.createdAt)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm text-gray-600">
          <Clock size={14} className={`${isRTL ? 'mr-2' : 'ml-2'} text-gray-400`} />
          {formatDate(offer.expiryDate)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-semibold text-gray-900">
          {calculateTotal(offer.items).toFixed(2)} {t('common.currency')}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={offer.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-600">
          {offer.items.length} {t('priceOffers.items')}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className={`flex items-center justify-center ${isRTL ? 'space-x-reverse' : 'space-x'} space-x-2`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(offer.id)}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          >
            <Eye size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(offer)}
            className="text-green-600 hover:text-green-800 hover:bg-green-50"
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(offer.id)}
            className="text-red-600 hover:text-red-800 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default OfferTableRow; 