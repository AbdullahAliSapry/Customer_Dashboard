


import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, BarChart2, Filter, Eye } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import Button from '../components/ui/Button';
import { ApiRepository } from '../Api/ApiRepository';
import { EndPoints } from '../Api/EndPoints';
import { RootState } from '../Store/Store';
import { IStoreCustomer, CustomerStatus } from '../interfaces/StoreCustomerInterface';
import { setCustomers } from '../Store/StoreSlice/CustomerSlice';
import CustomerModal from '../components/forms/modals/CustomerModal';

const CustomersPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<IStoreCustomer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const customers = useSelector((state: RootState) => state.currentStore.customers.customers);
  const { storeId } = useParams();

  useEffect(() => {
    const apiRepository = new ApiRepository();
    apiRepository.getAll<IStoreCustomer>(EndPoints.storecustomers(storeId as string), setCustomers);
  }, [storeId, dispatch]);

  const handleViewDetails = (customer: IStoreCustomer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const filteredCustomers = searchTerm
    ? customers.filter(customer => 
        customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phoneNumber?.includes(searchTerm) ||
        customer.customerId?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : customers;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('customers.customers')}</h1>
          <p className="text-gray-600 mt-1">{t('customers.view_customers')}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
              <Users size={20} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{t('customers.customers')}</h2>
              <p className="text-sm text-gray-500">{t('customers.total', { count: filteredCustomers.length })}</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder={t('customers.search_placeholder')}
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
            <Button variant="outline" leftIcon={<Filter size={16} />}>{t('customers.filter')}</Button>
            <Button variant="outline" leftIcon={<BarChart2 size={16} />}>{t('customers.export')}</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('customers.name')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('customers.email')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('customers.phone')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('customers.status')}</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('customers.actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                          <Users size={18} className="text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.fullName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${customer.status === CustomerStatus.Active ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'}`}>
                        {t(`customers.status_${customer.status.toLowerCase()}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(customer)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? t('customers.no_matching_customers') : t('customers.no_customers')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">
                {t('customers.showing', { start: 1, end: filteredCustomers.length, total: filteredCustomers.length })}
              </p>
              
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label={t('customers.pagination')}>
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">{t('customers.previous')}</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" aria-current="page" className="z-10 bg-primary-50 border-primary-500 text-primary-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </a>
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">{t('customers.next')}</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && selectedCustomer && (
        <CustomerModal
          setIsOpen={setIsModalOpen}
          initialCustomer={selectedCustomer}
        />
      )}
    </div>
  );
};

export default CustomersPage;