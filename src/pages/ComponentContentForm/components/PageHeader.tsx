import React from 'react';
import { useTranslation } from 'react-i18next';

interface PageHeaderProps {
  templateName: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ templateName }) => {
  const { t } = useTranslation();
  
  return (
    <div className="animate-slide-down">
      <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
        {t('contentMapping.component_content_mapping')}
      </h1>
      <p className="mb-8 text-gray-600 text-lg">
        {t('contentMapping.edit_template_content')}: <span className="font-semibold text-primary-500">{templateName}</span>
      </p>
    </div>
  );
};

export default PageHeader;