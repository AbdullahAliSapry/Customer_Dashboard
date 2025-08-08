import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Wrench, BarChart2, Filter, Plus, Edit, Trash2, Clock, TrendingUp, DollarSign, Users, Activity } from 'lucide-react';
import { ApiRepository } from '../Api/ApiRepository';
import Button from '../components/ui/Button';
import { IService } from '../interfaces/ServiceInterface';
import { useParams } from 'react-router-dom';
import ServiceModal from '../components/forms/modals/ServiceModal';

const ServicesPage: React.FC = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const { storeId } = useParams();

  useEffect(() => {
    const fetchServices = async () => {
      if (!storeId) return;
      
      setLoading(true);
      try {
        const apiRepository = new ApiRepository();
        // TODO: Replace with actual services endpoint
        // const response = await apiRepository.getAll<IService>(EndPoints.services(storeId), setServices);
        
        // Mock data for now
        const mockServices: IService[] = [
          {
            id: 1,
            name: 'تصميم موقع إلكتروني',
            description: 'تصميم موقع إلكتروني احترافي مع واجهة مستخدم حديثة ومتجاوبة',
            createdat: new Date(),
            price: 5000,
            duration: 40,
            categoryid: 1,
            storeid: parseInt(storeId),
            isActive: true
          },
          {
            id: 2,
            name: 'تطوير تطبيق موبايل',
            description: 'تطوير تطبيق iOS و Android مع أحدث التقنيات والأداء العالي',
            createdat: new Date(),
            price: 8000,
            duration: 80,
            categoryid: 2,
            storeid: parseInt(storeId),
            isActive: true
          },
          {
            id: 3,
            name: 'استشارات تقنية',
            description: 'استشارات تقنية متخصصة في تطوير المشاريع الرقمية',
            createdat: new Date(),
            price: 2000,
            duration: 20,
            categoryid: 3,
            storeid: parseInt(storeId),
            isActive: true
          },
          {
            id: 4,
            name: 'صيانة المواقع',
            description: 'خدمات صيانة وتحديث المواقع الإلكترونية',
            createdat: new Date(),
            price: 1500,
            duration: 10,
            categoryid: 4,
            storeid: parseInt(storeId),
            isActive: false
          }
        ];
        setServices(mockServices);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [storeId]);

  const handleEdit = (service: IService) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDelete = async (serviceId: number) => {
    if (!window.confirm(t('services.delete_confirmation'))) {
      return;
    }
    
    try {
      // TODO: Replace with actual delete endpoint
      // const apiRepository = new ApiRepository();
      // await apiRepository.delete(EndPoints.service, serviceId.toString());
      
      setServices(services.filter(service => service.id !== serviceId));
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleSaveService = (service: IService) => {
    if (service.id === 0) {
      // Add new service
      const newService = { ...service, id: Date.now() };
      setServices([...services, newService]);
    } else {
      // Update existing service
      setServices(services.map(s => s.id === service.id ? service : s));
    }
  };

  // Calculate statistics
  const totalServices = services.length;
  const activeServices = services.filter(s => s.isActive).length;
  const totalRevenue = services.reduce((sum, s) => sum + s.price, 0);
  const avgPrice = totalServices > 0 ? totalRevenue / totalServices : 0;

  const handleAddNew = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('services.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('services.services')}</h1>
          <p className="text-gray-600 mt-1">{t('services.manage_your_services')}</p>
        </div>
        <div className="flex space-x-4">
          <Button
            leftIcon={<Filter size={18} />}
            variant="outline"
          >
            {t('services.filter')}
          </Button>
          <Button
            leftIcon={<BarChart2 size={18} />}
            variant="outline"
          >
            {t('services.analytics')}
          </Button>
          <Button
            leftIcon={<Plus size={18} />}
            onClick={handleAddNew}
          >
            {t('services.add_service')}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wrench size={24} className="text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('services.total_services')}</p>
              <p className="text-2xl font-bold text-gray-900">{totalServices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity size={24} className="text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('services.active_services')}</p>
              <p className="text-2xl font-bold text-gray-900">{activeServices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign size={24} className="text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('services.total_value')}</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp size={24} className="text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('services.avg_price')}</p>
              <p className="text-2xl font-bold text-gray-900">${avgPrice.toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{t('services.services_list')}</h3>
          <p className="text-sm text-gray-500 mt-1">{t('services.services_list_description')}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('services.service')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('services.price')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('services.duration')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('services.category')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('services.status')}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('services.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                        <Wrench size={18} className="text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-semibold">${service.price.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      {service.duration} {t('services.hours')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {service.categoryid === 1 && t('services.categories.web_design')}
                    {service.categoryid === 2 && t('services.categories.mobile_development')}
                    {service.categoryid === 3 && t('services.categories.consulting')}
                    {service.categoryid === 4 && t('services.categories.maintenance')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      service.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.isActive ? t('services.active') : t('services.inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                        title={t('services.edit_service')}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                        title={t('services.delete_service')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {services.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Wrench size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('services.no_services')}</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">{t('services.no_services_description')}</p>
            <Button
              leftIcon={<Plus size={18} />}
              onClick={handleAddNew}
              size="lg"
            >
              {t('services.add_first_service')}
            </Button>
          </div>
        )}
      </div>

      {/* Service Modal */}
      {isModalOpen && (
        <ServiceModal
          setIsOpen={setIsModalOpen}
          initialService={selectedService}
          onSave={handleSaveService}
        />
      )}
    </div>
  );
};

export default ServicesPage; 