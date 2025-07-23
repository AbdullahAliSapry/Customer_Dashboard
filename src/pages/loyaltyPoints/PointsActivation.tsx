// import React from 'react';
// import { useUser } from './context/UserContext';
// import { Gift, ArrowRight } from 'lucide-react';

// const PointsActivation: React.FC = () => {
//   const { activateLoyalty } = useUser();

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden">
//       <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
//         <Gift size={64} className="text-white" />
//       </div>
      
//       <div className="p-8 text-center">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">Activate Loyalty Points</h2>
//         <p className="text-gray-600 mb-8 max-w-md mx-auto">
//           As a Plan C subscriber, you're eligible for our exclusive loyalty program. 
//           Earn points with every purchase and redeem them for discounts!
//         </p>
        
//         <div className="space-y-6">
//           <div className="flex items-center justify-between max-w-md mx-auto">
//             <div className="text-center">
//               <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
//                 <Gift size={24} className="text-indigo-600" />
//               </div>
//               <p className="text-sm font-medium text-gray-700">Earn Points</p>
//             </div>
            
//             <ArrowRight size={20} className="text-gray-400" />
            
//             <div className="text-center">
//               <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
//                 <span className="text-indigo-600 font-bold">%</span>
//               </div>
//               <p className="text-sm font-medium text-gray-700">Get Discounts</p>
//             </div>
            
//             <ArrowRight size={20} className="text-gray-400" />
            
//             <div className="text-center">
//               <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
//                 <span className="text-indigo-600 font-bold">$</span>
//               </div>
//               <p className="text-sm font-medium text-gray-700">Cash Rewards</p>
//             </div>
//           </div>
          
//           <button 
//             onClick={activateLoyalty}
//             className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors transform hover:scale-105 duration-200"
//           >
//             Activate Loyalty Program
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PointsActivation;
import React from 'react';
import { useUser } from './context/UserContext';
import { Gift, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PointsActivation: React.FC = () => {
  const { t } = useTranslation();
  const { activateLoyalty } = useUser();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
        <Gift size={64} className="text-white" />
      </div>
      
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('pointsActivation.activate_loyalty')}</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {t('pointsActivation.loyalty_message')}
        </p>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Gift size={24} className="text-indigo-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">{t('pointsActivation.earn_points')}</p>
            </div>
            
            <ArrowRight size={20} className="text-gray-400" />
            
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-indigo-600 font-bold">%</span>
              </div>
              <p className="text-sm font-medium text-gray-700">{t('pointsActivation.get_discounts')}</p>
            </div>
            
            <ArrowRight size={20} className="text-gray-400" />
            
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-indigo-600 font-bold">$</span>
              </div>
              <p className="text-sm font-medium text-gray-700">{t('pointsActivation.cash_rewards')}</p>
            </div>
          </div>
          
          <button 
            onClick={activateLoyalty}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors transform hover:scale-105 duration-200"
          >
            {t('pointsActivation.activate_button')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointsActivation;