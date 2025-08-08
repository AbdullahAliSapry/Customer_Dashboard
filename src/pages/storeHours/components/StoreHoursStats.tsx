import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface StoreHoursStatsProps {
  totalDays: number;
  openDays: number;
  closedDays: number;
}

const StoreHoursStats: React.FC<StoreHoursStatsProps> = ({ 
  totalDays, 
  openDays, 
  closedDays 
}) => {
  const { t } = useTranslation();

  // If no data, show empty state
  if (totalDays === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-500 opacity-60"
        >
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Calendar size={24} className="text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('storeHours.total_days')}</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500 opacity-60"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('storeHours.open_days')}</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500 opacity-60"
        >
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle size={24} className="text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('storeHours.closed_days')}</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-500"
      >
        <div className="flex items-center">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Calendar size={24} className="text-primary-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{t('storeHours.total_days')}</p>
            <p className="text-2xl font-bold text-gray-900">{totalDays}</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500"
      >
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle size={24} className="text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{t('storeHours.open_days')}</p>
            <p className="text-2xl font-bold text-gray-900">{openDays}</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500"
      >
        <div className="flex items-center">
          <div className="p-2 bg-red-100 rounded-lg">
            <XCircle size={24} className="text-red-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{t('storeHours.closed_days')}</p>
            <p className="text-2xl font-bold text-gray-900">{closedDays}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StoreHoursStats;