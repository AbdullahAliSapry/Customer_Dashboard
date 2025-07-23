// import { motion } from 'framer-motion';
// import { CheckCircle, AlertCircle, X, ArrowRight } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// interface SuccessNotificationProps {
//   show: boolean;
//   message?: string;
//   storeId?: number;
// }

// export const SuccessNotification = ({ 
//   show, 
//   message = 'Store created successfully!', 
//   storeId 
// }: SuccessNotificationProps) => {
//   const navigate = useNavigate();
  
//   if (!show) return null;

//   const handleNavigate = () => {
//     if (storeId) {
//       console.log("Navigating to content mapping from notification with ID:", storeId);
//       navigate(`/content-mapping/${storeId}`);
//     } else {
//       navigate('/dashboard');
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -50 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -50 }}
//       className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
//     >
//       <div className="flex flex-col items-center">
//         <div className="flex items-center mb-2">
//           <CheckCircle size={20} className="mr-2" />
//           <span>{message}</span>
//         </div>
//         <button 
//           onClick={handleNavigate}
//           className="bg-white text-green-600 px-4 py-1 rounded flex items-center text-sm font-medium hover:bg-green-50"
//         >
//           Continue to Content Mapping
//           <ArrowRight size={16} className="ml-1" />
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// interface ErrorNotificationProps {
//   show: boolean;
//   message: string;
//   onClose: () => void;
//   validationErrors?: Record<string, string[]>;
// }

// export const ErrorNotification = ({ 
//   show, 
//   message, 
//   onClose,
//   validationErrors = {} 
// }: ErrorNotificationProps) => {
//   if (!show) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -50 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -50 }}
//       className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md w-full"
//     >
//       <div className="flex items-center justify-between mb-2">
//         <div className="flex items-center">
//           <AlertCircle size={20} className="mr-2" />
//           <span className="font-medium">{message}</span>
//         </div>
//         <button onClick={onClose} className="text-white hover:text-red-100">
//           <X size={16} />
//         </button>
//       </div>

//       {Object.keys(validationErrors).length > 0 && (
//         <div className="mt-2 text-sm bg-red-600 p-2 rounded">
//           <ul className="list-disc pl-4 space-y-1">
//             {Object.entries(validationErrors).map(([field, messages]) => (
//               <li key={field}>
//                 <strong>{field}:</strong> {messages.join(', ')}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// interface LoadingOverlayProps {
//   show: boolean;
//   message?: string;
// }

// export const LoadingOverlay = ({ 
//   show, 
//   message = 'Creating Your Store' 
// }: LoadingOverlayProps) => {
//   if (!show) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
//     >
//       <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
//         <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full mb-4"></div>
//         <h3 className="text-lg font-medium text-neutral-800 mb-1">{message}</h3>
//         <p className="text-neutral-600 text-sm">Please wait while we set up your store...</p>
//       </div>
//     </motion.div>
//   );
// }; 


import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SuccessNotificationProps {
  show: boolean;
  message?: string;
  storeId?: number;
}

export const SuccessNotification = ({ 
  show, 
  message = 'notifications.success.default_message', 
  storeId 
}: SuccessNotificationProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  if (!show) return null;

  const handleNavigate = () => {
    if (storeId) {
      console.log(t('notifications.success.navigating', { id: storeId }));
      navigate(`/content-mapping/${storeId}`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
    >
      <div className="flex flex-col items-center">
        <div className="flex items-center mb-2">
          <CheckCircle size={20} className="mr-2" />
          <span>{t(message)}</span>
        </div>
        <button 
          onClick={handleNavigate}
          className="bg-white text-green-600 px-4 py-1 rounded flex items-center text-sm font-medium hover:bg-green-50"
        >
          {t('notifications.success.continue_button')}
          <ArrowRight size={16} className="ml-1" />
        </button>
      </div>
    </motion.div>
  );
};

interface ErrorNotificationProps {
  show: boolean;
  message: string;
  onClose: () => void;
  validationErrors?: Record<string, string[]>;
}

export const ErrorNotification = ({ 
  show, 
  message, 
  onClose,
  validationErrors = {} 
}: ErrorNotificationProps) => {
  const { t } = useTranslation();

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md w-full"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <span className="font-medium">{t(message)}</span>
        </div>
        <button onClick={onClose} className="text-white hover:text-red-100">
          <X size={16} />
        </button>
      </div>

      {Object.keys(validationErrors).length > 0 && (
        <div className="mt-2 text-sm bg-red-600 p-2 rounded">
          <ul className="list-disc pl-4 space-y-1">
            {Object.entries(validationErrors).map(([field, messages]) => (
              <li key={field}>
                <strong>{t(`notifications.error.validation.${field}`, { defaultValue: field })}:</strong> {messages.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

interface LoadingOverlayProps {
  show: boolean;
  message?: string;
}

export const LoadingOverlay = ({ 
  show, 
  message = 'notifications.loading.default_message' 
}: LoadingOverlayProps) => {
  const { t } = useTranslation();

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full mb-4"></div>
        <h3 className="text-lg font-medium text-neutral-800 mb-1">{t(message)}</h3>
        <p className="text-neutral-600 text-sm">{t('notifications.loading.wait_message')}</p>
      </div>
    </motion.div>
  );
};