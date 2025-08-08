import React from 'react';
import { useTranslation } from 'react-i18next';

const Loading: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-white to-gray-100">
      <div className="text-center p-8 rounded-xl bg-white shadow-lg animate-fade-in-scale">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500 mx-auto mb-6"></div>
        <p className="text-xl font-medium text-gray-700">{t('contentMapping.loading_store_data')}</p>
        <div className="mt-4 w-48 h-1 mx-auto bg-gray-200 rounded overflow-hidden">
          <div className="h-full bg-primary-500 animate-pulse-width"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;