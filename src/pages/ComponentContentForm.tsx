// import React, { useEffect, useState, useRef } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../Store/Store';
// import { ApiRepository } from '../Api/ApiRepository';
// import { EndPoints } from '../Api/EndPoints';
// import { 
//   setCurrentContent, 
//   setPageIndex, 
//   setComponentIndex,
//   updateContent,
//   updateButtonText,
//   addButton,
//   removeButton,
//   setLoading,
//   setError
// } from '../Store/StoreSlice/ContentSlice';
// import { IComponentContent, IStoreData } from '../interfaces/StoreInterface';
// import { SetComponentContent, SetCurrentStore } from '../Store/DashBoardSlice/StoresSlice';

// const ComponentContentForm: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { storeId } = useParams<{ storeId: string }>();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const apiRepository = new ApiRepository();
  
//   // Track fields that should be visible regardless of current content
//   const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({});
//   const initialLoadRef = useRef(true);

//   // Get data from Redux store
//   const storeData = useSelector((state: RootState) => 
//     state.Dashboard.stores.currentStore as IStoreData | null
//   );
//   const { 
//     currentContent, 
//     pageIndex, 
//     componentIndex, 
//     isLoading, 
//     error 
//   } = useSelector((state: RootState) => state.content);

//   // Update visible fields when content changes
//   useEffect(() => {
//     if (currentContent && initialLoadRef.current) {
//       const fieldsToShow: Record<string, boolean> = {};
      
//       // Check each field to see if it has content
//       Object.entries(currentContent).forEach(([key, value]) => {
//         if (typeof value === 'string' && value.trim() !== '') {
//           fieldsToShow[key] = true;
//         } else if (Array.isArray(value) && value.length > 0) {
//           fieldsToShow[key] = true;
//         } else if (value !== null && value !== undefined && typeof value !== 'object') {
//           fieldsToShow[key] = true;
//         }
//       });
      
//       setVisibleFields(fieldsToShow);
//       initialLoadRef.current = false;
//     }
//   }, [currentContent]);

//   // Reset initialLoadRef when component selection changes
//   useEffect(() => {
//     initialLoadRef.current = true;
//   }, [pageIndex, componentIndex]);

//   // Load store data on mount
//   useEffect(() => {
//     const loadStoreData = async () => {
//       if (!storeId) return;
      
//       dispatch(setLoading(true));
//       try {
//         await apiRepository.getAll(
//           EndPoints.store(storeId),
//           SetCurrentStore
//         );
//         dispatch(setLoading(false));
//       } catch (error) {
//         console.error('Error loading store data:', error);
//         dispatch(setError('Failed to load store data'));
//         dispatch(setLoading(false));
//       }
//     };

//     loadStoreData();
//   }, [storeId, dispatch]);

//   // Handle page selection change
//   const handlePageChange = (index: number) => {
//     dispatch(setPageIndex(index));
    
//     // Reset component index and set first component as current
//     dispatch(setComponentIndex(0));
    
//     const page = storeData?.templateDatas.pages[index];
//     if (page && page.components.length > 0 && page.components[0].componentContents.length > 0) {
//       dispatch(setCurrentContent(page.components[0].componentContents[0]));
//     }
//   };

//   // Handle component selection change
//   const handleComponentChange = (index: number) => {
//     dispatch(setComponentIndex(index));
    
//     const component = storeData?.templateDatas.pages[pageIndex]?.components[index];
//     if (component && component.componentContents.length > 0) {
//       dispatch(setCurrentContent(component.componentContents[0]));
//     }
//   };

//   // Handle field changes
//   const handleContentChange = (field: keyof IComponentContent, value: string | number | string[] | null) => {
//     dispatch(updateContent({ [field]: value }));
    
//     // Update visibleFields to keep this field visible even if it becomes empty
//     setVisibleFields(prev => ({
//       ...prev,
//       [field]: true
//     }));
//   };

//   // Handle button text changes
//   const handleButtonTextChange = (index: number, value: string) => {
//     dispatch(updateButtonText({ index, text: value }));
    
//     // Ensure buttonText remains in visibleFields
//     setVisibleFields(prev => ({
//       ...prev,
//       buttonText: true
//     }));
//   };

//   // Handle adding a new button
//   const handleAddButton = () => {
//     dispatch(addButton());
    
//     // Ensure buttonText remains in visibleFields
//     setVisibleFields(prev => ({
//       ...prev,
//       buttonText: true
//     }));
//   };

//   // Handle removing a button
//   const handleRemoveButton = (index: number) => {
//     dispatch(removeButton(index));
    
//     // Ensure buttonText remains in visibleFields even if all buttons are removed
//     setVisibleFields(prev => ({
//       ...prev,
//       buttonText: true
//     }));
//   };

//   // Save the current component content
//   const handleSaveContent = async () => {
//     if (!storeData || !currentContent || !storeId) return;
    
//     setIsSubmitting(true);
    
//     try {
//       // Create a deep copy of the pages to avoid mutating the read-only arrays
//       const updatedPages = storeData.templateDatas.pages.map(page => ({
//         ...page,
//         components: page.components.map(component => ({
//           ...component,
//           componentContents: [...component.componentContents]
//         }))
//       }));
      
//       // Find the component and update its content
//       if (updatedPages[pageIndex]?.components[componentIndex]?.componentContents.length > 0) {
//         // Create a new copy of the content instead of modifying the original
//         updatedPages[pageIndex].components[componentIndex].componentContents[0] = {
//           ...updatedPages[pageIndex].components[componentIndex].componentContents[0],
//           ...currentContent
//         };
//       }
      
//       // Create an interface for the patch payload
//       interface ContentPatchPayload {
//         storeId: number;
//         title?: string | null;
//         subtitle?: string | null;
//         paragraph?: string | null;
//         subparagraph?: string | null;
//         imageUrl?: string | null;
//         imageAlt?: string | null;
//         link?: string | null;
//         linkText?: string | null;
//         buttonText?: string[] | null;
//         icon?: string | null;
//         originalContentId?: number | null;
//         rating?: number | null;
//         visibleFields?: Record<string, boolean> | null;
//       }
      
//       // Prepare the patch request body by filtering out null/empty fields
//       const contentForPatch: ContentPatchPayload = {
//         storeId: parseInt(storeId)
//       };
      
//       // Only include non-null and non-empty string fields
//       if (currentContent.title && currentContent.title.trim() !== '') {
//         contentForPatch.title = currentContent.title;
//       }
      
//       if (currentContent.subtitle && currentContent.subtitle.trim() !== '') {
//         contentForPatch.subtitle = currentContent.subtitle;
//       }
      
//       if (currentContent.paragraph && currentContent.paragraph.trim() !== '') {
//         contentForPatch.paragraph = currentContent.paragraph;
//       }
      
//       if (currentContent.subparagraph && currentContent.subparagraph.trim() !== '') {
//         contentForPatch.subparagraph = currentContent.subparagraph;
//       }
      
//       if (currentContent.imageUrl && currentContent.imageUrl.trim() !== '') {
//         contentForPatch.imageUrl = currentContent.imageUrl;
//       }
      
//       if (currentContent.imageAlt && currentContent.imageAlt.trim() !== '') {
//         contentForPatch.imageAlt = currentContent.imageAlt;
//       }
      
//       if (currentContent.link && currentContent.link.trim() !== '') {
//         contentForPatch.link = currentContent.link;
//       }
      
//       if (currentContent.linkText && currentContent.linkText.trim() !== '') {
//         contentForPatch.linkText = currentContent.linkText;
//       }
      
//       if (currentContent.buttonText && currentContent.buttonText.length > 0) {
//         contentForPatch.buttonText = currentContent.buttonText;
//       }
      
//       if (currentContent.icon && currentContent.icon.trim() !== '') {
//         contentForPatch.icon = currentContent.icon;
//       }
      
//       if (currentContent.rating !== null && currentContent.rating !== undefined) {
//         contentForPatch.rating = currentContent.rating;
//       }

//       contentForPatch.originalContentId = currentContent.id;
      
//       // Save visible fields state for persistent field visibility
//       contentForPatch.visibleFields = visibleFields;
      
//       // Update the content in the API
//       await apiRepository.updatewithpatch<ContentPatchPayload>(
//         EndPoints.storecustomization(storeId, storeData.templateDatas.id.toString()),
//         contentForPatch,
//         // After API success, dispatch the proper action with required payload structure
//         () => SetComponentContent({
//           pageIndex,
//           componentIndex,
//           componentContents: [{
//             ...currentContent,
//             ...contentForPatch,
//             visibleFields
//           }]
//         })
//       );
      
//       // Also update the local state to reflect changes immediately
//       dispatch(updateContent({
//         ...contentForPatch,
//         visibleFields
//       }));
      
//       toast.success('Component content saved successfully');
//     } catch (error) {
//       console.error('Error saving component content:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Save all changes and navigate back
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
//           <p className="text-lg font-medium">Loading store data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !storeData) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           <p className="font-medium">{error || "Failed to load store data. Please try again."}</p>
//         </div>
//         <button 
//           onClick={() => navigate('/dashboard')} 
//           className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 mt-4"
//         >
//           Return to Dashboard
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Component Content Mapping</h1>
//       <p className="mb-6 text-gray-600">
//         Edit the content for template: <span className="font-semibold">{storeData?.templateDatas?.name}</span>
//       </p>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         {/* Page Selector */}
//         <div className="col-span-1 bg-white p-4 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4">Pages</h2>
//           <div className="space-y-2">
//             {storeData?.templateDatas?.pages?.map((page, index) => (
//               <button
//                 key={page.id}
//                 onClick={() => handlePageChange(index)}
//                 className={`w-full text-left px-4 py-2 rounded-lg ${
//                   pageIndex === index
//                     ? "bg-primary-500 text-white"
//                     : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//               >
//                 {page.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Component Selector */}
//         <div className="col-span-1 bg-white p-4 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4">Components</h2>
//           <div className="space-y-2">
//             {storeData?.templateDatas?.pages[pageIndex]?.components?.map((component, index) => (
//               <button
//                 key={component.id}
//                 onClick={() => handleComponentChange(index)}
//                 className={`w-full text-left px-4 py-2 rounded-lg ${
//                   componentIndex === index
//                     ? "bg-primary-500 text-white"
//                     : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//               >
//                 {component.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Component Content Editor */}
//         <div className="col-span-2 bg-white p-4 rounded-lg shadow">
//           <h2 className="text-xl font-semibold mb-4">Edit Content</h2>
          
//           {currentContent ? (
//             <form onSubmit={(e) => { e.preventDefault(); handleSaveContent(); }}>
//               <div className="space-y-4">
//                 {/* Title */}
//                 {visibleFields.title && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                     <input
//                       type="text"
//                       value={currentContent.title || ''}
//                       onChange={(e) => handleContentChange('title', e.target.value === '' ? null : e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 )}

//                 {/* Subtitle */}
//                 {visibleFields.subtitle && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
//                     <input
//                       type="text"
//                       value={currentContent.subtitle || ''}
//                       onChange={(e) => handleContentChange('subtitle', e.target.value === '' ? null : e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 )}

//                 {/* Paragraph */}
//                 {visibleFields.paragraph && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph</label>
//                     <textarea
//                       value={currentContent.paragraph || ''}
//                       onChange={(e) => handleContentChange('paragraph', e.target.value === '' ? null : e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                       rows={3}
//                     ></textarea>
//                   </div>
//                 )}

//                 {/* Subparagraph (if available) */}
//                 {currentContent.subparagraph !== undefined && visibleFields.subparagraph && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Subparagraph</label>
//                     <textarea
//                       value={currentContent.subparagraph || ''}
//                       onChange={(e) => handleContentChange('subparagraph', e.target.value === '' ? null : e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                       rows={2}
//                     ></textarea>
//                   </div>
//                 )}

//                 {/* Image URL */}
//                 {visibleFields.imageUrl && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
//                     <input
//                       type="text"
//                       value={currentContent.imageUrl || ''}
//                       onChange={(e) => handleContentChange('imageUrl', e.target.value === '' ? null : e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 )}

//                 {/* Image Alt */}
//                 {visibleFields.imageAlt && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Image Alt Text</label>
//                     <input
//                       type="text"
//                       value={currentContent.imageAlt || ''}
//                       onChange={(e) => handleContentChange('imageAlt', e.target.value === '' ? null : e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 )}

//                 {/* Link */}
//                 {visibleFields.link && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
//                     <input
//                       type="text"
//                       value={currentContent.link || ''}
//                       onChange={(e) => handleContentChange('link', e.target.value === '' ? null : e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 )}

//                 {/* Link Text */}
//                 {visibleFields.linkText && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Link Text</label>
//                     <input
//                       type="text"
//                       value={currentContent.linkText || ''}
//                       onChange={(e) => handleContentChange('linkText', e.target.value === '' ? null : e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 )}

//                 {/* Button Text */}
//                 {visibleFields.buttonText && (
//                   <div>
//                     <div className="flex justify-between items-center mb-1">
//                       <label className="block text-sm font-medium text-gray-700">Button Text</label>
//                       <button
//                         type="button"
//                         onClick={handleAddButton}
//                         className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded hover:bg-primary-200"
//                       >
//                         + Add Button
//                       </button>
//                     </div>
//                     {currentContent.buttonText && Array.isArray(currentContent.buttonText) && currentContent.buttonText.length > 0 ? (
//                       <div className="space-y-2">
//                         {currentContent.buttonText.map((text, index) => (
//                           <div key={index} className="flex gap-2">
//                             <input
//                               type="text"
//                               value={text}
//                               onChange={(e) => handleButtonTextChange(index, e.target.value)}
//                               className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                             />
//                             <button
//                               type="button"
//                               onClick={() => handleRemoveButton(index)}
//                               className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
//                             >
//                               ✕
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-sm text-gray-500">No buttons. Click "Add Button" to add one.</p>
//                     )}
//                   </div>
//                 )}

//                 {/* Rating (if available) */}
//                 {currentContent.rating !== undefined && visibleFields.rating && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
//                     <input
//                       type="number"
//                       min="0"
//                       max="5"
//                       step="0.1"
//                       value={currentContent.rating || 0}
//                       onChange={(e) => handleContentChange('rating', e.target.value === '' ? null : parseFloat(e.target.value))}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 )}

//                 {/* Icon (if available) */}
//                 {currentContent.icon !== undefined && visibleFields.icon && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
//                     <input
//                       type="text"
//                       value={currentContent.icon || ''}
//                       onChange={(e) => handleContentChange('icon', e.target.value === '' ? null : e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                     />
//                   </div>
//                 )}
//               </div>

//               <div className="mt-6 flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => navigate('/dashboard')}
//                   className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//                   disabled={isSubmitting}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
//                 >
//                   {isSubmitting ? 'Saving...' : 'Save Content'}
//                 </button>
//               </div>
//             </form>
//           ) : (
//             <p className="text-gray-500">Select a component to edit its content.</p>
//           )}
//         </div>
//       </div>


//     </div>
//   );
// };

// export default ComponentContentForm; 

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Store/Store';
import { ApiRepository } from '../Api/ApiRepository';
import { EndPoints } from '../Api/EndPoints';
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
} from '../Store/StoreSlice/ContentSlice';
import { IComponentContent, IStoreData } from '../interfaces/StoreInterface';
import { SetComponentContent, SetCurrentStore } from '../Store/DashBoardSlice/StoresSlice';
import { useTranslation } from 'react-i18next';

const ComponentContentForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { storeId } = useParams<{ storeId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiRepository = new ApiRepository();
  
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
  }, [storeId, dispatch, t]);

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

  // Save all changes and navigate back
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium">{t('contentMapping.loading_store_data')}</p>
        </div>
      </div>
    );
  }

  if (error || !storeData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-medium">{error || t('contentMapping.failed_to_load_store_data')}</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 mt-4"
        >
          {t('contentMapping.return_to_dashboard')}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('contentMapping.component_content_mapping')}</h1>
      <p className="mb-6 text-gray-600">
        {t('contentMapping.edit_template_content')}: <span className="font-semibold">{storeData?.templateDatas?.name}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Page Selector */}
        <div className="col-span-1 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">{t('contentMapping.pages')}</h2>
          <div className="space-y-2">
            {storeData?.templateDatas?.pages?.map((page, index) => (
              <button
                key={page.id}
                onClick={() => handlePageChange(index)}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  pageIndex === index
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {page.name}
              </button>
            ))}
          </div>
        </div>

        {/* Component Selector */}
        <div className="col-span-1 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">{t('contentMapping.components')}</h2>
          <div className="space-y-2">
            {storeData?.templateDatas?.pages[pageIndex]?.components?.map((component, index) => (
              <button
                key={component.id}
                onClick={() => handleComponentChange(index)}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  componentIndex === index
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {component.name}
              </button>
            ))}
          </div>
        </div>

        {/* Component Content Editor */}
        <div className="col-span-2 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">{t('contentMapping.edit_content')}</h2>
          
          {currentContent ? (
            <form onSubmit={(e) => { e.preventDefault(); handleSaveContent(); }}>
              <div className="space-y-4">
                {/* Title */}
                {visibleFields.title && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('contentMapping.title')}</label>
                    <input
                      type="text"
                      value={currentContent.title || ''}
                      onChange={(e) => handleContentChange('title', e.target.value === '' ? null : e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}

                {/* Subtitle */}
                {visibleFields.subtitle && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('contentMapping.subtitle')}</label>
                    <input
                      type="text"
                      value={currentContent.subtitle || ''}
                      onChange={(e) => handleContentChange('subtitle', e.target.value === '' ? null : e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}

                {/* Paragraph */}
                {visibleFields.paragraph && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('contentMapping.paragraph')}</label>
                    <textarea
                      value={currentContent.paragraph || ''}
                      onChange={(e) => handleContentChange('paragraph', e.target.value === '' ? null : e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={3}
                    ></textarea>
                  </div>
                )}

                {/* Subparagraph (if available) */}
                {currentContent.subparagraph !== undefined && visibleFields.subparagraph && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('contentMapping.subparagraph')}</label>
                    <textarea
                      value={currentContent.subparagraph || ''}
                      onChange={(e) => handleContentChange('subparagraph', e.target.value === '' ? null : e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={2}
                    ></textarea>
                  </div>
                )}

                {/* Image URL */}
                {visibleFields.imageUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('contentMapping.image_url')}</label>
                    <input
                      type="text"
                      value={currentContent.imageUrl || ''}
                      onChange={(e) => handleContentChange('imageUrl', e.target.value === '' ? null : e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}

                {/* Image Alt */}
                {visibleFields.imageAlt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('contentMapping.image_alt')}</label>
                    <input
                      type="text"
                      value={currentContent.imageAlt || ''}
                      onChange={(e) => handleContentChange('imageAlt', e.target.value === '' ? null : e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}

                {/* Link */}
                {visibleFields.link && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('contentMapping.link')}</label>
                    <input
                      type="text"
                      value={currentContent.link || ''}
                      onChange={(e) => handleContentChange('link', e.target.value === '' ? null : e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}

                {/* Link Text */}
                {visibleFields.linkText && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('contentMapping.link_text')}</label>
                    <input
                      type="text"
                      value={currentContent.linkText || ''}
                      onChange={(e) => handleContentChange('linkText', e.target.value === '' ? null : e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}

                {/* Button Text */}
                {visibleFields.buttonText && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">{t('contentMapping.button_text')}</label>
                      <button
                        type="button"
                        onClick={handleAddButton}
                        className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded hover:bg-primary-200"
                      >
                        {t('contentMapping.add_button')}
                      </button>
                    </div>
                    {currentContent.buttonText && Array.isArray(currentContent.buttonText) && currentContent.buttonText.length > 0 ? (
                      <div className="space-y-2">
                        {currentContent.buttonText.map((text, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={text}
                              onChange={(e) => handleButtonTextChange(index, e.target.value)}
                              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveButton(index)}
                              className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                            >
                              {t('contentMapping.remove_button')}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">{t('contentMapping.no_buttons')}</p>
                    )}
                  </div>
                )}

                {/* Rating (if available) */}
                {currentContent.rating !== undefined && visibleFields.rating && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('contentMapping.rating')}</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={currentContent.rating || 0}
                      onChange={(e) => handleContentChange('rating', e.target.value === '' ? null : parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}

                {/* Icon (if available) */}
                {currentContent.icon !== undefined && visibleFields.icon && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('contentMapping.icon')}</label>
                    <input
                      type="text"
                      value={currentContent.icon || ''}
                      onChange={(e) => handleContentChange('icon', e.target.value === '' ? null : e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  {t('contentMapping.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isSubmitting ? t('contentMapping.saving') : t('contentMapping.save_content')}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-500">{t('contentMapping.select_component')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponentContentForm;