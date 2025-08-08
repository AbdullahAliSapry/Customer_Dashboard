import React from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';

interface EmptyProductStateProps {
  onCreateNew: () => void;
}

const EmptyProductState: React.FC<EmptyProductStateProps> = ({ onCreateNew }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow">
      <div className="flex items-center justify-center w-20 h-20 bg-primary-50 rounded-full mb-4">
        <Package className="text-primary-600" size={32} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('products.noProductsFound')}</h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">{t('products.noProductsDescription')}</p>
      <Button onClick={onCreateNew} leftIcon={<Plus size={18} />}>
        {t('products.add_product')}
      </Button>
    </div>
  );
};

export default EmptyProductState;