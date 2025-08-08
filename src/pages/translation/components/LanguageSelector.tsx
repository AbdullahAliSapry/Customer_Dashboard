import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  flag: string;
  isSelected: boolean;
}

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage: Language | null;
  onLanguageSelect: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  languages,
  selectedLanguage,
  onLanguageSelect
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => onLanguageSelect(language)}
            className={`relative p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
              selectedLanguage?.code === language.code
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            {selectedLanguage?.code === language.code && (
              <div className="absolute -top-2 -right-2">
                <div className="bg-primary-500 text-white rounded-full p-1">
                  <CheckCircle size={12} />
                </div>
              </div>
            )}
            
            <div className="text-center">
              <div className="text-2xl mb-2">{language.flag}</div>
              <div className="text-sm font-medium text-gray-900">
                {language.name}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {language.code.toUpperCase()}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {selectedLanguage && (
        <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{selectedLanguage.flag}</div>
            <div>
                             <div className="font-medium text-gray-900">
                 {t('translation.select_language')}: {selectedLanguage.name}
               </div>
               <div className="text-sm text-gray-600">
                 {t('translation.subtitle')} {selectedLanguage.name}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector; 