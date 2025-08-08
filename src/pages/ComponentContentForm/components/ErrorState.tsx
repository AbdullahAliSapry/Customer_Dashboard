import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ErrorStateProps {
  errorMessage: string | null;
}

const ErrorState: React.FC<ErrorStateProps> = ({ errorMessage }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-lg mx-auto animate-slide-up-fade">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-5 rounded-lg shadow-md mb-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="font-medium">{errorMessage || t('contentMapping.failed_to_load_store_data')}</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="w-full px-5 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-300 shadow-md flex items-center justify-center transform hover:scale-[1.03] active:scale-[0.98]"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          {t('contentMapping.return_to_dashboard')}
        </button>
      </div>
    </div>
  );
};

export default ErrorState;