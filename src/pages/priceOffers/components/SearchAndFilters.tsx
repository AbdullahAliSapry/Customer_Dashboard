import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, TrendingUp } from 'lucide-react';
import Button from '../../../components/ui/Button';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilter: () => void;
  onAnalytics: () => void;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchTerm,
  onSearchChange,
  onFilter,
  onAnalytics
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t('priceOffers.searchOffers')}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="whitespace-nowrap" onClick={onFilter}>
            <Filter size={16} className="mr-2" />
            {t('priceOffers.filter')}
          </Button>
          <Button variant="outline" className="whitespace-nowrap" onClick={onAnalytics}>
            <TrendingUp size={16} className="mr-2" />
            {t('priceOffers.analytics')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilters; 