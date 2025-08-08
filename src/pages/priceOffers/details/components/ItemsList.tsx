import React from 'react';
import { useTranslation } from 'react-i18next';
import { Package } from 'lucide-react';
import { StorePriceOffer, PriceOfferItem } from '../../../../interfaces/StorePriceOffers';
import ItemDetails from './ItemDetails';

interface ItemsListProps {
  offer: StorePriceOffer;
  isRTL: boolean;
  getProductName: (productId: number) => string;
  calculateItemTotal: (item: PriceOfferItem) => number;
}

const ItemsList: React.FC<ItemsListProps> = ({ 
  offer, 
  isRTL, 
  getProductName, 
  calculateItemTotal 
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Package size={20} className={`${isRTL ? 'mr-2' : 'ml-2'} text-blue-600`} />
          {t('priceOffers.items')}
        </h2>
      </div>
      <div className="divide-y divide-gray-100">
        {offer.items.map((item) => (
          <ItemDetails
            key={item.id}
            item={item}
            productName={getProductName(item.productId)}
            calculateItemTotal={calculateItemTotal}
          />
        ))}
      </div>
    </div>
  );
};

export default ItemsList; 