import React from "react";
import { useTranslation } from "react-i18next";

const LoadingSpinner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-center text-primary-600 text-xl font-bold">
          {t("common.loading")}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 