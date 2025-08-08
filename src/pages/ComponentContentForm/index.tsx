import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store/Store';
import { ApiRepository } from '../../Api/ApiRepository';
import { EndPoints } from '../../Api/EndPoints';
import { 
  setCurrentContent, 
  setPageIndex, 
  setComponentIndex,
  updateContent,
  updateButtonText,
  addButton,
  removeButton,
  setLoading,
  setError
} from '../../Store/StoreSlice/ContentSlice';
import { IComponentContent, IStoreData } from '../../interfaces/StoreInterface';
import { SetComponentContent, SetCurrentStore } from '../../Store/DashBoardSlice/StoresSlice';
import { useTranslation } from 'react-i18next';

// Import components
import Loading from './components/Loading';
import ErrorState from './components/ErrorState';
import PageHeader from './components/PageHeader';
import PageSelector from './components/PageSelector';
import ComponentSelector from './components/ComponentSelector';
import ContentEditor from './components/ContentEditor';

const ComponentContentForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { storeId } = useParams<{ storeId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiRepository = useMemo(() => new ApiRepository(), []);
  
  // Track fields that should be visible regardless of current content
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({});
  const initialLoadRef = useRef(true);

  // Get data from Redux store
  const storeData = useSelector((state: RootState) => 
    state.Dashboard.stores.currentStore as IStoreData | null
  );
  const { 
    currentContent, 
    pageIndex, 
    componentIndex, 
    isLoading, 
    error 
  } = useSelector((state: RootState) => state.content);

  // Update visible fields when content changes
  useEffect(() => {
    if (currentContent && initialLoadRef.current) {
      const fieldsToShow: Record<string, boolean> = {};
      
      // Check each field to see if it has content
      Object.entries(currentContent).forEach(([key, value]) => {
        if (typeof value === 'string' && value.trim() !== '') {
          fieldsToShow[key] = true;
        } else if (Array.isArray(value) && value.length > 0) {
          fieldsToShow[key] = true;
        } else if (value !== null && value !== undefined && typeof value !== 'object') {
          fieldsToShow[key] = true;
        }
      });
      
      setVisibleFields(fieldsToShow);
      initialLoadRef.current = false;
    }
  }, [currentContent]);

  // Reset initialLoadRef when component selection changes
  useEffect(() => {
    initialLoadRef.current = true;
  }, [pageIndex, componentIndex]);

  // Load store data on mount
  useEffect(() => {
    const loadStoreData = async () => {
      if (!storeId) return;
      
      dispatch(setLoading(true));
      try {
        await apiRepository.getAll(
          EndPoints.store(storeId),
          SetCurrentStore
        );
        dispatch(setLoading(false));
      } catch (error) {
        console.error(t('contentMapping.error_loading_store_data'), error);
        dispatch(setError(t('contentMapping.failed_to_load_store_data')));
        dispatch(setLoading(false));
      }
    };

    loadStoreData();
  }, [storeId, dispatch, t, apiRepository]);

  // Handle page selection change
  const handlePageChange = (index: number) => {
    dispatch(setPageIndex(index));
    
    // Reset component index and set first component as current
    dispatch(setComponentIndex(0));
    
    const page = storeData?.templateDatas.pages[index];
    if (page && page.components.length > 0 && page.components[0].componentContents.length > 0) {
      dispatch(setCurrentContent(page.components[0].componentContents[0]));
    }
  };

  // Handle component selection change
  const handleComponentChange = (index: number) => {
    dispatch(setComponentIndex(index));
    
    const component = storeData?.templateDatas.pages[pageIndex]?.components[index];
    if (component && component.componentContents.length > 0) {
      dispatch(setCurrentContent(component.componentContents[0]));
    }
  };

  // Handle field changes
  const handleContentChange = (field: keyof IComponentContent, value: string | number | string[] | null) => {
    dispatch(updateContent({ [field]: value }));
    
    // Update visibleFields to keep this field visible even if it becomes empty
    setVisibleFields(prev => ({
      ...prev,
      [field]: true
    }));
  };

  // Handle button text changes
  const handleButtonTextChange = (index: number, value: string) => {
    dispatch(updateButtonText({ index, text: value }));
    
    // Ensure buttonText remains in visibleFields
    setVisibleFields(prev => ({
      ...prev,
      buttonText: true
    }));
  };

  // Handle adding a new button
  const handleAddButton = () => {
    dispatch(addButton());
    
    // Ensure buttonText remains in visibleFields
    setVisibleFields(prev => ({
      ...prev,
      buttonText: true
    }));
  };

  // Handle removing a button
  const handleRemoveButton = (index: number) => {
    dispatch(removeButton(index));
    
    // Ensure buttonText remains in visibleFields even if all buttons are removed
    setVisibleFields(prev => ({
      ...prev,
      buttonText: true
    }));
  };

  // Save the current component content
  const handleSaveContent = async () => {
    if (!storeData || !currentContent || !storeId) return;
    
    setIsSubmitting(true);
    
    try {
      // Create a deep copy of the pages to avoid mutating the read-only arrays
      const updatedPages = storeData.templateDatas.pages.map(page => ({
        ...page,
        components: page.components.map(component => ({
          ...component,
          componentContents: [...component.componentContents]
        }))
      }));
      
      // Find the component and update its content
      if (updatedPages[pageIndex]?.components[componentIndex]?.componentContents.length > 0) {
        // Create a new copy of the content instead of modifying the original
        updatedPages[pageIndex].components[componentIndex].componentContents[0] = {
          ...updatedPages[pageIndex].components[componentIndex].componentContents[0],
          ...currentContent
        };
      }
      
      // Create an interface for the patch payload
      interface ContentPatchPayload {
        storeId: number;
        title?: string | null;
        subtitle?: string | null;
        paragraph?: string | null;
        subparagraph?: string | null;
        imageUrl?: string | null;
        imageAlt?: string | null;
        link?: string | null;
        linkText?: string | null;
        buttonText?: string[] | null;
        icon?: string | null;
        originalContentId?: number | null;
        rating?: number | null;
        visibleFields?: Record<string, boolean> | null;
      }
      
      // Prepare the patch request body by filtering out null/empty fields
      const contentForPatch: ContentPatchPayload = {
        storeId: parseInt(storeId)
      };
      
      // Only include non-null and non-empty string fields
      if (currentContent.title && currentContent.title.trim() !== '') {
        contentForPatch.title = currentContent.title;
      }
      
      if (currentContent.subtitle && currentContent.subtitle.trim() !== '') {
        contentForPatch.subtitle = currentContent.subtitle;
      }
      
      if (currentContent.paragraph && currentContent.paragraph.trim() !== '') {
        contentForPatch.paragraph = currentContent.paragraph;
      }
      
      if (currentContent.subparagraph && currentContent.subparagraph.trim() !== '') {
        contentForPatch.subparagraph = currentContent.subparagraph;
      }
      
      if (currentContent.imageUrl && currentContent.imageUrl.trim() !== '') {
        contentForPatch.imageUrl = currentContent.imageUrl;
      }
      
      if (currentContent.imageAlt && currentContent.imageAlt.trim() !== '') {
        contentForPatch.imageAlt = currentContent.imageAlt;
      }
      
      if (currentContent.link && currentContent.link.trim() !== '') {
        contentForPatch.link = currentContent.link;
      }
      
      if (currentContent.linkText && currentContent.linkText.trim() !== '') {
        contentForPatch.linkText = currentContent.linkText;
      }
      
      if (currentContent.buttonText && currentContent.buttonText.length > 0) {
        contentForPatch.buttonText = currentContent.buttonText;
      }
      
      if (currentContent.icon && currentContent.icon.trim() !== '') {
        contentForPatch.icon = currentContent.icon;
      }
      
      if (currentContent.rating !== null && currentContent.rating !== undefined) {
        contentForPatch.rating = currentContent.rating;
      }

      contentForPatch.originalContentId = currentContent.id;
      
      // Save visible fields state for persistent field visibility
      contentForPatch.visibleFields = visibleFields;
      
      // Update the content in the API
      await apiRepository.updatewithpatch<ContentPatchPayload>(
        EndPoints.storecustomization(storeId, storeData.templateDatas.id.toString()),
        contentForPatch,
        // After API success, dispatch the proper action with required payload structure
        () => SetComponentContent({
          pageIndex,
          componentIndex,
          componentContents: [{
            ...currentContent,
            ...contentForPatch,
            visibleFields
          }]
        })
      );
      
      // Also update the local state to reflect changes immediately
      dispatch(updateContent({
        ...contentForPatch,
        visibleFields
      }));
      
      toast.success(t('contentMapping.content_saved_success'));
    } catch (error) {
      console.error(t('contentMapping.error_saving_content'), error);
      toast.error(t('contentMapping.error_saving_content_message'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Display loading state
  if (isLoading) {
    return <Loading />;
  }

  // Display error state
  if (error || !storeData) {
    return <ErrorState errorMessage={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <PageHeader templateName={storeData?.templateDatas?.name || ''} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up">
        {/* Page Selector */}
        <PageSelector 
          pages={storeData.templateDatas.pages} 
          selectedIndex={pageIndex} 
          onPageChange={handlePageChange} 
        />

        {/* Component Selector */}
        <ComponentSelector 
          components={storeData.templateDatas.pages[pageIndex]?.components || []} 
          selectedIndex={componentIndex} 
          onComponentChange={handleComponentChange} 
        />

        {/* Component Content Editor */}
        <div className="col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-slide-in-left delay-200">
          <h2 className="text-xl font-semibold mb-5 flex items-center text-gray-800">
            <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            {t('contentMapping.edit_content')}
          </h2>
          
          <ContentEditor 
            content={currentContent}
            visibleFields={visibleFields}
            isSubmitting={isSubmitting}
            onContentChange={handleContentChange}
            onButtonTextChange={handleButtonTextChange}
            onAddButton={handleAddButton}
            onRemoveButton={handleRemoveButton}
            onSaveContent={handleSaveContent}
          />
        </div>
      </div>
    </div>
  );
};

export default ComponentContentForm;