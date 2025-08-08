import React from 'react';
import { useTranslation } from 'react-i18next';

interface Component {
  id: number;
  name: string;
}

interface ComponentSelectorProps {
  components: Component[];
  selectedIndex: number;
  onComponentChange: (index: number) => void;
}

const ComponentSelector: React.FC<ComponentSelectorProps> = ({ components, selectedIndex, onComponentChange }) => {
  const { t } = useTranslation();
  
  return (
    <div className="col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-slide-in-left delay-100">
      <h2 className="text-xl font-semibold mb-5 flex items-center text-gray-800">
        <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
        </svg>
        {t('contentMapping.components')}
      </h2>
      <div className="space-y-2">
        {components?.map((component, index) => (
          <button
            key={component.id}
            onClick={() => onComponentChange(index)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
              selectedIndex === index
                ? "bg-primary-500 text-white shadow-md"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100"
            }`}
          >
            <div className="font-medium">{component.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ComponentSelector;