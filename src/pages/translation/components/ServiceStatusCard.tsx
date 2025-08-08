import React from "react";
import { useTranslation } from "react-i18next";
import { Shield, CheckCircle } from "lucide-react";

interface ServiceStatusCardProps {
  isServiceActive: boolean;
  onActivate: () => void;
}

const ServiceStatusCard: React.FC<ServiceStatusCardProps> = ({ 
  isServiceActive, 
  onActivate 
}) => {
  const { t } = useTranslation();

  if (isServiceActive) return null;

  return (
    <div className="mb-8 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slide-down">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg animate-bounce-slow">
            <Shield className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("translation.activate_service")}
            </h3>
            <p className="text-gray-600 mb-4">
              {t("translation.activate_description")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-green-500" size={16} />
                <span className="text-sm text-gray-700">
                  {t("translation.instant_translation")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-green-500" size={16} />
                <span className="text-sm text-gray-700">
                  {t("translation.support_languages")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-green-500" size={16} />
                <span className="text-sm text-gray-700">
                  {t("translation.high_quality")}
                </span>
              </div>
            </div>
            <button
              onClick={onActivate}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 animate-bounce-slow"
            >
              {t("translation.activate_now")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceStatusCard; 