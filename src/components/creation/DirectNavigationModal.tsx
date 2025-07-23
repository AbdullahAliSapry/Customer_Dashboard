// import React, { useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import { ArrowRight } from 'lucide-react';

// interface DirectNavigationModalProps {
//   storeId: number;
//   show: boolean;
// }

// const DirectNavigationModal: React.FC<DirectNavigationModalProps> = ({ storeId, show }) => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (show && storeId) {
//       // Try immediate navigation
//       console.log("DirectNavigationModal: Attempting immediate navigation to", `/content-mapping/${storeId}`);
      
//       // First try to navigate programmatically
//       const navigationTimeout = setTimeout(() => {
//         navigate(`/content-mapping/${storeId}`);
//       }, 200);
      
//       // If that doesn't work after a delay, use location.href
//       const fallbackTimeout = setTimeout(() => {
//         console.log("DirectNavigationModal: Fallback navigation with location.href");
//         window.location.href = `/content-mapping/${storeId}`;
//       }, 500);
      
//       return () => {
//         clearTimeout(navigationTimeout);
//         clearTimeout(fallbackTimeout);
//       };
//     }
//   }, [show, storeId, navigate]);

//   if (!show) return null;

//   const handleManualNavigation = () => {
//     console.log("DirectNavigationModal: Manual navigation click");
    
//     try {
//       // Try programmatic navigation
//       navigate(`/content-mapping/${storeId}`);
      
//       // Fallback to direct href
//       setTimeout(() => {
//         window.location.href = `/content-mapping/${storeId}`;
//       }, 100);
//     } catch (error) {
//       console.error("Navigation error:", error);
//       window.location.href = `/content-mapping/${storeId}`;
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//     >
//       <div className="bg-white rounded-lg p-6 max-w-md w-full">
//         <h2 className="text-xl font-bold mb-4 text-center">Your Store Has Been Created!</h2>
//         <p className="mb-4 text-center">
//           You'll now be redirected to set up your store content.
//         </p>
//         <div className="text-center">
//           <button
//             onClick={handleManualNavigation}
//             className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium flex items-center mx-auto hover:bg-green-700 transition-colors"
//           >
//             Go to Content Mapping
//             <ArrowRight className="ml-2" size={18} />
//           </button>
//           <p className="mt-3 text-sm text-gray-500">
//             Store ID: {storeId}
//           </p>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default DirectNavigationModal; 


import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DirectNavigationModalProps {
  storeId: number;
  show: boolean;
}

const DirectNavigationModal: React.FC<DirectNavigationModalProps> = ({ storeId, show }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (show && storeId) {
      // Try immediate navigation
      console.log(t('navigationModal.attempting_navigation', { path: `/content-mapping/${storeId}` }));
      
      // First try to navigate programmatically
      const navigationTimeout = setTimeout(() => {
        navigate(`/content-mapping/${storeId}`);
      }, 200);
      
      // If that doesn't work after a delay, use location.href
      const fallbackTimeout = setTimeout(() => {
        console.log(t('navigationModal.fallback_navigation'));
        window.location.href = `/content-mapping/${storeId}`;
      }, 500);
      
      return () => {
        clearTimeout(navigationTimeout);
        clearTimeout(fallbackTimeout);
      };
    }
  }, [show, storeId, navigate, t]);

  if (!show) return null;

  const handleManualNavigation = () => {
    console.log(t('navigationModal.manual_navigation'));
    
    try {
      // Try programmatic navigation
      navigate(`/content-mapping/${storeId}`);
      
      // Fallback to direct href
      setTimeout(() => {
        window.location.href = `/content-mapping/${storeId}`;
      }, 100);
    } catch (error) {
      console.error(t('navigationModal.navigation_error'), error);
      window.location.href = `/content-mapping/${storeId}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-center">{t('navigationModal.store_created')}</h2>
        <p className="mb-4 text-center">
          {t('navigationModal.redirect_message')}
        </p>
        <div className="text-center">
          <button
            onClick={handleManualNavigation}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium flex items-center mx-auto hover:bg-green-700 transition-colors"
          >
            {t('navigationModal.go_to_content_mapping')}
            <ArrowRight className="ml-2" size={18} />
          </button>
          <p className="mt-3 text-sm text-gray-500">
            {t('navigationModal.store_id', { id: storeId })}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DirectNavigationModal;