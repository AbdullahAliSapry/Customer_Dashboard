import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Zap, Edit3, ArrowRight, Trash2 } from "lucide-react";
import { StoreLanguage } from "../TranslationPage";



interface LanguageCardProps {
  language: StoreLanguage;
  index: number;
  onRemove: (languageCode: string) => void;
}

const LanguageCard: React.FC<LanguageCardProps> = ({ 
  language, 
  index, 
  onRemove 
}) => {
  const { t } = useTranslation();

  const getTranslationProgress = (language: StoreLanguage) => {
    const total = language.automaticTranslationCount + language.manualTranslationCount;
    return (total / language.totalProducts) * 100;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const progress = getTranslationProgress(language);
  const progressColor = getProgressColor(progress);

  return (
    <div
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
      style={{ animationDelay: `${index * 150}ms` }}
    >
              {/* Language Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{language.flag}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <span>{language.name}</span>
                  {!language.isActive && (
                    <span className="text-primary-500 text-sm">⭐</span>
                  )}
                </h3>
                <p className="text-sm text-gray-500">
                  {language.code.toUpperCase()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {language.isActive ? (
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              ) : (
                <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
              )}
              <button
                onClick={() => onRemove(language.code)}
                className="p-1 text-gray-400 hover:text-red-500 transition-all duration-200 transform hover:scale-110"
                title={t("translation.remove_language")}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          {/* Default Language Badge */}
          {!language.isActive && (
            <div className="px-3 py-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-medium rounded-full inline-block mt-2 animate-pulse">
              ⭐ Default Language
            </div>
          )}
        </div>

        {/* Translation Progress */}
      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {t("translation.progress_label")}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`${progressColor} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Translation Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {language.automaticTranslationCount}
            </div>
            <div className="text-xs text-gray-500">
              {t("translation.automatic_label")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {language.manualTranslationCount}
            </div>
            <div className="text-xs text-gray-500">
              {t("translation.manual_label")}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to={`automatic?lang=${language.code}&langId=${language.id}&langName=${language.name}`}
            className="w-full px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-300 font-medium flex items-center justify-center space-x-2 transform hover:scale-105 hover:shadow-lg"
          >
            <Zap size={16} />
            <span>{t("translation.automatic.title")}</span>
            <ArrowRight size={16} />
          </Link>
          
          <Link
            to={`manual?lang=${language.code}&langId=${language.id}&langName=${language.name}`}
            className="w-full px-4 py-2 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-lg hover:from-secondary-600 hover:to-secondary-700 transition-all duration-300 font-medium flex items-center justify-center space-x-2 transform hover:scale-105 hover:shadow-lg"
          >
            <Edit3 size={16} />
            <span>{t("translation.manual.title")}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Last Updated */}
        <div className="mt-4 text-center">
          <span className="text-xs text-gray-400">
            {t("translation.last_updated")}: {language.lastUpdated}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LanguageCard; 