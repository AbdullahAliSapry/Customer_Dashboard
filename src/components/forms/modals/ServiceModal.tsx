import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Save, Wrench, Clock, DollarSign, FileText } from 'lucide-react';
import { IService } from '../../../interfaces/ServiceInterface';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import TextArea from '../../FormsComponents/TextArea';
import Select from '../../ui/Select';

interface ServiceModalProps {
  setIsOpen: (isOpen: boolean) => void;
  initialService?: IService | null;
  onSave?: (service: IService) => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ 
  setIsOpen, 
  initialService, 
  onSave 
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<IService>>({
    name: '',
    description: '',
    price: 0,
    duration: 1,
    isActive: true,
    categoryid: 1
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialService) {
      setFormData({
        name: initialService.name,
        description: initialService.description,
        price: initialService.price,
        duration: initialService.duration,
        isActive: initialService.isActive,
        categoryid: initialService.categoryid
      });
    }
  }, [initialService]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = t('services.validation.name_required');
    }

    if (!formData.description?.trim()) {
      newErrors.description = t('services.validation.description_required');
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = t('services.validation.price_required');
    }

    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = t('services.validation.duration_required');
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
      const serviceData: IService = {
        id: initialService?.id || 0,
        name: formData.name!,
        description: formData.description!,
        price: formData.price!,
        duration: formData.duration!,
        isActive: formData.isActive!,
        categoryid: formData.categoryid!,
        storeid: initialService?.storeid || 1,
        createdat: initialService?.createdat || new Date(),
        startat: formData.startat,
        endat: formData.endat,
        imageid: formData.imageid
      };

      if (onSave) {
        onSave(serviceData);
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof IService, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center">
            <Wrench size={24} className="text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold">
              {initialService ? t('services.edit_service') : t('services.add_service')}
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Service Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('services.form.name')} *
            </label>
            <Input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={t('services.form.name_placeholder')}
              error={errors.name}
              leftIcon={<FileText size={18} />}
            />
          </div>

          {/* Service Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('services.form.description')} *
            </label>
            <TextArea
              id="description"
              value={formData.description || ''}
              onChange={(value) => handleInputChange('description', value)}
              placeholder={t('services.form.description_placeholder')}
              rows={4}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Price and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('services.form.price')} *
              </label>
              <Input
                type="number"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                placeholder="0.00"
                error={errors.price}
                leftIcon={<DollarSign size={18} />}
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('services.form.duration')} ({t('services.hours')}) *
              </label>
              <Input
                type="number"
                value={formData.duration || ''}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                placeholder="1"
                error={errors.duration}
                leftIcon={<Clock size={18} />}
                min="1"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('services.form.category')}
            </label>
            <Select
              value={formData.categoryid?.toString() || ''}
              onChange={(value) => handleInputChange('categoryid', value)}
              options={[
                { value: '1', label: t('services.categories.web_design') },
                { value: '2', label: t('services.categories.mobile_development') },
                { value: '3', label: t('services.categories.consulting') },
                { value: '4', label: t('services.categories.maintenance') }
              ]}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('services.form.status')}
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="true"
                  checked={formData.isActive === true}
                  onChange={() => handleInputChange('isActive', true)}
                  className="mr-2"
                />
                <span className="text-sm">{t('services.active')}</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="false"
                  checked={formData.isActive === false}
                  onChange={() => handleInputChange('isActive', false)}
                  className="mr-2"
                />
                <span className="text-sm">{t('services.inactive')}</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              leftIcon={<Save size={18} />}
              isLoading={loading}
            >
              {initialService ? t('common.update') : t('common.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal; 