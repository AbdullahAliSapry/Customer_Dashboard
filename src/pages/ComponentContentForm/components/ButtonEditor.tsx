import React from 'react';
import { useTranslation } from 'react-i18next';

interface ButtonEditorProps {
  buttonTexts: string[];
  onButtonTextChange: (index: number, value: string) => void;
  onAddButton: () => void;
  onRemoveButton: (index: number) => void;
}

const ButtonEditor: React.FC<ButtonEditorProps> = ({ 
  buttonTexts, 
  onButtonTextChange, 
  onAddButton, 
  onRemoveButton 
}) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm font-medium text-gray-700">{t('contentMapping.button_text')}</label>
        <button
          type="button"
          onClick={onAddButton}
          className="text-sm bg-primary-100 text-primary-700 px-3 py-1.5 rounded-md hover:bg-primary-200 transition-colors duration-200 flex items-center shadow-sm"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          {t('contentMapping.add_button')}
        </button>
      </div>
      {buttonTexts && Array.isArray(buttonTexts) && buttonTexts.length > 0 ? (
        <div className="space-y-2">
          {buttonTexts.map((text, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => onButtonTextChange(index, e.target.value)}
                className="flex-grow px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 hover:border-primary-300"
              />
              <button
                type="button"
                onClick={() => onRemoveButton(index)}
                className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors duration-200 flex items-center justify-center shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">{t('contentMapping.no_buttons')}</p>
      )}
    </div>
  );
};

export default ButtonEditor;