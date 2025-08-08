import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare } from 'lucide-react';

interface FeedbackSectionProps {
  feedback: string;
  isRTL: boolean;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ feedback, isRTL }) => {
  const { t } = useTranslation();

  if (!feedback) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <MessageSquare size={20} className={`${isRTL ? 'mr-2' : 'ml-2'} text-purple-600`} />
          {t('priceOffers.customerFeedback')}
        </h2>
      </div>
      <div className="px-6 py-6">
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{feedback}</p>
      </div>
    </div>
  );
};

export default FeedbackSection; 