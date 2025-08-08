import React from "react";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";
import { LanguageCode } from "../../../interfaces/Languageinterface";

interface AvailableLanguage {
  code: LanguageCode;
  name: string;
  flag: string;
}

interface StoreLanguage {
  code: string;
  name: string;
  flag: string;
  isActive: boolean;
  automaticTranslationCount: number;
  manualTranslationCount: number;
  totalProducts: number;
  lastUpdated: string;
}

interface AddLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguageCode: LanguageCode | null;
  isDefaultLanguage: boolean;
  availableLanguages: AvailableLanguage[];
  storeLanguages: StoreLanguage[];
  onLanguageSelect: (languageCode: LanguageCode) => void;
  onAddLanguage: () => void;
  onCancelAdd: () => void;
  onDefaultLanguageChange: (isDefault: boolean) => void;
  languageDisplayMap: Record<LanguageCode, { name: string; flag: string }>;
}

const AddLanguageModal: React.FC<AddLanguageModalProps> = ({
  isOpen,
  onClose,
  selectedLanguageCode,
  isDefaultLanguage,
  availableLanguages,
  storeLanguages,
  onLanguageSelect,
  onAddLanguage,
  onCancelAdd,
  onDefaultLanguageChange,
  languageDisplayMap,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {t("translation.add_language")}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Trash2 className="text-gray-500" size={20} />
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            {t("translation.add_language_description")}
          </p>
        </div>
        
        <div className="p-6">
          {selectedLanguageCode === null ? (
            // Step 1: Select Language
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("translation.select_language_to_add")}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableLanguages
                  .filter(lang => !storeLanguages.find(storeLang => storeLang.code === LanguageCode[lang.code]))
                  .map((language, index) => (
                    <button
                      key={language.code}
                      onClick={() => onLanguageSelect(language.code)}
                      className="p-4 rounded-lg border-2 border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="text-2xl mb-2">{language.flag}</div>
                      <div className="text-sm font-medium text-gray-900">
                        {language.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {LanguageCode[language.code]}
                      </div>
                    </button>
                  ))}
              </div>
              
              {availableLanguages.filter(lang => !storeLanguages.find(storeLang => storeLang.code === LanguageCode[lang.code])).length === 0 && (
                <div className="text-center py-8 animate-fade-in">
                  <div className="text-4xl mb-4 animate-bounce">🎉</div>
                  <p className="text-gray-500">
                    {t("translation.all_languages_added")}
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Step 2: Configure Language Settings
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">
                  {languageDisplayMap[selectedLanguageCode]?.flag}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {languageDisplayMap[selectedLanguageCode]?.name}
                </h3>
                <p className="text-gray-600">
                  {t("translation.configure_language_settings")}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {t("translation.set_as_default")}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t("translation.default_language_description")}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isDefaultLanguage}
                      onChange={(e) => onDefaultLanguageChange(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={onCancelAdd}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={onAddLanguage}
                  className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                >
                  {t("translation.add_language")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddLanguageModal; 