import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Filter, BarChart2 } from 'lucide-react';
import Button from '../../../components/ui/Button';

interface StoreHoursHeaderProps {
  onAddNew: () => void;
}

const StoreHoursHeader: React.FC<StoreHoursHeaderProps> = ({ onAddNew }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('storeHours.title')}
        </h1>
        <p className="text-gray-600">
          {t('storeHours.description')}
        </p>
      </div>
      <div className="flex space-x-reverse space-x-4 mt-4 sm:mt-0">
        <Button
          leftIcon={<Filter size={18} />}
          variant="outline"
        >
          {t('storeHours.filter')}
        </Button>
        <Button
          leftIcon={<BarChart2 size={18} />}
          variant="outline"
        >
          {t('storeHours.analytics')}
        </Button>
        <Button
          leftIcon={<Plus size={18} />}
          onClick={onAddNew}
        >
          {t('storeHours.add_hours')}
        </Button>
      </div>
    </div>
  );
};

export default StoreHoursHeader;