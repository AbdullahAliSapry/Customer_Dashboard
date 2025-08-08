import React from 'react';
import { useTranslation } from 'react-i18next';
import { StorePriceOffer } from '../../../interfaces/StorePriceOffers';
import OfferTableRow from './OfferTableRow';
import EmptyState from './EmptyState';

interface OffersTableProps {
  offers: StorePriceOffer[];
  isRTL: boolean;
  onViewDetails: (offerId: string) => void;
  onEdit: (offer: StorePriceOffer) => void;
  onDelete: (offerId: string) => void;
  onCreateNew: () => void;
  formatDate: (date: Date) => string;
  calculateTotal: (items: any[]) => number;
}

const OffersTable: React.FC<OffersTableProps> = ({
  offers,
  isRTL,
  onViewDetails,
  onEdit,
  onDelete,
  onCreateNew,
  formatDate,
  calculateTotal
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className={`px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('priceOffers.offerId')}
              </th>
              <th scope="col" className={`px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('priceOffers.createdDate')}
              </th>
              <th scope="col" className={`px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('priceOffers.expiryDate')}
              </th>
              <th scope="col" className={`px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('priceOffers.totalAmount')}
              </th>
              <th scope="col" className={`px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('priceOffers.status')}
              </th>
              <th scope="col" className={`px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('priceOffers.items')}
              </th>
              <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t('priceOffers.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {offers.length === 0 ? (
              <EmptyState onCreateNew={onCreateNew} />
            ) : (
              offers.map((offer) => (
                <OfferTableRow
                  key={offer.id}
                  offer={offer}
                  isRTL={isRTL}
                  onViewDetails={onViewDetails}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  formatDate={formatDate}
                  calculateTotal={calculateTotal}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OffersTable; 