// import { motion } from 'framer-motion';
// import { X, Store, Loader, Layout, Palette, FileImage } from 'lucide-react';

// interface StoreCreationModalProps {
//   showModal: boolean;
//   isCreating: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
//   selectedTheme: {
//     primary: string;
//     secondary: string;
//     accent: string;
//   };
//   selectedFont: string;
//   templateInfo: {
//     name: string;
//     type: string;
//   };
//   logoFileName?: string;
// }

// const StoreCreationModal = ({
//   showModal,
//   isCreating,
//   onClose,
//   onConfirm,
//   selectedTheme,
//   selectedFont,
//   templateInfo,
//   logoFileName
// }: StoreCreationModalProps) => {
//   if (!showModal) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
//     >
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.9, opacity: 0 }}
//         className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-bold text-neutral-900">Create Your Store</h3>
//           <button
//             onClick={onClose}
//             className="text-neutral-500 hover:text-neutral-700"
//             disabled={isCreating}
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="mb-6">
//           <p className="text-neutral-600 mb-4">
//             You're about to create your store with the following configuration:
//           </p>

//           <div className="space-y-4">
//             {/* Template Info */}
//             <div className="bg-neutral-50 p-4 rounded-lg">
//               <div className="flex items-center mb-2">
//                 <Layout size={18} className="text-primary-500 mr-2" />
//                 <span className="font-medium">Template</span>
//               </div>
//               <div className="pl-7">
//                 <p className="text-sm">{templateInfo.name || 'Selected Template'}</p>
//                 <p className="text-xs text-neutral-500">{templateInfo.type || 'Business Type'}</p>
//               </div>
//             </div>

//             {/* Logo Info */}
//             {logoFileName && (
//               <div className="bg-neutral-50 p-4 rounded-lg">
//                 <div className="flex items-center mb-2">
//                   <FileImage size={18} className="text-primary-500 mr-2" />
//                   <span className="font-medium">Logo</span>
//                 </div>
//                 <div className="pl-7">
//                   <p className="text-sm truncate">{logoFileName}</p>
//                 </div>
//               </div>
//             )}

//             {/* Color Theme */}
//             <div className="bg-neutral-50 p-4 rounded-lg">
//               <div className="flex items-center mb-2">
//                 <Palette size={18} className="text-primary-500 mr-2" />
//                 <span className="font-medium">Color Theme</span>
//               </div>
//               <div className="grid grid-cols-3 gap-2 pl-7">
//                 <div>
//                   <div 
//                     className="w-6 h-6 rounded-full mb-1" 
//                     style={{ backgroundColor: selectedTheme.primary }}
//                   ></div>
//                   <span className="text-xs">Primary</span>
//                 </div>
//                 <div>
//                   <div 
//                     className="w-6 h-6 rounded-full mb-1" 
//                     style={{ backgroundColor: selectedTheme.secondary }}
//                   ></div>
//                   <span className="text-xs">Secondary</span>
//                 </div>
//                 <div>
//                   <div 
//                     className="w-6 h-6 rounded-full mb-1" 
//                     style={{ backgroundColor: selectedTheme.accent }}
//                   ></div>
//                   <span className="text-xs">Accent</span>
//                 </div>
//               </div>
//             </div>

//             {/* Font */}
//             <div className="bg-neutral-50 p-4 rounded-lg">
//               <div className="flex items-center">
//                 <span className="font-medium text-sm mr-2">Font:</span>
//                 <span className="text-sm" style={{ fontFamily: selectedFont }}>
//                   {selectedFont}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end space-x-3">
//           <button 
//             onClick={onClose} 
//             className="btn btn-outline" 
//             disabled={isCreating}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="btn btn-success flex items-center"
//             disabled={isCreating}
//           >
//             {isCreating ? (
//               <>
//                 <Loader size={16} className="mr-2 animate-spin" />
//                 Creating...
//               </>
//             ) : (
//               <>
//                 <Store size={16} className="mr-2" />
//                 Create Store
//               </>
//             )}
//           </button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default StoreCreationModal; 


import { motion } from 'framer-motion';
import { X, Store, Loader, Layout, Palette, FileImage } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StoreCreationModalProps {
  showModal: boolean;
  isCreating: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedTheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  selectedFont: string;
  templateInfo: {
    name: string;
    type: string;
  };
  logoFileName?: string;
}

const StoreCreationModal = ({
  showModal,
  isCreating,
  onClose,
  onConfirm,
  selectedTheme,
  selectedFont,
  templateInfo,
  logoFileName
}: StoreCreationModalProps) => {
  const { t } = useTranslation();

  if (!showModal) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-neutral-900">{t('storeCreationModal.create_store')}</h3>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700"
            disabled={isCreating}
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-neutral-600 mb-4">
            {t('storeCreationModal.configuration_message')}
          </p>

          <div className="space-y-4">
            {/* Template Info */}
            <div className="bg-neutral-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Layout size={18} className="text-primary-500 mr-2" />
                <span className="font-medium">{t('storeCreationModal.template')}</span>
              </div>
              <div className="pl-7">
                <p className="text-sm">{templateInfo.name || t('storeCreationModal.default_template')}</p>
                <p className="text-xs text-neutral-500">{templateInfo.type || t('storeCreationModal.default_business_type')}</p>
              </div>
            </div>

            {/* Logo Info */}
            {logoFileName && (
              <div className="bg-neutral-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FileImage size={18} className="text-primary-500 mr-2" />
                  <span className="font-medium">{t('storeCreationModal.logo')}</span>
                </div>
                <div className="pl-7">
                  <p className="text-sm truncate">{logoFileName}</p>
                </div>
              </div>
            )}

            {/* Color Theme */}
            <div className="bg-neutral-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Palette size={18} className="text-primary-500 mr-2" />
                <span className="font-medium">{t('storeCreationModal.color_theme')}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pl-7">
                <div>
                  <div 
                    className="w-6 h-6 rounded-full mb-1" 
                    style={{ backgroundColor: selectedTheme.primary }}
                  ></div>
                  <span className="text-xs">{t('storeCreationModal.primary')}</span>
                </div>
                <div>
                  <div 
                    className="w-6 h-6 rounded-full mb-1" 
                    style={{ backgroundColor: selectedTheme.secondary }}
                  ></div>
                  <span className="text-xs">{t('storeCreationModal.secondary')}</span>
                </div>
                <div>
                  <div 
                    className="w-6 h-6 rounded-full mb-1" 
                    style={{ backgroundColor: selectedTheme.accent }}
                  ></div>
                  <span className="text-xs">{t('storeCreationModal.accent')}</span>
                </div>
              </div>
            </div>

            {/* Font */}
            <div className="bg-neutral-50 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="font-medium text-sm mr-2">{t('storeCreationModal.font')}:</span>
                <span className="text-sm" style={{ fontFamily: selectedFont }}>
                  {selectedFont}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose} 
            className="btn btn-outline" 
            disabled={isCreating}
          >
            {t('storeCreationModal.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-success flex items-center"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <Loader size={16} className="mr-2 animate-spin" />
                {t('storeCreationModal.creating')}
              </>
            ) : (
              <>
                <Store size={16} className="mr-2" />
                {t('storeCreationModal.create_store_button')}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StoreCreationModal;