import React from 'react';
import { useTranslation } from 'react-i18next';

interface Page {
  id: number;
  name: string;
}

interface PageSelectorProps {
  pages: Page[];
  selectedIndex: number;
  onPageChange: (index: number) => void;
}

const PageSelector: React.FC<PageSelectorProps> = ({ pages, selectedIndex, onPageChange }) => {
  const { t } = useTranslation();
  
  return (
    <div className="col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-slide-in-left">
      <h2 className="text-xl font-semibold mb-5 flex items-center text-gray-800">
        <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path>
        </svg>
        {t('contentMapping.pages')}
      </h2>
      <div className="space-y-2">
        {pages?.map((page, index) => (
          <button
            key={page.id}
            onClick={() => onPageChange(index)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
              selectedIndex === index
                ? "bg-primary-500 text-white shadow-md"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100"
            }`}
          >
            <div className="font-medium">{page.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PageSelector;