import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../../components/ui/Button';

interface ActionsCardProps {
  onEdit: () => void;
  onBack: () => void;
}

const ActionsCard: React.FC<ActionsCardProps> = ({ onEdit, onBack }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">{t('priceOffers.actions')}</h2>
      </div>
      <div className="p-6 space-y-3">
        <Button
          onClick={onEdit}
          className="w-full"
          variant="outline"
        >
          {t('common.edit')}
        </Button>
        <Button
          onClick={onBack}
          className="w-full"
          variant="outline"
        >
          {t('common.backToList')}
        </Button>
      </div>
    </div>
  );
};

export default ActionsCard; 