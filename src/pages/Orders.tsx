// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { Search, Filter, RefreshCw } from 'lucide-react';
// import OrderTable from '../components/orders/OrderTable';
// import { IOrder, OrderStatus } from '../interfaces/OrderInterface';
// import { useSelector } from 'react-redux';
// import { RootState } from '../Store/Store';
// import { ApiRepository } from '../Api/ApiRepository';
// import { EndPoints } from '../Api/EndPoints';
// import { setOrders } from '../Store/StoreSlice/OrderSlice';



// const Orders: React.FC = () => {
//   const { storeId } = useParams<{ storeId: string }>();
//   const orders = useSelector((state: RootState) => state.currentStore.orders.orders);
//   const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('all');

//   const apirepository = new ApiRepository();
//   useEffect(() => {
//     apirepository.getAll<IOrder>(EndPoints.orders(storeId as string), setOrders);
//     setLoading(false);
//     setFilteredOrders(orders);
//     setStatusFilter('all');
//     setSearchQuery('');
//   }
//   , [storeId]);

//   useEffect(() => {
//     // Apply filters and search
//     let result = orders;

//     // Filter by status
//     if (statusFilter !== 'all') {
//       result = result.filter(order => 
//         order.orderStatus === parseInt(statusFilter));
//     }

//     // Filter by search query
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       result = result.filter(order => 
//         order.id.toLowerCase().includes(query) || 
//         (order.customersStore.fullName && order.customersStore.fullName.toLowerCase().includes(query))
//       );
//     }

//     setFilteredOrders(result);
//   }, [orders, statusFilter, searchQuery]);

//   const handleRefresh = () => {
//     setLoading(true);
//     apirepository.getAll<IOrder>(EndPoints.orders(storeId as string), setOrders);
//     setLoading(false);
//     setFilteredOrders(orders);
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
//           <p className="text-gray-600 mt-1">Manage and track your store orders</p>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
//         <div className="p-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div className="relative flex-grow max-w-md">
//               <input
//                 type="text"
//                 placeholder="Search by order ID or customer name..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//               />
//               <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//             </div>
            
//             <div className="flex space-x-2">
//               <div className="relative">
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="all">All Statuses</option>
//                   <option value={OrderStatus.Pending.toString()}>Pending</option>
//                   <option value={OrderStatus.Processing.toString()}>Processing</option>
//                   <option value={OrderStatus.Shipped.toString()}>Shipped</option>
//                   <option value={OrderStatus.Delivered.toString()}>Delivered</option>
//                   <option value={OrderStatus.Cancelled.toString()}>Cancelled</option>
//                 </select>
//                 <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//               </div>
              
//               <button
//                 onClick={handleRefresh}
//                 className="p-2 flex items-center justify-center text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 disabled={loading}
//               >
//                 <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//         <div className="p-6 border-b">
//           <div className="flex justify-between items-center">
//             <h2 className="text-lg font-semibold text-gray-800">All Orders</h2>
//             <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">
//               {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
//             </span>
//           </div>
//         </div>
        
//         <OrderTable orders={filteredOrders} loading={loading} />
//       </div>
//     </div>
//   );
// };

// export default Orders; 


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Filter, RefreshCw } from 'lucide-react';
import OrderTable from '../components/orders/OrderTable';
import { IOrder, OrderStatus } from '../interfaces/OrderInterface';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/Store';
import { ApiRepository } from '../Api/ApiRepository';
import { EndPoints } from '../Api/EndPoints';
import { setOrders } from '../Store/StoreSlice/OrderSlice';
import { useTranslation } from 'react-i18next';

const Orders: React.FC = () => {
  const { t } = useTranslation();
  const { storeId } = useParams<{ storeId: string }>();
  const orders = useSelector((state: RootState) => state.currentStore.orders.orders);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const apirepository = new ApiRepository();
  useEffect(() => {
    apirepository.getAll<IOrder>(EndPoints.orders(storeId as string), setOrders);
    setLoading(false);
    setFilteredOrders(orders);
    setStatusFilter('all');
    setSearchQuery('');
  }, [storeId]);

  useEffect(() => {
    // Apply filters and search
    let result = orders;

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(order => 
        order.orderStatus === parseInt(statusFilter));
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(query) || 
        (order.customersStore.fullName && order.customersStore.fullName.toLowerCase().includes(query))
      );
    }

    setFilteredOrders(result);
  }, [orders, statusFilter, searchQuery]);

  const handleRefresh = () => {
    setLoading(true);
    apirepository.getAll<IOrder>(EndPoints.orders(storeId as string), setOrders);
    setLoading(false);
    setFilteredOrders(orders);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('orders.orders')}</h1>
          <p className="text-gray-600 mt-1">{t('orders.manage_orders')}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder={t('orders.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <div className="flex space-x-2">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">{t('orders.all_statuses')}</option>
                  <option value={OrderStatus.Pending.toString()}>{t('orders.status.pending')}</option>
                  <option value={OrderStatus.Processing.toString()}>{t('orders.status.processing')}</option>
                  <option value={OrderStatus.Shipped.toString()}>{t('orders.status.shipped')}</option>
                  <option value={OrderStatus.Delivered.toString()}>{t('orders.status.delivered')}</option>
                  <option value={OrderStatus.Cancelled.toString()}>{t('orders.status.cancelled')}</option>
                </select>
                <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              <button
                onClick={handleRefresh}
                className="p-2 flex items-center justify-center text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
                title={t('orders.refresh')}
              >
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">{t('orders.all_orders')}</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium py-1 px-2 rounded">
              {filteredOrders.length} {filteredOrders.length === 1 ? t('orders.order') : t('orders.orders_count')}
            </span>
          </div>
        </div>
        
        <OrderTable orders={filteredOrders} loading={loading} />
      </div>
    </div>
  );
};

export default Orders;