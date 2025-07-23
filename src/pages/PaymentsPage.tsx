import  { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, BarChart2, Filter, Eye } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import Button from '../components/ui/Button';
import { ApiRepository } from '../Api/ApiRepository';
import { EndPoints } from '../Api/EndPoints';
import { RootState } from '../Store/Store';
import { IPayment, PaymentStatus } from '../interfaces/PaymentInterface';
import { setPayments } from '../Store/StoreSlice/PaymentSlice';
import PaymentDetailsModal from '../components/forms/modals/PaymentDetailsModal';

const PaymentsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const payments = useSelector((state: RootState) => state.currentStore.payments.payments);
  const { storeId } = useParams();

  useEffect(() => {
    const apiRepository = new ApiRepository();
    apiRepository.getAll<IPayment>(EndPoints.payments(storeId as string), setPayments);
  }, [storeId, dispatch]);

  const handleViewDetails = (payment: IPayment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const getStatusBadgeClass = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.Completed:
        return 'bg-success-100 text-success-800';
      case PaymentStatus.Pending:
        return 'bg-yellow-100 text-yellow-800';
      case PaymentStatus.Failed:
        return 'bg-error-100 text-error-800';
      case PaymentStatus.Refunded:
        return 'bg-blue-100 text-blue-800';
      case PaymentStatus.Cancelled:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toFixed(2)}`;
  };

  const formatDate = (date: Date | string) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  const filteredPayments = searchTerm
    ? payments.filter(payment => 
        payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.method.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : payments;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('Payments')}</h1>
          <p className="text-gray-600 mt-1">View payment transactions</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
              <CreditCard size={20} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Payments</h2>
              <p className="text-sm text-gray-500">Total: {filteredPayments.length} payments</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <Button variant="outline" leftIcon={<Filter size={16} />}>Filter</Button>
            <Button variant="outline" leftIcon={<BarChart2 size={16} />}>Export</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                          <CreditCard size={18} className="text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{payment.paymentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.orderId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(payment.amount, payment.currency)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.method}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(payment.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(payment)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'No payments found matching your search.' : 'No payments available.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredPayments.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPayments.length}</span> of <span className="font-medium">{filteredPayments.length}</span> results
              </p>
              
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" aria-current="page" className="z-10 bg-primary-50 border-primary-500 text-primary-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </a>
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && selectedPayment && (
        <PaymentDetailsModal
          setIsOpen={setIsModalOpen}
          payment={selectedPayment}
        />
      )}
    </div>
  );
};

export default PaymentsPage; 