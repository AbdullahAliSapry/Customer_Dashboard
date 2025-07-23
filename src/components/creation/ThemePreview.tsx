import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import Card from '../FormsComponents/Card';
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
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card title={t('theme.fontPreview')}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 mb-1">{t('theme.chooseFont')}</label>
          <select value={selectedFont} onChange={onFontChange} className="input w-full">
            {fontOptions.map((font) => (
              <option key={font.value} value={font.value}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Preview</h3>
            <div className="flex border rounded-md overflow-hidden">
              <button
                className={`px-3 py-1 text-xs ${
                  activePreview === 'light' ? 'bg-primary-500 text-white' : 'bg-white text-neutral-600'
                }`}
                onClick={() => onTogglePreview('light')}
              >
                Light
              </button>
              <button
                className={`px-3 py-1 text-xs ${
                  activePreview === 'dark' ? 'bg-primary-500 text-white' : 'bg-white text-neutral-600'
                }`}
                onClick={() => onTogglePreview('dark')}
              >
                Dark
              </button>
            </div>
          </div>

          <div
            className={`p-4 rounded-lg shadow-md transition-all duration-300 ${
              activePreview === 'light' ? 'bg-white' : 'bg-neutral-800'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: selectedTheme.primary,
                  color: activePreview === 'light' ? 'white' : 'black'
                }}
              >
                <span className="font-bold">A</span>
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-neutral-300"></div>
                <div className="w-2 h-2 rounded-full bg-neutral-300"></div>
                <div className="w-2 h-2 rounded-full bg-neutral-300"></div>
              </div>
            </div>

            <div
              className="text-xl font-bold mb-2"
              style={{
                color: activePreview === 'light' ? selectedTheme.secondary : selectedTheme.accent,
                fontFamily: selectedFont
              }}
            >
              Heading Text
            </div>
            <div
              className="mb-4"
              style={{
                color: activePreview === 'light' ? selectedTheme.primary : selectedTheme.primary,
                fontFamily: selectedFont
              }}
            >
              Subheading text
            </div>
            <p
              className="text-sm"
              style={{
                color: activePreview === 'light' ? 'rgb(75, 85, 99)' : 'rgb(209, 213, 219)',
                fontFamily: selectedFont
              }}
            >
              This is how your body text will appear on your website. Good typography makes your content easy to
              read.
            </p>
            <div className="mt-4 flex space-x-2">
              <button
                className="px-4 py-2 rounded-md text-white text-sm"
                style={{ backgroundColor: selectedTheme.primary }}
              >
                Primary Button
              </button>
              <button
                className="px-4 py-2 rounded-md text-white text-sm"
                style={{ backgroundColor: selectedTheme.secondary }}
              >
                Secondary
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center mt-2">
            <Eye size={14} className="text-neutral-400 mr-1" />
            <span className="text-xs text-neutral-500">Preview shows how your colors will look on your site</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ThemePreview; 