import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, CheckCircle, Crown, Zap, Globe, Shield } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubscribe
}) => {
  const { t } = useTranslation();
  
  if (!isOpen) return null;

  const plans = [
    {
      id: 'basic',
      name: t('translation.subscription_modal.basic_plan'),
      price: 29,
      period: t('translation.subscription_modal.monthly'),
      features: [
        t('translation.subscription_modal.basic_features.0'),
        t('translation.subscription_modal.basic_features.1'),
        t('translation.subscription_modal.basic_features.2'),
        t('translation.subscription_modal.basic_features.3')
      ],
      popular: false
    },
    {
      id: 'premium',
      name: t('translation.subscription_modal.premium_plan'),
      price: 49,
      period: t('translation.subscription_modal.monthly'),
      features: [
        t('translation.subscription_modal.premium_features.0'),
        t('translation.subscription_modal.premium_features.1'),
        t('translation.subscription_modal.premium_features.2'),
        t('translation.subscription_modal.premium_features.3'),
        t('translation.subscription_modal.premium_features.4'),
        t('translation.subscription_modal.premium_features.5')
      ],
      popular: true
    }
  ];

     return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
       <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                               <div className="p-2 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg animate-pulse">
                   <Crown className="text-white" size={20} />
                 </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('translation.subscription_modal.title')}
                </h2>
                <p className="text-gray-600 mt-1">
                  {t('translation.subscription_modal.subtitle')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="text-gray-500" size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Features Overview */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                               <div className="flex items-center space-x-3 p-4 bg-primary-50 rounded-lg">
                   <Globe className="text-primary-600" size={20} />
                   <div>
                     <h4 className="font-semibold text-gray-900">{t('translation.subscription_modal.languages_support')}</h4>
                     <p className="text-sm text-gray-600">{t('translation.subscription_modal.languages_description')}</p>
                   </div>
                 </div>
                 <div className="flex items-center space-x-3 p-4 bg-secondary-50 rounded-lg">
                   <Zap className="text-secondary-600" size={20} />
                   <div>
                     <h4 className="font-semibold text-gray-900">{t('translation.subscription_modal.instant_translation')}</h4>
                     <p className="text-sm text-gray-600">{t('translation.subscription_modal.speed_description')}</p>
                   </div>
                 </div>
                 <div className="flex items-center space-x-3 p-4 bg-accent-50 rounded-lg">
                   <Shield className="text-accent-600" size={20} />
                   <div>
                     <h4 className="font-semibold text-gray-900">{t('translation.subscription_modal.high_quality')}</h4>
                     <p className="text-sm text-gray-600">{t('translation.subscription_modal.quality_description')}</p>
                   </div>
                 </div>
            </div>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                  plan.popular
                    ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                                     <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                     <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                       {t('translation.subscription_modal.most_popular')}
                     </span>
                   </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-primary-600">
                      ${plan.price}
                    </span>
                    <span className="text-gray-500">/{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={onSubscribe}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    plan.popular
                      ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                                     {plan.popular ? t('translation.subscription_modal.subscribe_now') : t('translation.subscription_modal.choose_plan')}
                </button>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="text-blue-600" size={16} />
              </div>
              <div>
                                 <h4 className="font-semibold text-gray-900 mb-1">
                   {t('translation.subscription_modal.money_back')}
                 </h4>
                 <p className="text-sm text-gray-600">
                   {t('translation.subscription_modal.money_back_description')}
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal; 