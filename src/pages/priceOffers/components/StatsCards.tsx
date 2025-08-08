import React from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Clock, TrendingUp, DollarSign } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    total: number;
    pending: number;
    accepted: number;
    totalValue: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const { t } = useTranslation();

  const cards = [
    {
      icon: <Package className="text-blue-600" size={20} />,
      bgColor: 'bg-blue-100',
      title: t('priceOffers.totalOffers'),
      value: stats.total,
      color: 'text-blue-600'
    },
    {
      icon: <Clock className="text-yellow-600" size={20} />,
      bgColor: 'bg-yellow-100',
      title: t('priceOffers.offersInWaiting'),
      value: stats.pending,
      color: 'text-yellow-600'
    },
    {
      icon: <TrendingUp className="text-green-600" size={20} />,
      bgColor: 'bg-green-100',
      title: t('priceOffers.acceptedOffers'),
      value: stats.accepted,
      color: 'text-green-600'
    },
    {
      icon: <DollarSign className="text-purple-600" size={20} />,
      bgColor: 'bg-purple-100',
      title: t('priceOffers.totalValue'),
      value: `${stats.totalValue.toFixed(2)} ${t('common.currency')}`,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                {card.icon}
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards; 