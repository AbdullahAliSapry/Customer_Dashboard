import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Save, Clock, Calendar, Sun, Moon, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StoreHouresWorkInterfafce, DayOfWeekEnum } from '../../../interfaces/StoreHouresWorkInterfafce';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Checkbox from '../../ui/Checkbox';

interface StoreHoursModalProps {
  setIsOpen: (isOpen: boolean) => void;
  initialStoreHours?: StoreHouresWorkInterfafce | null;
  onSave?: (storeHours: StoreHouresWorkInterfafce) => void;
  storeId: number;
}

const StoreHoursModal: React.FC<StoreHoursModalProps> = ({ 
  setIsOpen, 
  initialStoreHours, 
  onSave,
  storeId
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<StoreHouresWorkInterfafce>>({
    dayOfWeek: DayOfWeekEnum.Sunday,
    isClosed: false,
    openTime: '',
    closeTime: '',
    storeId: storeId
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const dayOptions = [
    { value: DayOfWeekEnum.Sunday, label: t('storeHours.sunday') },
    { value: DayOfWeekEnum.Monday, label: t('storeHours.monday') },
    { value: DayOfWeekEnum.Tuesday, label: t('storeHours.tuesday') },
    { value: DayOfWeekEnum.Wednesday, label: t('storeHours.wednesday') },
    { value: DayOfWeekEnum.Thursday, label: t('storeHours.thursday') },
    { value: DayOfWeekEnum.Friday, label: t('storeHours.friday') },
    { value: DayOfWeekEnum.Saturday, label: t('storeHours.saturday') },
  ];

  useEffect(() => {
    if (initialStoreHours) {
      setFormData({
        dayOfWeek: initialStoreHours.dayOfWeek,
        isClosed: initialStoreHours.isClosed,
        openTime: initialStoreHours.openTime || '',
        closeTime: initialStoreHours.closeTime || '',
        storeId: initialStoreHours.storeId
      });
    }
  }, [initialStoreHours]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.isClosed) {
      if (!formData.openTime?.trim()) {
        newErrors.openTime = t('storeHours.validation.open_time_required');
      }
      if (!formData.closeTime?.trim()) {
        newErrors.closeTime = t('storeHours.validation.close_time_required');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const storeHoursData: StoreHouresWorkInterfafce = {
        id: initialStoreHours?.id || 0,
        dayOfWeek: formData.dayOfWeek!,
        isClosed: formData.isClosed!,
        openTime: formData.isClosed ? null : formData.openTime!,
        closeTime: formData.isClosed ? null : formData.closeTime!,
        storeId: storeId
      };

      if (onSave) {
        onSave(storeHoursData);
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving store hours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof StoreHouresWorkInterfafce, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ 
            opacity: 0, 
            scale: 0.9, 
            y: 20 
          }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0 
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.9, 
            y: 20 
          }}
          transition={{ 
            duration: 0.3, 
            ease: "easeOut" 
          }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden border border-gray-100"
        >
          {/* Header */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 text-white p-6 overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
            </div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-reverse space-x-3">
                <motion.div 
                  className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Clock size={24} className="text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {initialStoreHours ? t('storeHours.edit_hours') : t('storeHours.add_hours')}
                  </h3>
                  <p className="text-primary-100 text-sm mt-1">
                    {initialStoreHours ? t('storeHours.edit_description') : t('storeHours.add_description')}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors border border-white/20"
              >
                <X size={20} />
              </motion.button>
            </div>
          </motion.div>

          {/* Error Alert */}
          <AnimatePresence>
            {hasErrors && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-red-50 border-r-4 border-red-400 p-4"
              >
                <div className="flex items-center space-x-reverse space-x-2">
                  <AlertCircle size={16} className="text-red-400" />
                  <p className="text-red-700 text-sm font-medium">
                    {t('common.please_fix_errors')}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            onSubmit={handleSubmit} 
            className="p-6 space-y-6"
          >
            {/* Day Selection */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Calendar size={16} className="ml-2 text-primary-600" />
                {t('storeHours.day_of_week')}
              </label>
              <Select
                value={formData.dayOfWeek}
                onChange={(value) => handleInputChange('dayOfWeek', parseInt(value))}
                options={dayOptions}
                placeholder={t('storeHours.select_day')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white hover:border-primary-400"
              />
            </motion.div>

            {/* Closed Toggle */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="flex items-center space-x-reverse space-x-3 p-4 bg-gray-50 rounded-xl border-2 border-transparent hover:border-primary-200 transition-all duration-200"
            >
              <Checkbox
                checked={formData.isClosed}
                onChange={(checked) => handleInputChange('isClosed', checked)}
              />
              <label className="text-sm font-medium text-gray-700 flex items-center cursor-pointer">
                <X size={16} className="ml-2 text-red-500" />
                {t('storeHours.closed')}
              </label>
            </motion.div>

            {/* Time Fields */}
            <AnimatePresence>
              {!formData.isClosed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Sun size={16} className="ml-2 text-secondary-500" />
                      {t('storeHours.open_time')}
                    </label>
                    <Input
                      type="time"
                      value={formData.openTime}
                      onChange={(e) => handleInputChange('openTime', e.target.value)}
                      error={errors.openTime}
                      placeholder="09:00"
                      leftIcon={<Sun size={16} className="text-secondary-400" />}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white hover:border-primary-400"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Moon size={16} className="ml-2 text-primary-500" />
                      {t('storeHours.close_time')}
                    </label>
                    <Input
                      type="time"
                      value={formData.closeTime}
                      onChange={(e) => handleInputChange('closeTime', e.target.value)}
                      error={errors.closeTime}
                      placeholder="18:00"
                      leftIcon={<Moon size={16} className="text-primary-400" />}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white hover:border-primary-400"
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
              className="flex justify-end space-x-reverse space-x-3 pt-6 border-t border-gray-200"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {t('common.cancel')}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  leftIcon={<Save size={18} />}
                  isLoading={loading}
                  className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white"
                >
                  {t('common.save')}
                </Button>
              </motion.div>
            </motion.div>
          </motion.form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StoreHoursModal;