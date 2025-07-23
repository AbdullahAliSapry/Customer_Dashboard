// import React from 'react';
// import { Link } from 'react-router-dom';
// import { ShoppingBag } from 'lucide-react';

// const NoPoints: React.FC = () => {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-8 text-center">
//       <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
//         <ShoppingBag size={32} className="text-amber-500" />
//       </div>
      
//       <h2 className="text-2xl font-bold text-gray-800 mb-3">No Points Yet</h2>
//       <p className="text-gray-600 mb-8 max-w-md mx-auto">
//         You haven't earned any loyalty points yet. Start purchasing websites to earn points and unlock exclusive rewards!
//       </p>
      
//       <Link 
//         to="/shop"
//         className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
//       >
//         <ShoppingBag size={20} className="mr-2" />
//         Go to Shop
//       </Link>
      
//       <div className="mt-10 pt-8 border-t border-gray-100">
//         <h3 className="text-lg font-semibold text-gray-700 mb-4">How to Earn Points</h3>
//         <div className="grid md:grid-cols-3 gap-6">
//           <div className="p-4 bg-gray-50 rounded-lg">
//             <div className="font-bold text-indigo-600 text-lg mb-2">1</div>
//             <h4 className="font-medium text-gray-800 mb-1">Purchase Websites</h4>
//             <p className="text-sm text-gray-600">Earn 10 points for every $1 spent</p>
//           </div>
          
//           <div className="p-4 bg-gray-50 rounded-lg">
//             <div className="font-bold text-indigo-600 text-lg mb-2">2</div>
//             <h4 className="font-medium text-gray-800 mb-1">Refer Friends</h4>
//             <p className="text-sm text-gray-600">Get 500 points for each referral</p>
//           </div>
          
//           <div className="p-4 bg-gray-50 rounded-lg">
//             <div className="font-bold text-indigo-600 text-lg mb-2">3</div>
//             <h4 className="font-medium text-gray-800 mb-1">Complete Profile</h4>
//             <p className="text-sm text-gray-600">Earn 200 points one-time bonus</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NoPoints;



import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NoPoints: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingBag size={32} className="text-amber-500" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-3">{t('noPoints.no_points')}</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {t('noPoints.no_points_message')}
      </p>
      
      <Link 
        to="/shop"
        className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <ShoppingBag size={20} className="mr-2" />
        {t('noPoints.go_to_shop')}
      </Link>
      
      <div className="mt-10 pt-8 border-t border-gray-100">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{t('noPoints.how_to_earn_points')}</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="font-bold text-indigo-600 text-lg mb-2">1</div>
            <h4 className="font-medium text-gray-800 mb-1">{t('noPoints.purchase_websites')}</h4>
            <p className="text-sm text-gray-600">{t('noPoints.purchase_websites_points')}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="font-bold text-indigo-600 text-lg mb-2">2</div>
            <h4 className="font-medium text-gray-800 mb-1">{t('noPoints.refer_friends')}</h4>
            <p className="text-sm text-gray-600">{t('noPoints.refer_friends_points')}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="font-bold text-indigo-600 text-lg mb-2">3</div>
            <h4 className="font-medium text-gray-800 mb-1">{t('noPoints.complete_profile')}</h4>
            <p className="text-sm text-gray-600">{t('noPoints.complete_profile_points')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoPoints;