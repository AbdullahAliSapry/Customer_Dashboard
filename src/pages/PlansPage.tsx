import React from 'react';
import { Check, Star } from 'lucide-react';
import { cn } from '../utils/cn';
import { useTranslation } from 'react-i18next';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  features: PlanFeature[];
  isPopular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'plans.basic', // سيتم ترجمة هذا باستخدام t()
    price: 99,
    period: 'monthly',
    features: [
      { name: 'plans.features.up_to_2_stores', included: true },
      { name: 'plans.features.basic_analytics', included: true },
      { name: 'plans.features.support_24_7', included: true },
      { name: 'plans.features.custom_domain', included: false },
      { name: 'plans.features.advanced_features', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'plans.professional', // سيتم ترجمة هذا باستخدام t()
    price: 199,
    period: 'monthly',
    isPopular: true,
    features: [
      { name: 'plans.features.up_to_5_stores', included: true },
      { name: 'plans.features.advanced_analytics', included: true },
      { name: 'plans.features.priority_support_24_7', included: true },
      { name: 'plans.features.custom_domain', included: true },
      { name: 'plans.features.advanced_features', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'plans.enterprise', // سيتم ترجمة هذا باستخدام t()
    price: 499,
    period: 'monthly',
    features: [
      { name: 'plans.features.unlimited_stores', included: true },
      { name: 'plans.features.enterprise_analytics', included: true },
      { name: 'plans.features.dedicated_support_24_7', included: true },
      { name: 'plans.features.multiple_custom_domains', included: true },
      { name: 'plans.features.all_advanced_features', included: true },
    ],
  },
];

const PlansPage = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('plans.choosePlan')}</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {t('plans.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "bg-white rounded-lg shadow-sm p-6",
                "border border-gray-100",
                plan.isPopular && "border-primary-500 relative"
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {t('plans.most_popular')}
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t(plan.name)}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500">/{t(`plans.${plan.period}`)}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      feature.included ? "bg-green-50" : "bg-gray-50"
                    )}>
                      <Check className={cn(
                        "w-3 h-3",
                        feature.included ? "text-green-600" : "text-gray-400"
                      )} />
                    </div>
                    <span className={cn(
                      "text-sm",
                      feature.included ? "text-gray-700" : "text-gray-400"
                    )}>
                      {t(feature.name)}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={cn(
                  "w-full py-2 px-4 rounded-lg font-medium transition-colors",
                  plan.isPopular
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {t('plans.get_started')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlansPage;