import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';

const NotFoundPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  return (
    <DashboardLayout isRegistrationCompleted={true}>
      <div className="flex justify-center items-center min-h-[60vh]" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-white rounded-xl shadow p-8 max-w-xl w-full flex flex-col items-center">
          <div className="bg-red-50 rounded-full p-4 mb-4 flex items-center justify-center">
            <AlertTriangle className="text-red-500 w-16 h-16 animate-pulse" />
          </div>
          <h1 className="text-4xl font-extrabold text-red-600 mb-2 drop-shadow">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800 text-center">
            {t('notFound.title')}
          </h2>
          <p className="mb-6 text-gray-600 text-center text-lg max-w-md">
            {t('notFound.description')}
          </p>
          <div className="flex gap-4 w-full justify-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <Home className="w-5 h-5" />
              {t('notFound.backToHome')}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg shadow border border-gray-200 hover:bg-gray-200 transition-all text-base font-medium"
            >
              <RefreshCw className="w-5 h-5" />
              {t('common.reload', 'تحديث الصفحة')}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotFoundPage; 