

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Store, 
  ArrowLeft, 
  Phone, 
  Mail, 
  Globe, 
  Type,
  Building,
  Loader,
  Eye,
  ExternalLink,
  X
} from 'lucide-react';
import { ApiRepository } from '../Api/ApiRepository';
import { EndPoints } from '../Api/EndPoints';
import { SetCurrentStore } from '../Store/DashBoardSlice/StoresSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/Store';
import { IStoreData, IComponentContent, BusinessTypeMarchent } from '../interfaces/StoreInterface';
import { useTranslation } from 'react-i18next';

const StoreDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const {storeId} = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [templateExpanded, setTemplateExpanded] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<IComponentContent | null>(null);
  
  // Get the current store from Redux state
  const storeData = useSelector((state: RootState) => 
    state.Dashboard.stores.currentStore as IStoreData | null
  );
  
  // عدل الدالة لتدعم enum الجديد
  const getBusinessTypeName = (type: BusinessTypeMarchent): string => {
    switch(type) {
      case BusinessTypeMarchent.products:
        return t('businessType.ecommerce');
      case BusinessTypeMarchent.services:
        return t('businessType.service');
      default:
        return t('businessType.business');
    }
  };
  console.log(storeData);
  

  const handleComponentClick = (componentContent: IComponentContent) => {
    setSelectedComponent(componentContent);
  };

  const closeComponentPreview = () => {
    setSelectedComponent(null);
  };

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeId) {
        setError(t('storeDetails.store_id_required'));
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const apiRepository = new ApiRepository();
        await apiRepository.getAll(
          EndPoints.store(storeId),
          SetCurrentStore
        );
        setLoading(false);
      } catch (error: unknown) {
        console.error('Error fetching store details:', error);
        setError(t('storeDetails.failed_to_load'));
        setLoading(false);
      }
    };
    
    fetchStoreData();
  }, [storeId, t]); // Added t to dependencies to handle language changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <Loader className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">{t('storeDetails.loading_store_details')}</p>
        </div>
      </div>
    );
  }

  if (error || !storeData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-xl mb-4">{error || t('storeDetails.store_not_found')}</div>
        <button 
          onClick={() => navigate('/stores')}
          className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
        >
          {t('storeDetails.back_to_stores')}
        </button>
      </div>
    );
  }

  // تحديد ما إذا كان المتجر يعرض منتجات أو خدمات
  const renderStoreContent = () => {
    if (!storeData) return null;
    if (storeData.typeStore === BusinessTypeMarchent.services) {
      // عرض الخدمات (placeholder مؤقت)
      return (
        <div className="mt-4 p-4 bg-blue-50 rounded-md text-blue-700">
          {t('storeDetails.services_placeholder', 'هنا سيتم عرض صفحة الخدمات قريبًا')}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/stores')}
        className="flex items-center text-gray-600 hover:text-primary-600 mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        <span>{t('storeDetails.back_to_stores')}</span>
      </button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div 
          className="p-6"
          style={{ backgroundColor: storeData.primaryColor ? `${storeData.primaryColor}20` : '#f3f4f6' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <div 
                className="w-16 h-16 rounded-lg flex items-center justify-center mr-4"
                style={{ backgroundColor: storeData.primaryColor ? `${storeData.primaryColor}40` : '#e5e7eb' }}
              >
                <Store size={32} style={{ color: storeData.primaryColor || '#6b7280' }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{storeData.dominName}</h1>
                <div className="flex items-center mt-1">
                  <Building size={16} className="text-gray-500 mr-2" />
                  <span className="text-gray-600">{getBusinessTypeName(storeData.typeStore)}</span>
                </div>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium self-start sm:self-auto">
              {t('storeDetails.active')}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold mb-4">{t('storeDetails.contact_information')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Phone size={16} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">{t('storeDetails.phone')}</p>
                <p className="text-gray-900">{storeData.phoneContact || t('storeDetails.not_provided')}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail size={16} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">{t('storeDetails.email')}</p>
                <p className="text-gray-900">{storeData.emailContact || t('storeDetails.not_provided')}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Globe size={16} className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">{t('storeDetails.domain')}</p>
                <p className="text-gray-900">{storeData.dominName || t('storeDetails.not_provided')}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* إضافة عرض المنتجات أو الخدمات */}
        {renderStoreContent()}
        
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold mb-4">{t('storeDetails.theme_information')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm text-gray-500 mb-2">{t('storeDetails.colors')}</h3>
              <div className="flex space-x-3">
                <div>
                  <div 
                    className="w-10 h-10 rounded-full mb-1 shadow-sm border border-gray-200"
                    style={{ backgroundColor: storeData.primaryColor }}
                  ></div>
                  <p className="text-xs text-gray-500 text-center">{t('storeDetails.primary')}</p>
                </div>
                <div>
                  <div 
                    className="w-10 h-10 rounded-full mb-1 shadow-sm border border-gray-200"
                    style={{ backgroundColor: storeData.secondaryColor }}
                  ></div>
                  <p className="text-xs text-gray-500 text-center">{t('storeDetails.secondary')}</p>
                </div>
                <div>
                  <div 
                    className="w-10 h-10 rounded-full mb-1 shadow-sm border border-gray-200"
                    style={{ backgroundColor: storeData.accentColor }}
                  ></div>
                  <p className="text-xs text-gray-500 text-center">{t('storeDetails.accent')}</p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center">
                <Type size={16} className="text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">{t('storeDetails.font')}</p>
                  <p className="text-gray-900" style={{ fontFamily: storeData.font }}>{storeData.font}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Template Information */}
        {storeData.templateDatas && (
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{t('storeDetails.template_information')}</h2>
              <button 
                onClick={() => setTemplateExpanded(!templateExpanded)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {templateExpanded ? t('storeDetails.collapse') : t('storeDetails.expand')}
              </button>
            </div>
            
            <div className="mb-2">
              <span className="text-sm text-gray-500 mr-2">{t('storeDetails.template_name')}:</span>
              <span className="font-medium">{storeData.templateDatas.name}</span>
            </div>
            
            {templateExpanded && storeData.templateDatas.pages && storeData.templateDatas.pages.length > 0 && (
              <div className="mt-4">
                <h3 className="text-md font-medium mb-2">{t('storeDetails.pages')}</h3>
                <div className="space-y-4">
                  {storeData.templateDatas.pages.map(page => (
                    <div key={page.id} className="border rounded-md p-3 bg-gray-50">
                      <h4 className="font-medium">{page.name}</h4>
                      {page.components && page.components.length > 0 && (
                        <div className="mt-2">
                          <h5 className="text-sm text-gray-600 mb-1">{t('storeDetails.components')}:</h5>
                          <div className="flex flex-wrap gap-2">
                            {page.components.map(component => (
                              <div key={component.id} className="inline-flex">
                                <span 
                                  className="text-xs bg-white px-2 py-1 rounded-l border-l border-y"
                                >
                                  {component.name}
                                </span>
                                {component.componentContents && component.componentContents.length > 0 && (
                                  <button
                                    onClick={() => handleComponentClick(component.componentContents[0])}
                                    className="text-xs bg-blue-50 px-1 py-1 rounded-r border-r border-y border-l-0 border-blue-200 hover:bg-blue-100"
                                    title={t('storeDetails.preview_content')}
                                  >
                                    <Eye size={12} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Logo section */}
        {storeData.imageLogo && storeData.imageLogo.url && (
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold mb-4">{t('storeDetails.store_logo')}</h2>
            <div className="flex items-center">
              <img 
                src={storeData.imageLogo.url} 
                alt={`${storeData.dominName} ${t('storeDetails.logo')}`} // Updated alt for translation
                className="max-w-[200px] max-h-[100px] object-contain border border-gray-200 rounded-md"
              />
            </div>
          </div>
        )}
        
        {/* Social Media Links */}
        {storeData.socialMediaLinks && storeData.socialMediaLinks.length > 0 && (
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold mb-4">{t('storeDetails.social_media')}</h2>
            <div className="space-y-2">
              {storeData.socialMediaLinks.map((link, index) => (
                <div key={link.id || index} className="flex items-center">
                  <Globe size={16} className="text-gray-500 mr-3" />
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {link.name || t('storeDetails.social_media_default')}: {link.url}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Store Management Actions */}
        <div className="px-6 py-4">
          <h2 className="text-lg font-semibold mb-4">{t('storeDetails.store_management')}</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate(`/store/${storeData.id}/content-mapping`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {t('storeDetails.customize_content')}
            </button>
            
            <button
              onClick={() => window.open(`https://${storeData.dominName}`, '_blank')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-1"
            >
              <span>{t('storeDetails.visit_store')}</span>
              <ExternalLink size={14} />
            </button>
            {/* عرض زر إدارة المنتجات فقط إذا كان المتجر من نوع products */}
            {storeData.typeStore === BusinessTypeMarchent.products && (
              <button
                onClick={() => navigate(`/store/${storeData.id}/products`)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                {t('storeDetails.manage_products')}
              </button>
            )}
            <button
              onClick={() => navigate(`/store/${storeData.id}/dashboard`)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {t('storeDetails.store_dashboard')}
            </button>
          </div>
          {/* عرض الخدمات فقط إذا كان المتجر من نوع services */}
          {renderStoreContent()}
        </div>
      </div>
      
      {/* Component Content Preview Modal */}
      {selectedComponent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-lg font-semibold">{t('storeDetails.component_content_preview')}</h3>
              <button 
                onClick={closeComponentPreview}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {selectedComponent.title && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('storeDetails.title')}:</span>
                    <p className="text-lg font-bold">{selectedComponent.title}</p>
                  </div>
                )}
                
                {selectedComponent.subtitle && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('storeDetails.subtitle')}:</span>
                    <p className="text-md font-medium">{selectedComponent.subtitle}</p>
                  </div>
                )}
                
                {selectedComponent.paragraph && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('storeDetails.paragraph')}:</span>
                    <p className="text-sm">{selectedComponent.paragraph}</p>
                  </div>
                )}
                
                {selectedComponent.imageUrl && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('storeDetails.image')}:</span>
                    <div className="mt-1 border rounded p-2">
                      <img 
                        src={selectedComponent.imageUrl} 
                        alt={selectedComponent.imageAlt || t('storeDetails.component_image')} 
                        className="max-h-40 object-contain mx-auto"
                      />
                      {selectedComponent.imageAlt && (
                        <p className="text-xs text-gray-500 mt-1 text-center">{selectedComponent.imageAlt}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {selectedComponent.link && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('storeDetails.link')}:</span>
                    <p className="text-sm">
                      <a 
                        href={selectedComponent.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {selectedComponent.linkText || selectedComponent.link}
                      </a>
                    </p>
                  </div>
                )}
                
                {selectedComponent.buttonText && selectedComponent.buttonText.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">{t('storeDetails.buttons')}:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedComponent.buttonText.map((text, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-gray-100 rounded text-sm"
                        >
                          {text}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t px-4 py-3 flex justify-end">
              <button
                onClick={() => navigate(`/store/${storeData.id}/content-mapping`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {t('storeDetails.edit_content')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreDetailsPage;
