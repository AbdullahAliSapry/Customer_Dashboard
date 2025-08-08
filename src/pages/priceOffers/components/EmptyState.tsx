import React from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Plus } from 'lucide-react';
import Button from '../../../components/ui/Button';

interface EmptyStateProps {
  onCreateNew: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateNew }) => {
  const { t } = useTranslation();

  return (
    <tr>
      <td colSpan={7} className="px-6 py-12 text-center">
        <div className="flex flex-col items-center">
          <Package className="text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('priceOffers.noOffersFound')}</h3>
          <p className="text-gray-600 mb-4">{t('priceOffers.noOffersDescription')}</p>
          <Button onClick={onCreateNew} leftIcon={<Plus size={16} />}>
            {t('priceOffers.createOffer')}
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default EmptyState; 