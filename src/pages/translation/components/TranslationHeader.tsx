import React from "react";
import { useTranslation } from "react-i18next";
import { Globe, CheckCircle, AlertCircle } from "lucide-react";

interface TranslationHeaderProps {
  isServiceActive: boolean;
}

const TranslationHeader: React.FC<TranslationHeaderProps> = ({ isServiceActive }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg animate-bounce-slow">
            <Globe className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("translation.title")}
            </h1>
            <p className="text-gray-600 mt-1">
              {t("translation.subtitle")}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {!isServiceActive && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="text-yellow-600" size={16} />
              <span className="text-yellow-800 text-sm font-medium">
                {t("translation.additional_service")}
              </span>
            </div>
          )}
          {isServiceActive && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="text-green-600" size={16} />
              <span className="text-green-800 text-sm font-medium">
                {t("translation.active")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranslationHeader; 