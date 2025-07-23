// import React from 'react';
// import { Link } from 'react-router-dom';
// import { IOrder, OrderStatus } from '../../interfaces/OrderInterface';
// import { Edit, Eye, Package, ExternalLink } from 'lucide-react';
// import { format } from 'date-fns';

// interface OrderTableProps {
//   orders: IOrder[];
//   loading?: boolean;
// }

// const OrderTable: React.FC<OrderTableProps> = ({ orders, loading = false }) => {
//   const getOrderStatusBadge = (status: OrderStatus) => {
//     switch (status) {
//       case OrderStatus.Pending:
//         return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
//       case OrderStatus.Processing:
//         return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Processing</span>;
//       case OrderStatus.Shipped:
//         return <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">Shipped</span>;
//       case OrderStatus.Delivered:
//         return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Delivered</span>;
//       case OrderStatus.Cancelled:
//         return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Cancelled</span>;
//       default:
//         return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Unknown</span>;
//     }
//   };

//   const formatDate = (dateString: string) => {
//     try {
//       return format(new Date(dateString), 'PPP');
//     } catch (e) {
//       return dateString;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (orders.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
//         <Package className="h-12 w-12 text-gray-400 mb-3" />
//         <h3 className="text-lg font-medium text-gray-700">No orders found</h3>
//         <p className="text-gray-500">No orders are available at the moment.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {orders.map((order) => (
//             <tr key={order.id} className="hover:bg-gray-50">
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
//                 {order.id.substring(0, 8)}...
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                 {formatDate(order.createdAt)}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                 {order.customersStore.fullName || 'Guest Customer'}
//                 {order.customersStore.phoneNumber && (
//                   <div className="text-xs text-gray-500">{order.customersStore.phoneNumber}</div>
//                 )}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                 {order.orderItems.length} items
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
//                 ${order.totalBalance.toFixed(2)}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 {getOrderStatusBadge(order.orderStatus)}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 {order.isPaid ? (
//                   <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
//                     Paid
//                   </span>
//                 ) : (
//                   <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
//                     Unpaid
//                   </span>
//                 )}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                 <div className="flex space-x-2">
//                   <Link
//                     to={`${order.id}`}
//                     className="text-blue-600 hover:text-blue-900"
//                     title="View Order Details"
//                   >
//                     <Eye className="h-5 w-5" />
//                   </Link>
//                   <Link
//                     to={`${order.id}/edit`}
//                     className="text-indigo-600 hover:text-indigo-900"
//                     title="Edit Order"
//                   >
//                     <Edit className="h-5 w-5" />
//                   </Link>
//                   <Link
//                     to={`/invoice/${order.id}`}
//                     className="text-green-600 hover:text-green-900"
//                     target="_blank"
//                     title="Open Invoice"
//                   >
//                     <ExternalLink className="h-5 w-5" />
//                   </Link>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default OrderTable; 



import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IOrder, OrderStatus } from '../../interfaces/OrderInterface';
import { Edit, Eye, Package, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface OrderTableProps {
  orders: IOrder[];
  loading?: boolean;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, loading = false }) => {
  const { t } = useTranslation();

  const getOrderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">{t('orderTable.status.pending')}</span>;
      case OrderStatus.Processing:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">{t('orderTable.status.processing')}</span>;
      case OrderStatus.Shipped:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">{t('orderTable.status.shipped')}</span>;
      case OrderStatus.Delivered:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">{t('orderTable.status.delivered')}</span>;
      case OrderStatus.Cancelled:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">{t('orderTable.status.cancelled')}</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{t('orderTable.status.unknown')}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
        <Package className="h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-700">{t('orderTable.no_orders.title')}</h3>
        <p className="text-gray-500">{t('orderTable.no_orders.message')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('orderTable.headers.order_id')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('orderTable.headers.date')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('orderTable.headers.customer')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('orderTable.headers.items')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('orderTable.headers.total')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('orderTable.headers.status')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('orderTable.headers.payment')}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('orderTable.headers.actions')}</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                {order.id.substring(0, 8)}...
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {formatDate(order.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {order.customersStore.fullName || t('orderTable.guest_customer')}
                {order.customersStore.phoneNumber && (
                  <div className="text-xs text-gray-500">{order.customersStore.phoneNumber}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {order.orderItems.length} {t('orderTable.items')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                ${order.totalBalance.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getOrderStatusBadge(order.orderStatus)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {order.isPaid ? (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    {t('orderTable.payment.paid')}
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    {t('orderTable.payment.unpaid')}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Link
                    to={`${order.id}`}
                    className="text-blue-600 hover:text-blue-900"
                    title={t('orderTable.actions.view')}
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                  <Link
                    to={`${order.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900"
                    title={t('orderTable.actions.edit')}
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  <Link
                    to={`/invoice/${order.id}`}
                    className="text-green-600 hover:text-green-900"
                    target="_blank"
                    title={t('orderTable.actions.invoice')}
                  >
                    <ExternalLink className="h-5 w-5" />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;