

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, CreditCard, Download } from 'lucide-react';
import { cn } from '../utils/cn';

interface Subscription {
  id: string;
  planName: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  invoiceUrl?: string;
}


const SubscriptionsPage = () => {
  const { t } = useTranslation();
const subscriptions: Subscription[] = [
  {
    id: '1',
    planName: t('subscriptions.professional_plan'),
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    amount: 199,
    billingCycle: 'monthly',
    invoiceUrl: '/invoices/1',
  },
  {
    id: '2',
    planName: t('subscriptions.basic_plan'),
    status: 'cancelled',
    startDate: '2023-06-01',
    endDate: '2023-12-31',
    amount: 99,
    billingCycle: 'monthly',
    invoiceUrl: '/invoices/2',
  },
];
  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t('subscriptions.your_subscriptions')}</h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('subscriptions.plan')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('subscriptions.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('subscriptions.period')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('subscriptions.amount')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('subscriptions.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subscriptions.map((subscription) => (
                  <tr key={subscription.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {subscription.planName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {t(`subscriptions.${subscription.billingCycle}`)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "px-2 py-1 text-xs font-medium rounded-full",
                          subscription.status === 'active' && "bg-green-50 text-green-700",
                          subscription.status === 'cancelled' && "bg-gray-50 text-gray-700",
                          subscription.status === 'expired' && "bg-red-50 text-red-700"
                        )}
                      >
                        {t(`subscriptions.${subscription.status}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(subscription.startDate).toLocaleDateString()} -{' '}
                          {new Date(subscription.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${subscription.amount}/{t(`subscriptions.${subscription.billingCycle}`)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscription.invoiceUrl && (
                        <button
                          onClick={() => window.open(subscription.invoiceUrl, '_blank')}
                          className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                        >
                          <Download className="w-4 h-4" />
                          <span>{t('subscriptions.download_invoice')}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {subscriptions.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('subscriptions.no_subscriptions_found')}
              </h3>
              <p className="text-gray-500 mb-6">
                {t('subscriptions.no_subscriptions_message')}
              </p>
              <button
                onClick={() => window.location.href = '/plans'}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <CreditCard className="w-5 h-5" />
                <span>{t('subscriptions.view_plans')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionsPage;