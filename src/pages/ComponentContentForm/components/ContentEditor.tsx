import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { IComponentContent } from '../../../interfaces/StoreInterface';
import FormField from './FormField';
import ButtonEditor from './ButtonEditor';
import EmptyContentState from './EmptyContentState';

interface ContentEditorProps {
  content: IComponentContent | null;
  visibleFields: Record<string, boolean>;
  isSubmitting: boolean;
  onContentChange: (field: keyof IComponentContent, value: string | number | string[] | null) => void;
  onButtonTextChange: (index: number, value: string) => void;
  onAddButton: () => void;
  onRemoveButton: (index: number) => void;
  onSaveContent: () => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ 
  content,
  visibleFields,
  isSubmitting,
  onContentChange,
  onButtonTextChange,
  onAddButton,
  onRemoveButton,
  onSaveContent
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  if (!content) {
    return <EmptyContentState />;
  }

  const handleContentChange = (field: keyof IComponentContent, value: string | number) => {
    // Handle empty string case
    const processedValue = value === '' ? null : value;
    onContentChange(field, processedValue);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSaveContent(); }}>
      <div className="space-y-4">
        {/* Title */}
        {visibleFields.title && (
          <FormField 
            label={t('contentMapping.title')}
            value={content.title}
            onChange={(value) => handleContentChange('title', value as string)}
          />
        )}

        {/* Subtitle */}
        {visibleFields.subtitle && (
          <FormField 
            label={t('contentMapping.subtitle')}
            value={content.subtitle}
            onChange={(value) => handleContentChange('subtitle', value as string)}
          />
        )}

        {/* Paragraph */}
        {visibleFields.paragraph && (
          <FormField 
            label={t('contentMapping.paragraph')}
            value={content.paragraph}
            onChange={(value) => handleContentChange('paragraph', value as string)}
            type="textarea"
            rows={3}
          />
        )}

        {/* Subparagraph */}
        {content.subparagraph !== undefined && visibleFields.subparagraph && (
          <FormField 
            label={t('contentMapping.subparagraph')}
            value={content.subparagraph}
            onChange={(value) => handleContentChange('subparagraph', value as string)}
            type="textarea"
            rows={2}
          />
        )}

        {/* Image URL */}
        {visibleFields.imageUrl && (
          <FormField 
            label={t('contentMapping.image_url')}
            value={content.imageUrl}
            onChange={(value) => handleContentChange('imageUrl', value as string)}
          />
        )}

        {/* Image Alt */}
        {visibleFields.imageAlt && (
          <FormField 
            label={t('contentMapping.image_alt')}
            value={content.imageAlt}
            onChange={(value) => handleContentChange('imageAlt', value as string)}
          />
        )}

        {/* Link */}
        {visibleFields.link && (
          <FormField 
            label={t('contentMapping.link')}
            value={content.link}
            onChange={(value) => handleContentChange('link', value as string)}
          />
        )}

        {/* Link Text */}
        {visibleFields.linkText && (
          <FormField 
            label={t('contentMapping.link_text')}
            value={content.linkText}
            onChange={(value) => handleContentChange('linkText', value as string)}
          />
        )}

        {/* Button Text */}
        {visibleFields.buttonText && (
          <ButtonEditor 
            buttonTexts={content.buttonText || []}
            onButtonTextChange={onButtonTextChange}
            onAddButton={onAddButton}
            onRemoveButton={onRemoveButton}
          />
        )}

        {/* Rating */}
        {content.rating !== undefined && visibleFields.rating && (
          <FormField 
            label={t('contentMapping.rating')}
            value={content.rating}
            onChange={(value) => handleContentChange('rating', value as number)}
            type="number"
            min={0}
            max={5}
            step={0.1}
          />
        )}

        {/* Icon */}
        {content.icon !== undefined && visibleFields.icon && (
          <FormField 
            label={t('contentMapping.icon')}
            value={content.icon}
            onChange={(value) => handleContentChange('icon', value as string)}
          />
        )}
      </div>

      <div className="mt-8 flex justify-end space-x-4 animate-fade-in">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center transform hover:scale-[1.03] active:scale-[0.98]"
          disabled={isSubmitting}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          {t('contentMapping.cancel')}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200 flex items-center shadow-md transform hover:scale-[1.03] active:scale-[0.98]"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('contentMapping.saving')}
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {t('contentMapping.save_content')}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ContentEditor;