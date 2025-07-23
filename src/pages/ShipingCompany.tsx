

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, Package, Search, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/Store';
import ShippingModal from '../components/forms/modals/ShippingModal';

// Define TypeScript interfaces
type OrderStatus = 'delivered' | 'in_transit' | 'pending' | 'failed';

interface ShippingCompany {
  id: number;
  name: string;
  isActive: boolean;
}

interface ShippingOrder {
  id: string;
  trackingNumber: string;
  customer: string;
  date: string;
  status: OrderStatus;
  company: string;
  address: string;
}

const ShippingCompanyPage: React.FC = () => {
  const { t } = useTranslation();
  
  // State for shipping companies activation
  const isActivated = useSelector((state: RootState) => state.currentStore.shipping.isActive);
  // State for orders
  const [orders, setOrders] = useState<ShippingOrder[]>([]);
  // State for loading
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // State for search
  const [searchQuery, setSearchQuery] = useState<string>('');
  // State for modal
  const [showModal, setShowModal] = useState<boolean>(false);
  
  // Mock data for shipping companies
  const shippingCompanies: ShippingCompany[] = [
    { id: 1, name: 'Fast Express', isActive: false },
    { id: 2, name: 'Global Logistics', isActive: false },
    { id: 3, name: 'Quick Delivery', isActive: false }
  ];
  
  // Mock data for orders
  const mockOrders: ShippingOrder[] = [
    { 
      id: 'ORD-001', 
      trackingNumber: 'TRK12345678', 
      customer: 'Ahmed Khalid', 
      date: '2025-04-25', 
      status: 'delivered',
      company: 'Fast Express',
      address: 'Riyadh, Saudi Arabia'
    },
    { 
      id: 'ORD-002', 
      trackingNumber: 'TRK87654321', 
      customer: 'Mohammed Ali', 
      date: '2025-04-28', 
      status: 'in_transit',
      company: 'Global Logistics',
      address: 'Jeddah, Saudi Arabia'
    },
    { 
      id: 'ORD-003', 
      trackingNumber: 'TRK11223344', 
      customer: 'Sara Ahmed', 
      date: '2025-04-29', 
      status: 'pending',
      company: 'Quick Delivery',
      address: 'Dammam, Saudi Arabia'
    },
    { 
      id: 'ORD-004', 
      trackingNumber: 'TRK55667788', 
      customer: 'Fatima Hassan', 
      date: '2025-04-30', 
      status: 'failed',
      company: 'Fast Express',
      address: 'Medina, Saudi Arabia'
    }
  ];

  // Function to activate shipping companies
  const handleActivate = (): void => {
    setShowModal(true);
  };

  const handleShippingSuccess = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 1500);
  };

  // Function to refresh orders
  const handleRefresh = (): void => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  };

  // Function to handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  // Filter orders based on search query
  const filteredOrders: ShippingOrder[] = orders.filter(order => 
    order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to get status badge
  const getStatusBadge = (status: OrderStatus): JSX.Element => {
    switch(status) {
      case 'delivered':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            {t('shipping.delivered')}
          </span>
        );
      case 'in_transit':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center">
            <Truck className="w-3 h-3 mr-1" />
            {t('shipping.in_transit')}
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {t('shipping.pending')}
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center">
            <XCircle className="w-3 h-3 mr-1" />
            {t('shipping.failed')}
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {t('shipping.unknown')}
          </span>
        );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Truck className="mr-2" /> {t('shipping.shipping_company')}
        </h1>
        <p className="text-gray-600 mt-1">
          {t('shipping.manage_shipping_providers')}
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Activation Section */}
        <div className="mb-8 border-b pb-6">
          <h2 className="text-lg font-semibold mb-4">{t('shipping.shipping_providers')}</h2>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="bg-gray-50 p-4 rounded-lg flex-grow">
              <div className="text-sm text-gray-700 mb-2">
                {t('shipping.activate_shipping_companies')}
              </div>
              <div className="text-sm text-gray-500">
                {isActivated ? 
                  <span className="text-green-600 font-medium">{t('shipping.shipping_providers_active')}</span> : 
                  t('shipping.shipping_providers_inactive')}
              </div>
            </div>
            <button
              onClick={handleActivate}
              disabled={isLoading || isActivated}
              className={`px-4 py-2 rounded-md text-white font-medium flex items-center
                ${isActivated ? 'bg-green-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {t('shipping.processing')}
                </>
              ) : isActivated ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {t('shipping.activated')}
                </>
              ) : (
                t('shipping.activate_shipping')
              )}
            </button>
          </div>

          {isActivated && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {shippingCompanies.map(company => (
                <div key={company.id} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm font-medium">{company.name}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{t('shipping.active')}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders Section */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h2 className="text-lg font-semibold">{t('shipping.shipping_orders')}</h2>
            
            <div className="flex items-center mt-2 md:mt-0 space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('shipping.search_orders')}
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-8 pr-4 py-2 border rounded-md text-sm w-full md:w-64"
                />
                <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              
              <button 
                onClick={handleRefresh}
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
              >
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {isActivated ? (
            <>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="flex flex-col items-center">
                    <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                    <span className="mt-2 text-gray-600">{t('shipping.loading_orders')}</span>
                  </div>
                </div>
              ) : filteredOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('shipping.order_id')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('shipping.tracking_number')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('shipping.customer')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('shipping.shipping_date')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('shipping.shipping_company')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('shipping.status')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                            {order.trackingNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <div>{order.customer}</div>
                            <div className="text-xs text-gray-500">{order.address}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {order.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {order.company}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(order.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <div className="bg-blue-50 p-3 rounded-full mb-4">
                    <Package className="w-14 h-14 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">{t('shipping.no_shipping_orders')}</h3>
                  <p className="text-gray-600 text-center max-w-md mb-2">
                    {searchQuery 
                      ? t('shipping.no_orders_match_search') 
                      : t('shipping.shipping_active_no_orders')}
                  </p>
                  <p className="text-gray-500 text-sm text-center max-w-md">
                    {t('shipping.orders_will_appear_here')}
                  </p>
                  <button 
                    onClick={handleRefresh}
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t('shipping.refresh')}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
              <Truck className="w-12 h-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-700">{t('shipping.no_shipping_data')}</h3>
              <p className="text-gray-500 mt-1">{t('shipping.activate_to_view_orders')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Shipping Modal */}
      {showModal && (
        <ShippingModal
          setIsOpen={setShowModal}
          onSuccess={handleShippingSuccess}
        />
      )}
    </div>
  );
};

export default ShippingCompanyPage;