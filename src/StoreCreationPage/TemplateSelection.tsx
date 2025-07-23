

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout, CheckCircle2, Search, Loader2, ArrowLeft } from 'lucide-react';
import PageTransition from '../components/FormsComponents/PageTransition';
import ProgressBar from '../components/FormsComponents/ProgressBar';
import Card from '../components/FormsComponents/Card';
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
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-primary-50 p-4 rounded-full mb-4"
          >
            <Layout className="text-primary-600" size={32} />
          </motion.div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">{t('templateSelection.choose_your_template')}</h1>
          <p className="text-neutral-600 max-w-lg">
            {t('templateSelection.template_description')}
          </p>
        </div>

        <ProgressBar steps={steps} currentStep={currentStep} />

        <motion.div 
          className="mb-8 flex flex-col md:flex-row gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder={t('templateSelection.search_templates')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          
          <select
            value={filterType !== null ? filterType.toString() : ''}
            onChange={(e) => setFilterType(e.target.value ? parseInt(e.target.value) as BusinessType : null)}
            className="input md:w-1/3"
          >
            <option value="">{t('templateSelection.all_business_types')}</option>
            {Object.values(BusinessType).filter(v => typeof v === 'number').map((type) => (
              <option key={type} value={type}>
                {getBusinessTypeName(type as BusinessType)}
              </option>
            ))}
          </select>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center my-20">
            <Loader2 size={48} className="text-primary-500 animate-spin mb-4" />
            <p className="text-neutral-600">{t('templateSelection.loading_templates')}</p>
          </div>
        ) : (
          <>
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12 bg-neutral-50 rounded-lg border border-neutral-200">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Search size={48} className="text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-800 mb-1">{t('templateSelection.no_templates_found')}</h3>
                  <p className="text-neutral-600">
                    {t('templateSelection.adjust_search')}
                  </p>
                </motion.div>
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  >
                    <div
                      className={`h-full cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                        selectedTemplateId === template.id 
                          ? 'border-primary-500 shadow-lg' 
                          : 'border-transparent hover:border-neutral-200'
                      }`}
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <Card
                        title={
                          <div className="flex justify-between items-center">
                            <span>{template.name}</span>
                            {selectedTemplateId === template.id && (
                              <CheckCircle2 size={18} className="text-primary-500" />
                            )}
                          </div>
                        }
                        className="h-full"
                      >
                        <div className="aspect-video mb-4 overflow-hidden rounded-lg relative group">
                          <img
                            src={`/templates/${template.foldername}/preview.jpg`}
                            alt={template.name}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22640%22%20height%3D%22360%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22640%22%20height%3D%22360%22%20fill%3D%22%23eee%22%2F%3E%3Ctext%20x%3D%22320%22%20y%3D%22180%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2216%22%20text-anchor%3D%22middle%22%20alignment-baseline%3D%22middle%22%20fill%3D%22%23999%22%3ETemplate%20Preview%3C%2Ftext%3E%3C%2Fsvg%3E';
                              e.currentTarget.onerror = null;
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                            <span className="text-white font-medium px-4 py-2 bg-primary-500 rounded-md opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                              {t('templateSelection.select_template')}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center mb-4">
                          <span className="px-2 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded-full">
                            {getBusinessTypeName(template.businesstype)}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-neutral-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2" />
                            {t('templateSelection.features.responsive_design')}
                          </div>
                          <div className="flex items-center text-sm text-neutral-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2" />
                            {t('templateSelection.features.customizable_sections')}
                          </div>
                          <div className="flex items-center text-sm text-neutral-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2" />
                            {t('templateSelection.features.seo_optimized')}
                          </div>
                        </div>
                      </Card>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}

        <motion.div 
          className="mt-8 flex justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={handleGoBack}
            className="btn btn-outline flex items-center px-6 py-3"
          >
            <ArrowLeft size={16} className="mr-2" />
            {t('storeCreation.back_to_store_info')}
          </button>
          
          <button
            onClick={handleContinue}
            disabled={selectedTemplateId === null}
            className={`btn ${selectedTemplateId === null ? 'btn-disabled' : 'btn-primary'} flex items-center px-6 py-3`}
          >
            {t('templateSelection.continue_to_colors')}
            {selectedTemplateId !== null && <CheckCircle2 size={16} className="ml-2" />}
          </button>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default TemplateSelection;
