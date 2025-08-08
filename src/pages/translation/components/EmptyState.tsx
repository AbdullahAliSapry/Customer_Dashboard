import React from "react";
import { useTranslation } from "react-i18next";

interface EmptyStateProps {
  onAddLanguage: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddLanguage }) => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-12 animate-fade-in">
      <div className="text-6xl mb-4 animate-bounce">🌍</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {t("translation.no_languages")}
      </h3>
      <p className="text-gray-600 mb-6">
        {t("translation.no_languages_description")}
      </p>
      <button
        onClick={onAddLanguage}
        className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300 font-medium transform hover:scale-105 hover:shadow-lg animate-pulse"
      >
        {t("translation.add_first_language")}
      </button>
    </div>
  );
};

export default EmptyState; 