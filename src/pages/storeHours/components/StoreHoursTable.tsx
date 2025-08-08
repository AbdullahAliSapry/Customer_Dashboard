import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, CheckCircle, XCircle, Edit, Trash2, Plus, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import { StoreHouresWorkInterfafce, DayOfWeekEnum } from '../../../interfaces/StoreHouresWorkInterfafce';
import { ErrorInfo } from '../../../Api/ApiRepository';
import Button from '../../../components/ui/Button';

interface StoreHoursTableProps {
  storeHours: StoreHouresWorkInterfafce[];
  loading: boolean;
  error: ErrorInfo | null;
  onEdit: (storeHours: StoreHouresWorkInterfafce) => void;
  onDelete: (storeHoursId: number) => void;
  onAddNew?: () => void;
}

const StoreHoursTable: React.FC<StoreHoursTableProps> = ({
  storeHours,
  loading,
  error,
  onEdit,
  onDelete,
  onAddNew
}) => {
  const { t } = useTranslation();

  const getDayName = (dayOfWeek: DayOfWeekEnum): string => {
    const dayNames = {
      [DayOfWeekEnum.Sunday]: t('storeHours.sunday'),
      [DayOfWeekEnum.Monday]: t('storeHours.monday'),
      [DayOfWeekEnum.Tuesday]: t('storeHours.tuesday'),
      [DayOfWeekEnum.Wednesday]: t('storeHours.wednesday'),
      [DayOfWeekEnum.Thursday]: t('storeHours.thursday'),
      [DayOfWeekEnum.Friday]: t('storeHours.friday'),
      [DayOfWeekEnum.Saturday]: t('storeHours.saturday'),
    };
    return dayNames[dayOfWeek];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (storeHours.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{t('storeHours.hours_list')}</h3>
          <p className="text-sm text-gray-500 mt-1">{t('storeHours.hours_list_description')}</p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-6"
          >
            <CalendarDays size={32} className="text-primary-600" />
          </motion.div>
          
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl font-semibold text-gray-900 mb-2"
          >
            {t('storeHours.no_hours_title')}
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-500 mb-8 max-w-md mx-auto"
          >
            {t('storeHours.no_hours_description')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            {onAddNew && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  leftIcon={<Plus size={18} />}
                  onClick={onAddNew}
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3"
                >
                  {t('storeHours.add_first_hours')}
                </Button>
              </motion.div>
            )}
            
            <div className="flex items-center space-x-reverse space-x-2 text-sm text-gray-400">
              <Clock size={14} />
              <span>{t('storeHours.quick_setup_hint')}</span>
            </div>
          </motion.div>
          
          {/* Quick Setup Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            <div className="flex items-center space-x-reverse space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
              <span>{t('storeHours.tip_1')}</span>
            </div>
            <div className="flex items-center space-x-reverse space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-secondary-400 rounded-full"></div>
              <span>{t('storeHours.tip_2')}</span>
            </div>
            <div className="flex items-center space-x-reverse space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-accent-400 rounded-full"></div>
              <span>{t('storeHours.tip_3')}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">{t('storeHours.hours_list')}</h3>
        <p className="text-sm text-gray-500 mt-1">{t('storeHours.hours_list_description')}</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('storeHours.day')}
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('storeHours.status')}
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('storeHours.open_time')}
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('storeHours.close_time')}
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('storeHours.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {storeHours.map((hours) => (
              <tr key={hours.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Calendar size={16} className="text-primary-600" />
                    </div>
                    <div className="mr-3">
                      <div className="text-sm font-medium text-gray-900">
                        {getDayName(hours.dayOfWeek)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {hours.isClosed ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <XCircle size={12} className="ml-1" />
                      {t('storeHours.closed')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle size={12} className="ml-1" />
                      {t('storeHours.open')}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {hours.isClosed ? (
                    <span className="text-gray-400">-</span>
                  ) : (
                    <div className="flex items-center">
                      <Clock size={14} className="text-gray-400 ml-1" />
                      {hours.openTime}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {hours.isClosed ? (
                    <span className="text-gray-400">-</span>
                  ) : (
                    <div className="flex items-center">
                      <Clock size={14} className="text-gray-400 ml-1" />
                      {hours.closeTime}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                  <div className="flex items-center space-x-reverse space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Edit size={14} />}
                      onClick={() => onEdit(hours)}
                    >
                      {t('common.edit')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Trash2 size={14} />}
                      onClick={() => onDelete(hours.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      {t('common.delete')}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreHoursTable;