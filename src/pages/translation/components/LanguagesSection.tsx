import React from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import LanguageCard from "./LanguageCard";
import EmptyState from "./EmptyState";
import { StoreLanguage } from "../TranslationPage";



interface LanguagesSectionProps {
  storeLanguages: StoreLanguage[];
  onAddLanguage: () => void;
  onRemoveLanguage: (languageCode: string) => void;
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  storeLanguages,
  onAddLanguage,
  onRemoveLanguage,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header with Add Language Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t("translation.store_languages")}
          </h2>
          <p className="text-gray-600 mt-1">
            {t("translation.store_languages_description")}
          </p>
        </div>
        <button
          onClick={onAddLanguage}
          className="px-4 py-2 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-lg hover:from-secondary-600 hover:to-secondary-700 transition-all duration-300 font-medium flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg animate-pulse"
        >
          <Plus size={16} />
          <span>{t("translation.add_language")}</span>
        </button>
      </div>

      {/* Languages Grid */}
      {storeLanguages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {storeLanguages.map((language, index) => (
            <LanguageCard
              key={language.code}
              language={language}
              index={index}
              onRemove={onRemoveLanguage}
            />
          ))}
        </div>
      ) : (
        <EmptyState onAddLanguage={onAddLanguage} />
      )}
    </div>
  );
};

export default LanguagesSection; 