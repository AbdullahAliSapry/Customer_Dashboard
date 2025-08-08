import React from 'react';
import { useTranslation } from 'react-i18next';

const EmptyContentState: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
      <p className="text-gray-500 text-lg">{t('contentMapping.select_component')}</p>
      <p className="text-gray-400 text-sm mt-2">{t('contentMapping.select_component_instruction')}</p>
    </div>
  );
};

export default EmptyContentState;