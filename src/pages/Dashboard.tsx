


import React from "react";
import {
  Package,
  ShoppingCart,
  Users,
  ArrowUpRight,
  CreditCard,
} from "lucide-react";

import RegistrationForm from "../components/forms/RegistrationForm";
import { useTranslation } from 'react-i18next';

interface DashboardProps {
  isRegistrationCompleted: boolean;
  setRegistrationCompleted: (completed: boolean) => void;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  positive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  positive,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          {change && (
            <p
              className={`text-sm mt-2 ${
                positive ? "text-success-600" : "text-error-600"
              }`}
            >
              {change}
            </p>
          )}
        </div>
        <div className="bg-primary-50 p-3 rounded-full">{icon}</div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({
  isRegistrationCompleted,
  // Commented out to avoid linter warnings until we need it
  // setRegistrationCompleted,
}) => {
  const { t } = useTranslation();
  const [currentStep] = React.useState(1); // Default to step 1

  return (
    <div className="space-y-6">
      {!isRegistrationCompleted ? (
        <RegistrationForm step={currentStep} />
      ) : (
        // show after registration completed
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Users */}
            <StatCard
              title={t('dashboard.total_users')}
              value="1,250"
              icon={<Users size={24} className="text-primary-600" />}
              change={t('dashboard.change_plus_12')}
              positive={true}
            />

            {/* عدد المنتجات */}
            <StatCard
              title={t('dashboard.total_products')}
              value="345"
              icon={<Package size={24} className="text-primary-600" />}
              change={t('dashboard.change_plus_5')}
              positive={true}
            />

            {/* عدد الطلبات */}
            <StatCard
              title={t('dashboard.total_orders')}
              value="89"
              icon={<ShoppingCart size={24} className="text-primary-600" />}
              change={t('dashboard.change_2_action')}
              positive={false}
            />

            {/* عدد عمليات الدفع */}
            <StatCard
              title={t('dashboard.total_payments')}
              value="76"
              icon={<CreditCard size={24} className="text-primary-600" />}
              change={t('dashboard.change_plus_8')}
              positive={true}
            />
          </div>
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{t('dashboard.recent_orders')}</h3>
              <button className="text-primary-600 text-sm flex items-center">
                {t('dashboard.view_all')}<ArrowUpRight size={14} className="ml-1" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('dashboard.order_id')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('dashboard.customer')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('dashboard.amount')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('dashboard.payment_status')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('dashboard.order_status')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      #ORD-2458
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      Ahmed Ali
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      SAR 1,200
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-success-100 text-success-800">
                        {t('dashboard.payment_success')}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-success-100 text-success-800">
                        {t('dashboard.completed')}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      #ORD-2457
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      Mohammed Kamal
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      SAR 850
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-warning-100 text-warning-800">
                        {t('dashboard.pending_payment')}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-warning-100 text-warning-800">
                        {t('dashboard.processing')}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      #ORD-2456
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      Sara Nasser
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      SAR 3,250
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-error-100 text-error-800">
                        {t('dashboard.payment_failed')}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-error-100 text-error-800">
                        {t('dashboard.cancelled')}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{t('dashboard.top_products')}</h3>
              <button className="text-primary-600 text-sm flex items-center">
                {t('dashboard.view_all')}<ArrowUpRight size={14} className="ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded flex items-center justify-center">
                    <Package size={18} className="text-primary-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Product A</p>
                    <p className="text-xs text-gray-500">{t('dashboard.sold_45')}</p>
                  </div>
                </div>
                <p className="font-semibold">SAR 12,500</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded flex items-center justify-center">
                    <Package size={18} className="text-primary-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Product B</p>
                    <p className="text-xs text-gray-500">{t('dashboard.sold_38')}</p>
                  </div>
                </div>
                <p className="font-semibold">SAR 9,800</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded flex items-center justify-center">
                    <Package size={18} className="text-primary-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Product C</p>
                    <p className="text-xs text-gray-500">{t('dashboard.sold_32')}</p>
                  </div>
                </div>
                <p className="font-semibold">SAR 7,200</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;