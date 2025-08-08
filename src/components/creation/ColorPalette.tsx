import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Check, Sparkles, Shuffle } from 'lucide-react';
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

  const getColorContrast = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Predefined Themes Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {colorThemes.map((theme, index) => {
          const isSelected = !isCustom &&
            selectedTheme.primary === theme.primary &&
            selectedTheme.secondary === theme.secondary &&
            selectedTheme.accent === theme.accent;
          
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`group cursor-pointer p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                isSelected
                  ? 'border-primary-500 shadow-lg bg-primary-50/30'
                  : 'border-gray-200 hover:border-primary-300 bg-white'
              }`}
              onClick={() => onThemeSelect(theme)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className={`font-semibold text-sm ${
                  isSelected ? 'text-primary-700' : 'text-gray-800'
                }`}>
                  {theme.name}
                </span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Check size={18} className="text-primary-600" />
                  </motion.div>
                )}
              </div>
              
              <div className="flex gap-2 mb-3">
                <div
                  className="w-10 h-10 rounded-lg shadow-sm border border-white/50 flex items-center justify-center"
                  style={{ backgroundColor: theme.primary }}
                  title={t('colorPalette.primary_color')}
                >
                  <span 
                    className="text-xs font-bold"
                    style={{ color: getColorContrast(theme.primary) }}
                  >
                    P
                  </span>
                </div>
                <div
                  className="w-10 h-10 rounded-lg shadow-sm border border-white/50 flex items-center justify-center"
                  style={{ backgroundColor: theme.secondary }}
                  title={t('colorPalette.secondary_color')}
                >
                  <span 
                    className="text-xs font-bold"
                    style={{ color: getColorContrast(theme.secondary) }}
                  >
                    S
                  </span>
                </div>
                <div
                  className="w-10 h-10 rounded-lg shadow-sm border border-white/50 flex items-center justify-center"
                  style={{ backgroundColor: theme.accent }}
                  title={t('colorPalette.accent_color')}
                >
                  <span 
                    className="text-xs font-bold"
                    style={{ color: getColorContrast(theme.accent) }}
                  >
                    A
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{theme.primary}</span>
                <span>{theme.secondary}</span>
                <span>{theme.accent}</span>
              </div>
            </motion.div>
          );
        })}
        
        {/* Random Colors Card */}
        <motion.div
          variants={itemVariants}
          className="group cursor-pointer p-5 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-400 transition-all duration-300 flex flex-col items-center justify-center text-center bg-gradient-to-br from-gray-50 to-gray-100 hover:from-primary-50 hover:to-primary-100"
          onClick={onRandomColors}
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
            <Shuffle className="text-white" size={20} />
          </div>
          <span className="font-semibold text-sm text-gray-800 mb-1">
            {t('colorPalette.generate_random_colors')}
          </span>
          <span className="text-xs text-gray-500">
            {t('colorPalette.random_colors_prompt')}
          </span>
        </motion.div>
      </motion.div>

      {/* Custom Colors Section */}
      {isCustom && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-accent-50 to-primary-50 rounded-xl p-6 border border-accent-200"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-accent-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">
              {t('colorPalette.custom_theme')}
            </h3>
            <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded-full font-medium">
              {t('colorPalette.custom_color')}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['primary', 'secondary', 'accent'] as const).map((type) => (
              <div key={type} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {t(`colorPalette.${type}_color`)}
                </label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-12 h-12 rounded-lg shadow-sm border-2 border-gray-200 cursor-pointer transition-all hover:shadow-md"
                    style={{ backgroundColor: customColors[type] }}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'color';
                      input.value = customColors[type];
                      input.onchange = (e) => {
                        const target = e.target as HTMLInputElement;
                        onCustomColorChange(type, target.value);
                      };
                      input.click();
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <span 
                        className="text-sm font-bold"
                        style={{ color: getColorContrast(customColors[type]) }}
                      >
                        {type.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={customColors[type]}
                    onChange={(e) => onCustomColorChange(type, e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="#000000"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ColorPalette;