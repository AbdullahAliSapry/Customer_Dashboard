import { motion } from 'framer-motion';
import { Eye, Monitor, Smartphone, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ThemePreviewProps {
  selectedTheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
  selectedFont: string;
  activePreview: 'light' | 'dark';
  onTogglePreview: (mode: 'light' | 'dark') => void;
  onFontChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  fontOptions: { name: string; value: string }[];
}

const ThemePreview = ({
  selectedTheme,
  selectedFont,
  activePreview,
  onTogglePreview,
  onFontChange,
  fontOptions
}: ThemePreviewProps) => {
  const { t } = useTranslation();

  const getColorContrast = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Font Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-neutral-700">
          {t('theme.chooseFont')}
        </label>
        <select 
          value={selectedFont} 
          onChange={onFontChange} 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          style={{ fontFamily: selectedFont }}
        >
          {fontOptions.map((font) => (
            <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
              {font.name}
            </option>
          ))}
        </select>
      </div>

      {/* Preview Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
          <Eye className="text-primary-500" size={20} />
          {t('storeCreation.preview')}
        </h3>
        <div className="flex border rounded-lg overflow-hidden shadow-sm">
          <button
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activePreview === 'light' 
                ? 'bg-primary-500 text-white shadow-sm' 
                : 'bg-white text-neutral-600 hover:bg-gray-50'
            }`}
            onClick={() => onTogglePreview('light')}
          >
            {t('storeCreation.light_mode')}
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activePreview === 'dark' 
                ? 'bg-primary-500 text-white shadow-sm' 
                : 'bg-white text-neutral-600 hover:bg-gray-50'
            }`}
            onClick={() => onTogglePreview('dark')}
          >
            {t('storeCreation.dark_mode')}
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div
        className={`rounded-xl shadow-lg border transition-all duration-300 overflow-hidden ${
          activePreview === 'light' 
            ? 'bg-white border-gray-200' 
            : 'bg-neutral-800 border-neutral-700'
        }`}
        style={{ fontFamily: selectedFont }}
      >
        {/* Header */}
        <div 
          className="px-4 py-3 flex items-center justify-between"
          style={{ 
            backgroundColor: activePreview === 'light' ? selectedTheme.primary : selectedTheme.secondary,
            color: getColorContrast(activePreview === 'light' ? selectedTheme.primary : selectedTheme.secondary)
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ 
                backgroundColor: activePreview === 'light' ? selectedTheme.secondary : selectedTheme.accent,
                color: getColorContrast(activePreview === 'light' ? selectedTheme.secondary : selectedTheme.accent)
              }}
            >
              A
            </div>
            <span className="font-semibold">{t('theme.store_name')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
            <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
            <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
          </div>
        </div>

        {/* Navigation */}
        <div 
          className="px-4 py-2 flex items-center gap-4 text-sm"
          style={{ 
            backgroundColor: activePreview === 'light' ? selectedTheme.accent : selectedTheme.primary,
            color: getColorContrast(activePreview === 'light' ? selectedTheme.accent : selectedTheme.primary)
          }}
        >
          <span className="font-medium">{t('theme.home')}</span>
          <span className="opacity-70">{t('theme.products')}</span>
          <span className="opacity-70">{t('theme.services')}</span>
          <span className="opacity-70">{t('theme.contact_us')}</span>
        </div>

        {/* Main Content */}
        <div className="p-4 space-y-4">
          {/* Hero Section */}
          <div className="text-center space-y-3">
            <h1 
              className="text-2xl font-bold"
              style={{ 
                color: activePreview === 'light' ? selectedTheme.secondary : selectedTheme.accent
              }}
            >
              {t('theme.welcome_message')}
            </h1>
            <p 
              className="text-sm leading-relaxed"
              style={{ 
                color: activePreview === 'light' ? '#374151' : '#D1D5DB'
              }}
            >
              {t('theme.discover_message')}
            </p>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              className="px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:shadow-md"
              style={{ 
                backgroundColor: selectedTheme.primary,
                color: getColorContrast(selectedTheme.primary)
              }}
            >
              {t('theme.start_now')}
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div 
              className="p-3 rounded-lg text-center"
              style={{ 
                backgroundColor: activePreview === 'light' ? selectedTheme.accent : selectedTheme.secondary,
                color: getColorContrast(activePreview === 'light' ? selectedTheme.accent : selectedTheme.secondary)
              }}
            >
              <div className="text-lg mb-1">🌟</div>
              <div className="text-xs font-medium">{t('theme.featured')}</div>
            </div>
            <div 
              className="p-3 rounded-lg text-center"
              style={{ 
                backgroundColor: activePreview === 'light' ? selectedTheme.accent : selectedTheme.secondary,
                color: getColorContrast(activePreview === 'light' ? selectedTheme.accent : selectedTheme.secondary)
              }}
            >
              <div className="text-lg mb-1">⚡</div>
              <div className="text-xs font-medium">{t('theme.fast')}</div>
            </div>
          </div>

          {/* Footer */}
          <div 
            className="pt-3 border-t text-center text-xs"
            style={{ 
              borderColor: activePreview === 'light' ? '#E5E7EB' : '#374151',
              color: activePreview === 'light' ? '#6B7280' : '#9CA3AF'
            }}
          >
            {t('theme.copyright')}
          </div>
        </div>
      </div>

      {/* Device Preview Tabs */}
      <div className="flex items-center justify-center gap-2">
        <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
          <Monitor size={16} className="text-gray-600" />
        </button>
        <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
          <Smartphone size={16} className="text-gray-600" />
        </button>
        <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
          <Globe size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Color Info */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">{t('theme.selected_colors')}</h4>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <div 
              className="w-4 h-4 rounded border border-gray-200"
              style={{ backgroundColor: selectedTheme.primary }}
            ></div>
            <span className="text-xs text-gray-500">{t('theme.primary')}</span>
          </div>
          <div className="flex items-center gap-1">
            <div 
              className="w-4 h-4 rounded border border-gray-200"
              style={{ backgroundColor: selectedTheme.secondary }}
            ></div>
            <span className="text-xs text-gray-500">{t('theme.secondary')}</span>
          </div>
          <div className="flex items-center gap-1">
            <div 
              className="w-4 h-4 rounded border border-gray-200"
              style={{ backgroundColor: selectedTheme.accent }}
            ></div>
            <span className="text-xs text-gray-500">{t('theme.accent')}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ThemePreview; 