
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  HelpCircle, 
  BarChart2, 
  Filter, 
  Plus, 
  Search, 
  Download, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  ChevronDown,
  Calendar,
  DollarSign
} from 'lucide-react';

import Button from '../components/ui/Button';

// Define TypeScript interfaces
type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';
type PaymentMethod = 'credit_card' | 'bank_transfer' | 'paypal' | 'apple_pay' | 'google_pay';

interface PaymentTransaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  orderDetails: {
    id: string;
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    subtotal: number;
    tax: number;
    shipping: number;
    discount?: number;
  };
  invoiceNumber: string;
  processingFee: number;
}

const Payments: React.FC = () => {
  const { t } = useTranslation();
  
  // State for payments data
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<PaymentTransaction | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  
  // Mock data
  const mockPayments: PaymentTransaction[] = [
    {
      id: 'PAY-1234567',
      date: '2025-04-30',
      amount: 129.99,
      currency: 'USD',
      status: 'completed',
      method: 'credit_card',
      customer: {
        id: 'CUST-001',
        name: 'Ahmed Mohammed',
        email: 'ahmed@example.com'
      },
      orderDetails: {
        id: 'ORD-00123',
        items: [
          {
            id: 'ITEM-001',
            name: 'Premium Smartphone Case',
            price: 24.99,
            quantity: 1
          },
          {
            id: 'ITEM-002',
            name: 'Wireless Earbuds',
            price: 89.99,
            quantity: 1
          }
        ],
        subtotal: 114.98,
        tax: 10.01,
        shipping: 5.00,
        discount: 0
      },
      invoiceNumber: 'INV-2025-0123',
      processingFee: 3.50
    },
    {
      id: 'PAY-7654321',
      date: '2025-04-29',
      amount: 299.50,
      currency: 'USD',
      status: 'pending',
      method: 'bank_transfer',
      customer: {
        id: 'CUST-002',
        name: 'Sara Abdullah',
        email: 'sara@example.com'
      },
      orderDetails: {
        id: 'ORD-00124',
        items: [
          {
            id: 'ITEM-003',
            name: 'Smart Watch Series 5',
            price: 249.50,
            quantity: 1
          },
          {
            id: 'ITEM-004',
            name: 'Watch Band',
            price: 35.00,
            quantity: 1
          }
        ],
        subtotal: 284.50,
        tax: 15.00,
        shipping: 0,
        discount: 0
      },
      invoiceNumber: 'INV-2025-0124',
      processingFee: 0
    },
    {
      id: 'PAY-9876543',
      date: '2025-04-28',
      amount: 75.49,
      currency: 'USD',
      status: 'refunded',
      method: 'paypal',
      customer: {
        id: 'CUST-003',
        name: 'Mohammed Ali',
        email: 'mali@example.com'
      },
      orderDetails: {
        id: 'ORD-00125',
        items: [
          {
            id: 'ITEM-005',
            name: 'Bluetooth Speaker',
            price: 69.99,
            quantity: 1
          }
        ],
        subtotal: 69.99,
        tax: 5.50,
        shipping: 0,
        discount: 0
      },
      invoiceNumber: 'INV-2025-0125',
      processingFee: 1.99
    },
    {
      id: 'PAY-2468101',
      date: '2025-04-27',
      amount: 547.75,
      currency: 'USD',
      status: 'completed',
      method: 'apple_pay',
      customer: {
        id: 'CUST-004',
        name: 'Fatima Hassan',
        email: 'fatima@example.com'
      },
      orderDetails: {
        id: 'ORD-00126',
        items: [
          {
            id: 'ITEM-006',
            name: 'Laptop Backpack',
            price: 89.99,
            quantity: 1
          },
          {
            id: 'ITEM-007',
            name: 'Wireless Mouse',
            price: 45.99,
            quantity: 1
          },
          {
            id: 'ITEM-008',
            name: 'External Hard Drive',
            price: 129.99,
            quantity: 3
          }
        ],
        subtotal: 525.95,
        tax: 21.80,
        shipping: 0,
        discount: 0
      },
      invoiceNumber: 'INV-2025-0126',
      processingFee: 5.75
    },
    {
      id: 'PAY-1357911',
      date: '2025-04-26',
      amount: 179.99,
      currency: 'USD',
      status: 'failed',
      method: 'credit_card',
      customer: {
        id: 'CUST-005',
        name: 'Khalid Omar',
        email: 'khalid@example.com'
      },
      orderDetails: {
        id: 'ORD-00127',
        items: [
          {
            id: 'ITEM-009',
            name: 'Noise-Cancelling Headphones',
            price: 179.99,
            quantity: 1
          }
        ],
        subtotal: 179.99,
        tax: 0,
        shipping: 0,
        discount: 0
      },
      invoiceNumber: 'INV-2025-0127',
      processingFee: 3.99
    }
  ];
  
  // Load mock data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPayments(mockPayments);
      setFilteredPayments(mockPayments);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Filter payments based on search query and filters
  useEffect(() => {
    let result = [...payments];
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(payment => payment.status === statusFilter);
    }
    
    // Filter by date range
    if (dateRange !== 'all') {
      const today = new Date();
      let startDate = new Date();
      
      switch(dateRange) {
        case 'today':
          startDate = new Date();
          break;
        case 'week':
          startDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(today.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(today.getMonth() - 3);
          break;
      }
      
      result = result.filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= startDate && paymentDate <= today;
      });
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(payment => 
        payment.id.toLowerCase().includes(query) ||
        payment.customer.name.toLowerCase().includes(query) ||
        payment.customer.email.toLowerCase().includes(query) ||
        payment.invoiceNumber.toLowerCase().includes(query) ||
        payment.orderDetails.id.toLowerCase().includes(query)
      );
    }
    
    setFilteredPayments(result);
  }, [payments, searchQuery, statusFilter, dateRange]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };
  
  // Handle status filter change
  const handleStatusFilter = (status: PaymentStatus | 'all'): void => {
    setStatusFilter(status);
  };
  
  // Handle date range filter change
  const handleDateRangeChange = (range: string): void => {
    setDateRange(range);
  };
  
  // Handle view payment details
  const handleViewDetails = (payment: PaymentTransaction): void => {
    setSelectedPayment(payment);
    setShowDetails(true);
  };
  
  // Handle close payment details
  const handleCloseDetails = (): void => {
    setShowDetails(false);
    setSelectedPayment(null);
  };
  
  // Get status badge
  const getStatusBadge = (status: PaymentStatus): JSX.Element => {
    switch(status) {
      case 'completed':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            {t('payments.completed')}
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {t('payments.pending')}
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center">
            <XCircle className="w-3 h-3 mr-1" />
            {t('payments.failed')}
          </span>
        );
      case 'refunded':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center">
            <RefreshCw className="w-3 h-3 mr-1" />
            {t('payments.refunded')}
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {t('payments.unknown')}
          </span>
        );
    }
  };
  
  // Get payment method icon
  const getPaymentMethodIcon = (method: PaymentMethod): JSX.Element => {
    switch(method) {
      case 'credit_card':
        return <CreditCard className="w-4 h-4 text-gray-600" />;
      case 'paypal':
        return <span className="text-xs font-bold text-blue-600">{t('payments.paypal')}</span>;
      case 'bank_transfer':
        return <span className="text-xs font-medium">{t('payments.bank')}</span>;
      case 'apple_pay':
        return <span className="text-xs font-bold">{t('payments.apple')}</span>;
      case 'google_pay':
        return <span className="text-xs font-bold text-gray-600">{t('payments.google')}</span>;
      default:
        return <span className="text-xs">-</span>;
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number, currency: string): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <DollarSign className="mr-2" /> {t('payments.payments')}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {t('payments.manage_track_payments')}
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button 
            variant="outline" 
            className="flex items-center text-sm"
            onClick={() => {}}
          >
            <Download className="w-4 h-4 mr-1" />
            {t('payments.export')}
          </Button>
          
          <Button 
            variant="primary" 
            className="flex items-center text-sm"
            onClick={() => {}}
          >
            <BarChart2 className="w-4 h-4 mr-1" />
            {t('payments.reports')}
          </Button>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            {/* Status Filter */}
            <div className="relative inline-block">
              <button
                className="flex items-center px-3 py-2 text-sm border rounded-md bg-white hover:bg-gray-50"
                onClick={() => {}}
              >
                <Filter className="w-4 h-4 mr-1 text-gray-500" />
                {statusFilter === 'all' ? t('payments.all_statuses') : t(`payments.${statusFilter}`)}
                <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
              </button>
              {/* Dropdown menu would go here */}
            </div>
            
            {/* Date Range Filter */}
            <div className="relative inline-block">
              <button
                className="flex items-center px-3 py-2 text-sm border rounded-md bg-white hover:bg-gray-50"
                onClick={() => {}}
              >
                <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                {dateRange === 'all' ? t('payments.all_time') : t(`payments.${dateRange}`)}
                <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
              </button>
              {/* Dropdown menu would go here */}
            </div>
          </div>
          
          {/* Search */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder={t('payments.search_payments')}
              className="w-full pl-8 pr-4 py-2 border rounded-md"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Payments List */}
      <div className="bg-white rounded-lg shadow-sm">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="mt-2 text-gray-600">{t('payments.loading_payments')}</span>
            </div>
          </div>
        ) : filteredPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('payments.payment_id')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('payments.date')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('payments.customer')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('payments.amount')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('payments.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('payments.method')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('payments.order_id')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('payments.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div>{payment.customer.name}</div>
                      <div className="text-xs text-gray-500">{payment.customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount, payment.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex items-center">
                        {getPaymentMethodIcon(payment.method)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {payment.orderDetails.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleViewDetails(payment)}
                      >
                        {t('payments.view_details')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <CreditCard className="w-12 h-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-700">{t('payments.no_payments_found')}</h3>
            <p className="text-gray-500 mt-1">
              {searchQuery || statusFilter !== 'all' || dateRange !== 'all'
                ? t('payments.no_payments_match_filters')
                : t('payments.no_payment_transactions')}
            </p>
          </div>
        )}
      </div>
      
      {/* Payment Details Modal */}
      {showDetails && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  {t('payments.payment_details')}
                </h2>
                <button 
                  onClick={handleCloseDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Payment Overview */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">{t('payments.payment_overview')}</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">{t('payments.payment_id')}</p>
                      <p className="text-sm font-medium">{selectedPayment.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('payments.date')}</p>
                      <p className="text-sm font-medium">{selectedPayment.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('payments.status')}</p>
                      <div className="mt-1">
                        {getStatusBadge(selectedPayment.status)}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('payments.amount')}</p>
                      <p className="text-sm font-medium">
                        {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('payments.payment_method')}</p>
                      <p className="text-sm font-medium flex items-center mt-1">
                        {getPaymentMethodIcon(selectedPayment.method)}
                        <span className="ml-1">
                          {selectedPayment.method.split('_').map(word => 
                            t(`payments.${word}`)
                          ).join(' ')}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('payments.invoice_number')}</p>
                      <p className="text-sm font-medium">{selectedPayment.invoiceNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('payments.order_id')}</p>
                      <p className="text-sm font-medium">{selectedPayment.orderDetails.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('payments.processing_fee')}</p>
                      <p className="text-sm font-medium">
                        {formatCurrency(selectedPayment.processingFee, selectedPayment.currency)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Customer Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">{t('payments.customer_information')}</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">{t('payments.customer_id')}</p>
                      <p className="text-sm font-medium">{selectedPayment.customer.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('payments.name')}</p>
                      <p className="text-sm font-medium">{selectedPayment.customer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('payments.email')}</p>
                      <p className="text-sm font-medium">{selectedPayment.customer.email}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">{t('payments.order_details')}</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {/* Items */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{t('payments.items')}</h4>
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">{t('payments.product')}</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">{t('payments.price')}</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">{t('payments.quantity')}</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">{t('payments.total')}</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedPayment.orderDetails.items.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-2 text-sm text-gray-700">{item.name}</td>
                              <td className="px-4 py-2 text-sm text-right text-gray-700">
                                {formatCurrency(item.price, selectedPayment.currency)}
                              </td>
                              <td className="px-4 py-2 text-sm text-right text-gray-700">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-2 text-sm text-right font-medium text-gray-900">
                                {formatCurrency(item.price * item.quantity, selectedPayment.currency)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Order Summary */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{t('payments.summary')}</h4>
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between py-1">
                        <span className="text-sm text-gray-600">{t('payments.subtotal')}</span>
                        <span className="text-sm text-gray-800">
                          {formatCurrency(selectedPayment.orderDetails.subtotal, selectedPayment.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-sm text-gray-600">{t('payments.shipping')}</span>
                        <span className="text-sm text-gray-800">
                          {formatCurrency(selectedPayment.orderDetails.shipping, selectedPayment.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-sm text-gray-600">{t('payments.tax')}</span>
                        <span className="text-sm text-gray-800">
                          {formatCurrency(selectedPayment.orderDetails.tax, selectedPayment.currency)}
                        </span>
                      </div>
                      {selectedPayment.orderDetails.discount && selectedPayment.orderDetails.discount > 0 && (
                        <div className="flex justify-between py-1">
                          <span className="text-sm text-gray-600">{t('payments.discount')}</span>
                          <span className="text-sm text-gray-800">
                            -{formatCurrency(selectedPayment.orderDetails.discount, selectedPayment.currency)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between py-1">
                        <span className="text-sm font-medium text-gray-700">{t('payments.total')}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;