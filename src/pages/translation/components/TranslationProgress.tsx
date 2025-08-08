import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, CheckCircle, Clock } from 'lucide-react';

interface TranslationProgressProps {
  progress: number;
}

const TranslationProgress: React.FC<TranslationProgressProps> = ({ progress }) => {
  const { t } = useTranslation();
  
  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressText = (progress: number) => {
    if (progress < 20) return t('translation.progress.analyzing');
    if (progress < 40) return t('translation.progress.translating');
    if (progress < 60) return t('translation.progress.reviewing');
    if (progress < 80) return t('translation.progress.saving');
    if (progress < 100) return t('translation.progress.finishing');
    return t('translation.progress.completed');
  };

  const getProgressIcon = (progress: number) => {
    if (progress === 100) {
      return <CheckCircle className="text-green-500" size={20} />;
    }
    return <Loader2 className="text-primary-500 animate-spin" size={20} />;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {getProgressIcon(progress)}
                     <h3 className="text-lg font-semibold text-gray-900">
             {t('translation.translation_progress')}
           </h3>
        </div>
      </div>
      
      <div className="p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {getProgressText(progress)}
            </span>
            <span className="text-sm font-bold text-primary-600">
              {progress}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor(progress)}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Progress Details */}
        <div className="space-y-4">
                     <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
             <div className="flex items-center space-x-2">
               <Clock className="text-gray-500" size={16} />
               <span className="text-sm text-gray-700">{t('translation.progress.time_remaining')}</span>
             </div>
             <span className="text-sm font-medium text-gray-900">
               {progress === 100 ? t('translation.progress.complete') : `${Math.max(1, Math.ceil((100 - progress) / 10))} ${t('translation.progress.minutes')}`}
             </span>
           </div>

           <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
             <div className="flex items-center space-x-2">
               <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
               <span className="text-sm text-gray-700">{t('translation.progress.translated_products')}</span>
             </div>
             <span className="text-sm font-medium text-gray-900">
               {Math.floor((progress / 100) * 4)} من 4
             </span>
           </div>

           <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
             <div className="flex items-center space-x-2">
               <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
               <span className="text-sm text-gray-700">{t('translation.progress.translated_words')}</span>
             </div>
             <span className="text-sm font-medium text-gray-900">
               {Math.floor((progress / 100) * 250)} من 250
             </span>
           </div>
        </div>

        {/* Success Message */}
        {progress === 100 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-500" size={20} />
              <div>
                                 <h4 className="font-medium text-green-900">
                   {t('translation.progress.success_title')}
                 </h4>
                 <p className="text-sm text-green-700 mt-1">
                   {t('translation.progress.success_message')}
                 </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationProgress; 