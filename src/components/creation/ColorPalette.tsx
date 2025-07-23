// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Palette, Check, Sparkles } from 'lucide-react';
// import Card from '../FormsComponents/Card';

// interface ColorTheme {
//   name: string;
//   primary: string;
//   secondary: string;
//   accent: string;
// }

// interface ColorPaletteProps {
//   colorThemes: ColorTheme[];
//   selectedTheme: {
//     primary: string;
//     secondary: string;
//     accent: string;
//   };
//   customColors: {
//     primary: string;
//     secondary: string;
//     accent: string;
//   };
//   isCustom: boolean;
//   onThemeSelect: (theme: ColorTheme) => void;
//   onCustomColorChange: (type: 'primary' | 'secondary' | 'accent', value: string) => void;
//   onRandomColors: () => void;
// }

// const ColorPalette = ({
//   colorThemes,
//   selectedTheme,
//   customColors,
//   isCustom,
//   onThemeSelect,
//   onCustomColorChange,
//   onRandomColors
// }: ColorPaletteProps) => {
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 }
//   };

//   return (
//     <motion.div
//       className="md:col-span-2"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//     >
//       <Card title="Color Themes">
//         <motion.div
//           className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           {colorThemes.map((theme, index) => (
//             <motion.div
//               key={index}
//               variants={itemVariants}
//               className={`cursor-pointer p-4 rounded-lg border-2 transition-all hover:shadow-md ${
//                 !isCustom &&
//                 selectedTheme.primary === theme.primary &&
//                 selectedTheme.secondary === theme.secondary &&
//                 selectedTheme.accent === theme.accent
//                   ? 'border-primary-500 shadow-md'
//                   : 'border-transparent hover:border-neutral-200'
//               }`}
//               onClick={() => onThemeSelect(theme)}
//               whileHover={{ y: -5 }}
//             >
//               <div className="flex justify-between items-center mb-2">
//                 <span className="font-medium">{theme.name}</span>
//                 {!isCustom &&
//                   selectedTheme.primary === theme.primary &&
//                   selectedTheme.secondary === theme.secondary &&
//                   selectedTheme.accent === theme.accent && (
//                     <Check size={16} className="text-primary-500" />
//                 )}
//               </div>
//               <div className="flex space-x-2">
//                 <div
//                   className="w-8 h-8 rounded-full shadow-sm"
//                   style={{ backgroundColor: theme.primary }}
//                   title="Primary Color"
//                 />
//                 <div
//                   className="w-8 h-8 rounded-full shadow-sm"
//                   style={{ backgroundColor: theme.secondary }}
//                   title="Secondary Color"
//                 />
//                 <div
//                   className="w-8 h-8 rounded-full shadow-sm"
//                   style={{ backgroundColor: theme.accent }}
//                   title="Accent Color"
//                 />
//               </div>
//             </motion.div>
//           ))}
//           <motion.div
//             variants={itemVariants}
//             className="cursor-pointer p-4 rounded-lg border-2 border-dashed border-neutral-300 hover:border-primary-300 transition-all flex flex-col items-center justify-center text-center"
//             onClick={onRandomColors}
//             whileHover={{ y: -5 }}
//           >
//             <Sparkles className="text-primary-500 mb-2" size={24} />
//             <span className="font-medium text-sm">Generate Random Colors</span>
//             <span className="text-xs text-neutral-500 mt-1">Feeling lucky?</span>
//           </motion.div>
//         </motion.div>

//         <motion.div
//           className="mt-8"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.4 }}
//         >
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold">Custom Colors</h3>
//             {isCustom && (
//               <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
//                 Custom Theme
//               </span>
//             )}
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-neutral-700 mb-1">Primary Color</label>
//               <div className="flex items-center">
//                 <input
//                   type="color"
//                   value={customColors.primary}
//                   onChange={(e) => onCustomColorChange('primary', e.target.value)}
//                   className="w-10 h-10 rounded-l-md border-0 cursor-pointer"
//                 />
//                 <input
//                   type="text"
//                   value={customColors.primary}
//                   onChange={(e) => onCustomColorChange('primary', e.target.value)}
//                   className="input rounded-l-none flex-1"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-neutral-700 mb-1">Secondary Color</label>
//               <div className="flex items-center">
//                 <input
//                   type="color"
//                   value={customColors.secondary}
//                   onChange={(e) => onCustomColorChange('secondary', e.target.value)}
//                   className="w-10 h-10 rounded-l-md border-0 cursor-pointer"
//                 />
//                 <input
//                   type="text"
//                   value={customColors.secondary}
//                   onChange={(e) => onCustomColorChange('secondary', e.target.value)}
//                   className="input rounded-l-none flex-1"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-neutral-700 mb-1">Accent Color</label>
//               <div className="flex items-center">
//                 <input
//                   type="color"
//                   value={customColors.accent}
//                   onChange={(e) => onCustomColorChange('accent', e.target.value)}
//                   className="w-10 h-10 rounded-l-md border-0 cursor-pointer"
//                 />
//                 <input
//                   type="text"
//                   value={customColors.accent}
//                   onChange={(e) => onCustomColorChange('accent', e.target.value)}
//                   className="input rounded-l-none flex-1"
//                 />
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </Card>
//     </motion.div>
//   );
// };

// export default ColorPalette; 

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Check, Sparkles } from 'lucide-react';
import Card from '../FormsComponents/Card';
import { useTranslation } from 'react-i18next';

interface ColorTheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

interface ColorPaletteProps {
  colorThemes: ColorTheme[];
  selectedTheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  customColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  isCustom: boolean;
  onThemeSelect: (theme: ColorTheme) => void;
  onCustomColorChange: (type: 'primary' | 'secondary' | 'accent', value: string) => void;
  onRandomColors: () => void;
}

const ColorPalette = ({
  colorThemes,
  selectedTheme,
  customColors,
  isCustom,
  onThemeSelect,
  onCustomColorChange,
  onRandomColors
}: ColorPaletteProps) => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="md:col-span-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card title={t('colorPalette.color_themes')}>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {colorThemes.map((theme, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`cursor-pointer p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                !isCustom &&
                selectedTheme.primary === theme.primary &&
                selectedTheme.secondary === theme.secondary &&
                selectedTheme.accent === theme.accent
                  ? 'border-primary-500 shadow-md'
                  : 'border-transparent hover:border-neutral-200'
              }`}
              onClick={() => onThemeSelect(theme)}
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{theme.name}</span>
                {!isCustom &&
                  selectedTheme.primary === theme.primary &&
                  selectedTheme.secondary === theme.secondary &&
                  selectedTheme.accent === theme.accent && (
                    <Check size={16} className="text-primary-500" />
                )}
              </div>
              <div className="flex space-x-2">
                <div
                  className="w-8 h-8 rounded-full shadow-sm"
                  style={{ backgroundColor: theme.primary }}
                  title={t('colorPalette.primary_color')}
                />
                <div
                  className="w-8 h-8 rounded-full shadow-sm"
                  style={{ backgroundColor: theme.secondary }}
                  title={t('colorPalette.secondary_color')}
                />
                <div
                  className="w-8 h-8 rounded-full shadow-sm"
                  style={{ backgroundColor: theme.accent }}
                  title={t('colorPalette.accent_color')}
                />
              </div>
            </motion.div>
          ))}
          <motion.div
            variants={itemVariants}
            className="cursor-pointer p-4 rounded-lg border-2 border-dashed border-neutral-300 hover:border-primary-300 transition-all flex flex-col items-center justify-center text-center"
            onClick={onRandomColors}
            whileHover={{ y: -5 }}
          >
            <Sparkles className="text-primary-500 mb-2" size={24} />
            <span className="font-medium text-sm">{t('colorPalette.generate_random_colors')}</span>
            <span className="text-xs text-neutral-500 mt-1">{t('colorPalette.random_colors_prompt')}</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{t('colorPalette.custom_colors')}</h3>
            {isCustom && (
              <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
                {t('colorPalette.custom_theme')}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">{t('colorPalette.primary_color')}</label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={customColors.primary}
                  onChange={(e) => onCustomColorChange('primary', e.target.value)}
                  className="w-10 h-10 rounded-l-md border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={customColors.primary}
                  onChange={(e) => onCustomColorChange('primary', e.target.value)}
                  className="input rounded-l-none flex-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">{t('colorPalette.secondary_color')}</label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={customColors.secondary}
                  onChange={(e) => onCustomColorChange('secondary', e.target.value)}
                  className="w-10 h-10 rounded-l-md border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={customColors.secondary}
                  onChange={(e) => onCustomColorChange('secondary', e.target.value)}
                  className="input rounded-l-none flex-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">{t('colorPalette.accent_color')}</label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={customColors.accent}
                  onChange={(e) => onCustomColorChange('accent', e.target.value)}
                  className="w-10 h-10 rounded-l-md border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={customColors.accent}
                  onChange={(e) => onCustomColorChange('accent', e.target.value)}
                  className="input rounded-l-none flex-1"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default ColorPalette;