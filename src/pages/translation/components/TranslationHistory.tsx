import React from 'react';
import { useTranslation } from 'react-i18next';
import { History, Globe, Calendar, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface TranslationRecord {
  id: string;
  date: string;
  language: string;
  productsCount: number;
  status: 'completed' | 'in_progress' | 'failed';
  duration: string;
}

const TranslationHistory: React.FC = () => {
  const { t } = useTranslation();
  
  const mockHistory: TranslationRecord[] = [
    {
      id: '1',
      date: '2024-01-15',
      language: 'English',
      productsCount: 4,
      status: 'completed',
      duration: '5 دقائق'
    },
    {
      id: '2',
      date: '2024-01-14',
      language: 'Français',
      productsCount: 3,
      status: 'completed',
      duration: '4 دقائق'
    },
    {
      id: '3',
      date: '2024-01-13',
      language: 'Español',
      productsCount: 2,
      status: 'failed',
      duration: '--'
    },
    {
      id: '4',
      date: '2024-01-12',
      language: 'Deutsch',
      productsCount: 5,
      status: 'completed',
      duration: '6 دقائق'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'in_progress':
        return <Clock className="text-blue-500" size={16} />;
      case 'failed':
        return <AlertCircle className="text-red-500" size={16} />;
      default:
        return <Clock className="text-gray-500" size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return t('translation.history.status.completed');
      case 'in_progress':
        return t('translation.history.status.in_progress');
      case 'failed':
        return t('translation.history.status.failed');
      default:
        return t('translation.history.status.unknown');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <History className="text-primary-600" size={20} />
                     <h3 className="text-lg font-semibold text-gray-900">
             {t('translation.translation_history')}
           </h3>
        </div>
      </div>
      
      <div className="p-6">
        {mockHistory.length === 0 ? (
          <div className="text-center py-8">
            <Globe className="text-gray-400 mx-auto mb-4" size={48} />
                         <h4 className="text-lg font-medium text-gray-900 mb-2">
               {t('translation.history.no_history')}
             </h4>
             <p className="text-gray-600">
               {t('translation.history.no_history_description')}
             </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockHistory.map((record) => (
              <div
                key={record.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Globe className="text-primary-600" size={16} />
                    </div>
                    <div>
                                             <h4 className="font-medium text-gray-900">
                         {t('translation.history.translation_to')} {record.language}
                       </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="text-gray-500" size={12} />
                        <span className="text-xs text-gray-500">
                          {new Date(record.date).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(record.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {getStatusText(record.status)}
                    </span>
                  </div>
                </div>
                
                                 <div className="flex items-center justify-between text-sm text-gray-600">
                   <span>
                     {record.productsCount} {t('translation.history.products_count')}
                   </span>
                   <span>
                     {t('translation.history.duration')}: {record.duration}
                   </span>
                 </div>
              </div>
            ))}
          </div>
        )}
        
        {mockHistory.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
                         <button className="w-full px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors">
               {t('translation.history.view_all')}
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationHistory; 