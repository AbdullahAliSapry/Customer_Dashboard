import React from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Filter, Plus } from 'lucide-react';
import Button from '../../../components/ui/Button';

interface PageHeaderProps {
  onCreateNew: () => void;
  onFilter: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onCreateNew, onFilter }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <DollarSign className="mr-3 text-blue-600" size={32} />
                {t('priceOffers.priceOffers')}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {t('priceOffers.managePriceOffers')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                leftIcon={<Filter size={18} />}
                variant="outline"
                className="w-full sm:w-auto"
                onClick={onFilter}
              >
                {t('priceOffers.filter')}
              </Button>
              <Button
                leftIcon={<Plus size={18} />}
                onClick={onCreateNew}
                className="w-full sm:w-auto"
              >
                {t('priceOffers.createOffer')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader; 