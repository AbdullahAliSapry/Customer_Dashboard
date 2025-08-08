import React from 'react';
import { useTranslation } from 'react-i18next';
import { PriceOfferItem } from '../../../../interfaces/StorePriceOffers';

interface ItemDetailsProps {
  item: PriceOfferItem;
  productName: string;
  calculateItemTotal: (item: PriceOfferItem) => number;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ item, productName, calculateItemTotal }) => {
  const { t } = useTranslation();

  return (
    <div className="px-6 py-6 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {productName}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                {t('priceOffers.quantity')}
              </p>
              <p className="text-lg font-semibold text-gray-900">{item.quantity}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                {t('priceOffers.unitPrice')}
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {item.unitPrice} {t('common.currency')}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                {t('priceOffers.discount')}
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {item.discount} {t('common.currency')}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-1">
                {t('priceOffers.itemTotal')}
              </p>
              <p className="text-lg font-bold text-blue-900">
                {calculateItemTotal(item).toFixed(2)} {t('common.currency')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails; 