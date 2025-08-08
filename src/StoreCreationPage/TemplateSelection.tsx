

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout, CheckCircle2, Search, Loader2, ArrowLeft, Filter, Sparkles } from 'lucide-react';
import PageTransition from '../components/FormsComponents/PageTransition';
import ProgressBar from '../components/FormsComponents/ProgressBar';
import { useEffect, useState } from 'react';
import { EndPoints } from '../Api/EndPoints';
import { ApiRepository } from '../Api/ApiRepository';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../Store/Store';
import { setTemplate, nextStep } from '../Store/StoreSlice/CreateStoreSlice';
import { SetTemplates } from '../Store/DashBoardSlice/TemplatesSlice';
import { ITemplateData, BusinessType } from '../interfaces/TemplateDataInterface';
import { useTranslation } from 'react-i18next';

const TemplateSelection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const steps = [
    t('storeCreation.steps.store_info'),
    t('storeCreation.steps.templates'),
    t('storeCreation.steps.colors'),
    t('storeCreation.steps.customize')
  ];
  const [filteredTemplates, setFilteredTemplates] = useState<ITemplateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<BusinessType | null>(null);
  const { storeData, currentStep } = useSelector((state: RootState) => state.createStore);
  const templates = useSelector((state: RootState) => state.Dashboard.templates.templates);
  
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const apiRepository = new ApiRepository();
        await apiRepository.getAll<ITemplateData>(
          EndPoints.templates,
          SetTemplates
        );
        setLoading(false);
      } catch (error) {
        console.error('Error fetching templates:', error);
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    if (!Array.isArray(templates)) return;
    
    let result = [...templates];
    
    if (searchQuery) {
      result = result.filter(template => 
        template.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterType !== null) {
      result = result.filter(template => template.businesstype === filterType);
    }
    
    setFilteredTemplates(result);
  }, [searchQuery, filterType, templates]);

  const handleTemplateSelect = (templateId: number) => {
    setSelectedTemplateId(templateId);
    dispatch(setTemplate(templateId));
  };

  const handleContinue = () => {
    if (selectedTemplateId !== null) {
      dispatch(nextStep());
      navigate('/colors');
    }
  };

  useEffect(() => {
    if (storeData.templateId > 0) {
      setSelectedTemplateId(storeData.templateId);
    }
  }, [storeData.templateId]);

  const getBusinessTypeName = (type: BusinessType) => {
    switch(type) {
      case BusinessType.restaurant: return t('businessType.restaurant');
      case BusinessType.cafe: return t('businessType.cafe');
      case BusinessType.ecommerce: return t('businessType.ecommerce');
      case BusinessType.event: return t('businessType.event');
      case BusinessType.consulting: return t('businessType.consulting');
      case BusinessType.service: return t('businessType.service');
      case BusinessType.other: return t('businessType.other');
      default: return t('businessType.unknown');
    }
  };

  const handleGoBack = () => {
    navigate("/storeCreation");  
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-6 rounded-2xl mb-6 shadow-lg">
              <Layout className="text-primary-600" size={40} />
            </div>
            <div className="absolute -top-2 -right-2 bg-accent-500 p-2 rounded-full shadow-lg">
              <Sparkles size={16} className="text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            {t('templateSelection.choose_your_template')}
          </h1>
          <p className="text-neutral-600 max-w-2xl text-lg leading-relaxed">
            {t('templateSelection.template_description')}
          </p>
        </div>

        <ProgressBar steps={steps} currentStep={currentStep} />

        {/* Enhanced Search and Filter Section */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search Input */}
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={20} className="text-neutral-400" />
                </div>
                <input
                  type="text"
                  placeholder={t('templateSelection.search_templates')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 bg-neutral-50 focus:bg-white placeholder-neutral-400"
                />
              </div>
              
              {/* Filter Select */}
              <div className="relative lg:w-80">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Filter size={20} className="text-neutral-400" />
                </div>
                <select
                  value={filterType !== null ? filterType.toString() : ''}
                  onChange={(e) => setFilterType(e.target.value ? parseInt(e.target.value) as BusinessType : null)}
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 bg-neutral-50 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="">{t('templateSelection.all_business_types')}</option>
                  {Object.values(BusinessType).filter(v => typeof v === 'number').map((type) => (
                    <option key={type} value={type}>
                      {getBusinessTypeName(type as BusinessType)}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center my-20">
            <div className="relative">
              <Loader2 size={64} className="text-primary-500 animate-spin mb-6" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
            </div>
            <p className="text-neutral-600 text-lg font-medium">{t('templateSelection.loading_templates')}</p>
          </div>
        ) : (
          <>
            {/* No Results State */}
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl border-2 border-dashed border-neutral-200">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="bg-white p-6 rounded-full w-24 h-24 mx-auto mb-6 shadow-lg">
                    <Search size={48} className="text-neutral-400 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-800 mb-3">{t('templateSelection.no_templates_found')}</h3>
                  <p className="text-neutral-600 text-lg max-w-md mx-auto">
                    {t('templateSelection.adjust_search')}
                  </p>
                </motion.div>
              </div>
            ) : (
              /* Enhanced Template Grid */
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                animate="visible"
              >
                {filteredTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -12, transition: { duration: 0.4, ease: "easeOut" } }}
                    className="group"
                  >
                    <div
                      className={`h-full cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 ${
                        selectedTemplateId === template.id 
                          ? 'ring-4 ring-primary-500 ring-offset-4 shadow-2xl transform scale-105' 
                          : 'ring-2 ring-transparent hover:ring-primary-200 hover:shadow-xl'
                      } bg-white`}
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      {/* Template Image */}
                      <div className="aspect-video overflow-hidden relative">
                        <img
                          src={`/templates/${template.foldername}/preview.jpg`}
                          alt={template.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22640%22%20height%3D%22360%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22640%22%20height%3D%22360%22%20fill%3D%22%23f8fafc%22%2F%3E%3Ctext%20x%3D%22320%22%20y%3D%22180%22%20font-family%3D%22Inter%2C%20sans-serif%22%20font-size%3D%2218%22%20text-anchor%3D%22middle%22%20alignment-baseline%3D%22middle%22%20fill%3D%22%236b7280%22%3ETemplate%20Preview%3C%2Ftext%3E%3C%2Fsvg%3E';
                            e.currentTarget.onerror = null;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6">
                          <span className="text-white font-semibold px-6 py-3 bg-primary-500 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                            {t('templateSelection.select_template')}
                          </span>
                        </div>
                        {selectedTemplateId === template.id && (
                          <div className="absolute top-4 right-4 bg-primary-500 p-2 rounded-full shadow-lg">
                            <CheckCircle2 size={20} className="text-white" />
                          </div>
                        )}
                      </div>
                      
                      {/* Template Content */}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                            {template.name}
                          </h3>
                        </div>
                        
                        {/* Business Type Badge */}
                        <div className="mb-6">
                          <span className="inline-flex items-center px-4 py-2 text-sm font-semibold bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 rounded-full border border-primary-200">
                            {getBusinessTypeName(template.businesstype)}
                          </span>
                        </div>
                        
                        {/* Features List */}
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-neutral-600">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 mr-3 flex-shrink-0" />
                            {t('templateSelection.features.responsive_design')}
                          </div>
                          <div className="flex items-center text-sm text-neutral-600">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 mr-3 flex-shrink-0" />
                            {t('templateSelection.features.customizable_sections')}
                          </div>
                          <div className="flex items-center text-sm text-neutral-600">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 mr-3 flex-shrink-0" />
                            {t('templateSelection.features.seo_optimized')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}

        {/* Enhanced Navigation Buttons */}
        <motion.div 
          className="mt-12 flex flex-col sm:flex-row justify-between gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={handleGoBack}
            className="group flex items-center justify-center px-8 py-4 text-lg font-semibold border-2 border-neutral-300 text-neutral-700 rounded-xl hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft size={20} className="mr-3 group-hover:-translate-x-1 transition-transform" />
            {t('storeCreation.back_to_store_info')}
          </button>
          
          <button
            onClick={handleContinue}
            disabled={selectedTemplateId === null}
            className={`group flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${
              selectedTemplateId === null 
                ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 hover:scale-105'
            }`}
          >
            {t('templateSelection.continue_to_colors')}
            {selectedTemplateId !== null && (
              <CheckCircle2 size={20} className="ml-3 group-hover:scale-110 transition-transform" />
            )}
          </button>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default TemplateSelection;
