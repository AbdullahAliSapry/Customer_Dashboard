import React from 'react';
import { useTranslation } from 'react-i18next';
import { Package } from 'lucide-react';
import Button from '../../../../components/ui/Button';

interface NotFoundStateProps {
  onBack: () => void;
}

const NotFoundState: React.FC<NotFoundStateProps> = ({ onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Package className="text-gray-400 mx-auto mb-4" size={64} />
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('priceOffers.offerNotFound')}</h2>
        <Button
          onClick={onBack}
          className="mt-4"
        >
          {t('common.backToList')}
        </Button>
      </div>
    </div>
  );
};

export default NotFoundState; 