import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';

interface NotesSectionProps {
  notes: string;
  isRTL: boolean;
}

const NotesSection: React.FC<NotesSectionProps> = ({ notes, isRTL }) => {
  const { t } = useTranslation();

  if (!notes) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText size={20} className={`${isRTL ? 'mr-2' : 'ml-2'} text-green-600`} />
          {t('priceOffers.notes')}
        </h2>
      </div>
      <div className="px-6 py-6">
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{notes}</p>
      </div>
    </div>
  );
};

export default NotesSection; 