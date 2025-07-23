

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, BarChart2, Filter, Search, RefreshCw } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import Button from '../components/ui/Button';
import { ApiRepository } from '../Api/ApiRepository';
import { EndPoints } from '../Api/EndPoints';
import { RootState } from '../Store/Store';
import { IOrder, OrderStatus } from '../interfaces/OrderInterface';
import { setOrders } from '../Store/StoreSlice/OrderSlice';
import OrderTable from '../components/orders/OrderTable';

const OrdersPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const allOrders = useSelector((state: RootState) => state.currentStore.orders.orders);
  const { storeId } = useParams();

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const apiRepository = new ApiRepository();
        await apiRepository.getAll<IOrder>(EndPoints.orders(storeId as string), setOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [storeId, dispatch]);

  // Apply filters and search
  const filteredOrders = React.useMemo(() => {
    let result = [...allOrders];
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(order => 
        order.orderStatus === parseInt(statusFilter));
    }
    
    // Filter by search
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(query) || 
        (order.customersStore?.fullName && order.customersStore.fullName.toLowerCase().includes(query))
      );
    }
    
    return result;
  }, [allOrders, statusFilter, searchTerm]);

  const handleRefresh = () => {
    const apiRepository = new ApiRepository();
    setLoading(true);
    apiRepository.getAll<IOrder>(EndPoints.orders(storeId as string), setOrders)
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('orders.orders')}</h1>
          <p className="text-gray-600 mt-1">{t('orders.manage_orders')}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
              <ShoppingCart size={20} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{t('orders.orders')}</h2>
              <p className="text-sm text-gray-500">{t('orders.total', { count: filteredOrders.length })}</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder={t('orders.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none"
              >
                <option value="all">{t('orders.all_statuses')}</option>
                <option value={OrderStatus.Pending.toString()}>{t('orders.pending')}</option>
                <option value={OrderStatus.Processing.toString()}>{t('orders.processing')}</option>
                <option value={OrderStatus.Shipped.toString()}>{t('orders.shipped')}</option>
                <option value={OrderStatus.Delivered.toString()}>{t('orders.delivered')}</option>
                <option value={OrderStatus.Cancelled.toString()}>{t('orders.cancelled')}</option>
              </select>
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <Button variant="outline" onClick={handleRefresh} leftIcon={<RefreshCw size={16} />} disabled={loading}>
              {t('orders.refresh')}
            </Button>
            
            <Button variant="outline" leftIcon={<BarChart2 size={16} />}>{t('orders.export')}</Button>
          </div>
        </div>

        <OrderTable orders={filteredOrders} loading={loading} />

        {filteredOrders.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">
                {t('orders.showing', { start: 1, end: filteredOrders.length, total: filteredOrders.length })}
              </p>
              
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label={t('orders.pagination')}>
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">{t('orders.previous')}</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" aria-current="page" className="z-10 bg-primary-50 border-primary-500 text-primary-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </a>
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">{t('orders.next')}</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;