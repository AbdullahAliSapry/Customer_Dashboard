

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Palette, ArrowRight, ArrowLeft, Store, Upload, Sparkles, Eye, Shuffle } from 'lucide-react';
import PageTransition from '../components/FormsComponents/PageTransition';
import ProgressBar from '../components/FormsComponents/ProgressBar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Store/Store';
import { setColors, setFont, nextStep, prevStep, setStoreBasicInfo, setLogo } from '../Store/StoreSlice/CreateStoreSlice';
import { EndPoints } from '../Api/EndPoints';
import { BusinessType } from '../interfaces/TemplateDataInterface';
import { ApiRepository } from '../Api/ApiRepository';
import { useTranslation } from 'react-i18next';

// Import components
import ColorPalette from '../components/creation/ColorPalette';
import ThemePreview from '../components/creation/ThemePreview';
import StoreCreationModal from '../components/creation/StoreCreationModal';
import { ErrorNotification, LoadingOverlay } from '../components/creation/Notifications';
import { colorThemes, fontOptions } from '../components/creation/themeData';
import { ICreateStore } from '../interfaces/CreateStoreInterface';

const ColorThemeSelection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { storeData: storeReduxData, currentStep } = useSelector((state: RootState) => state.createStore);
  const ownerid = useSelector((state: RootState) => state.customer.customerData?.id);
  
  const [selectedTheme, setSelectedTheme] = useState({
    primary: storeReduxData.primaryColor || '#3B82F6',
    secondary: storeReduxData.secondaryColor || '#1E40AF',
    accent: storeReduxData.accentColor || '#DBEAFE',
  });
  
  const [selectedFont, setSelectedFont] = useState(storeReduxData.font || 'Inter');
  const [customColors, setCustomColors] = useState({
    primary: storeReduxData.primaryColor || '#3B82F6',
    secondary: storeReduxData.secondaryColor || '#1E40AF',
    accent: storeReduxData.accentColor || '#DBEAFE',
  });
  
  const [isCustom, setIsCustom] = useState(false);
  const [activePreview, setActivePreview] = useState<'light' | 'dark'>('light');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeColorType, setActiveColorType] = useState<'primary' | 'secondary' | 'accent' | null>(null);
  
  const steps = [
    t('storeCreation.steps.store_info'),
    t('storeCreation.steps.templates'),
    t('storeCreation.steps.colors'),
    t('storeCreation.steps.customize'),
  ];
  
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [templateInfo, setTemplateInfo] = useState({ name: '', type: '' });
  
  useEffect(() => {
    if (storeReduxData.templateId) {
      setTemplateInfo({
        name: t('storeCreation.template_name', { id: storeReduxData.templateId }),
        type: getBusinessTypeName(storeReduxData.businessType)
      });
    }
  }, [storeReduxData.templateId, storeReduxData.businessType, t]);

  const getBusinessTypeName = (type: BusinessType) => {
    switch(type) {
      case BusinessType.restaurant: return t('storeCreation.business_types.restaurant');
      case BusinessType.cafe: return t('storeCreation.business_types.cafe');
      case BusinessType.ecommerce: return t('storeCreation.business_types.ecommerce');
      case BusinessType.event: return t('storeCreation.business_types.event');
      case BusinessType.consulting: return t('storeCreation.business_types.consulting');
      case BusinessType.service: return t('storeCreation.business_types.service');
      case BusinessType.other: return t('storeCreation.business_types.other');
      default: return t('storeCreation.business_types.unknown');
    }
  };

  const applyTheme = (theme: typeof colorThemes[0]) => {
    setSelectedTheme({
      primary: theme.primary,
      secondary: theme.secondary,
      accent: theme.accent,
    });
    setCustomColors({
      primary: theme.primary,
      secondary: theme.secondary,
      accent: theme.accent,
    });
    setIsCustom(false);
  };

  const handleColorChange = (type: 'primary' | 'secondary' | 'accent', value: string) => {
    setCustomColors(prev => ({
      ...prev,
      [type]: value,
    }));
    setSelectedTheme(prev => ({
      ...prev,
      [type]: value,
    }));
    setIsCustom(true);
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFont(e.target.value);
  };

  const handleContinue = () => {
    // Validate logo is selected
    if (!logoFile) {
      setValidationErrors({ logo: [t('storeCreation.errors.logo_required')] });
      setErrorMessage(t('storeCreation.errors.logo_required'));
      setShowError(true);
      return;
    }

    saveThemeToRedux();
    dispatch(nextStep());
    navigate('/customize');
  };

  const handleBack = () => {
    dispatch(prevStep());
    navigate('/templates');
  };

  const generateRandomColors = () => {
    const randomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };
    
    const newTheme = {
      primary: randomColor(),
      secondary: randomColor(),
      accent: randomColor(),
    };
    
    setSelectedTheme(newTheme);
    setCustomColors(newTheme);
    setIsCustom(true);
  };

  const handleCreateStore = () => {
    setShowModal(true);
  };
 
  const validateStoreData = () => {
    const errors: Record<string, string[]> = {};
    
    if (!storeReduxData.dominName) {
      errors.dominName = [t('storeCreation.errors.domain_name_required')];
    }
    
    if (!storeReduxData.emailContact) {
      errors.emailContact = [t('storeCreation.errors.email_required')];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(storeReduxData.emailContact)) {
      errors.emailContact = [t('storeCreation.errors.invalid_email')];
    }
    
    if (!storeReduxData.phoneContact) {
      errors.phoneContact = [t('storeCreation.errors.phone_required')];
    } else if (!/^\+?[0-9\s\-()]+$/.test(storeReduxData.phoneContact)) {
      errors.phoneContact = [t('storeCreation.errors.invalid_phone')];
    }
    
    if (!storeReduxData.socialMediaLinks || storeReduxData.socialMediaLinks.length === 0) {
      errors.socialMediaLinks = [t('storeCreation.errors.at_least_one_social_media')];
    }

    if (!logoFile) {
      errors.logo = [t('storeCreation.errors.logo_required')];
    }
    
    return errors;
  };

  const saveThemeToRedux = () => {
    dispatch(setColors({
      primaryColor: selectedTheme.primary,
      secondaryColor: selectedTheme.secondary,
      accentColor: selectedTheme.accent,
    }));
    
    dispatch(setFont(selectedFont));
    
    // Save logo to Redux
    if (logoFile) {
      dispatch(setLogo(logoFile));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
      setValidationErrors(prev => ({ ...prev, logo: [] }));
    }
  };

  const confirmCreateStore = async () => {
    const errors = validateStoreData();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setErrorMessage(t('storeCreation.errors.fix_errors'));
      setShowError(true);
      setShowModal(false);
      return;
    }
    
    setIsCreating(true);
    saveThemeToRedux();
    
    // Create FormData for file upload
    const formData = new FormData();
    
    // Add all store data fields
    formData.append('DominName', storeReduxData.dominName);
    formData.append('PhoneContact', storeReduxData.phoneContact);
    formData.append('EmailContact', storeReduxData.emailContact);
    formData.append('BusinessType', storeReduxData.businessType.toString());
    formData.append('PrimaryColor', selectedTheme.primary);
    formData.append('SecondaryColor', selectedTheme.secondary);
    formData.append('AccentColor', selectedTheme.accent);
    formData.append('Font', selectedFont);
    formData.append('TemplateId', storeReduxData.templateId.toString());
    formData.append('OwnerId', ownerid?.toString() || '');
    
    // Add logo file
    if (logoFile) {
      formData.append('Logo', logoFile);
    }
    
    // Add social media links if any
    if (storeReduxData.socialMediaLinks && storeReduxData.socialMediaLinks.length > 0) {
      storeReduxData.socialMediaLinks.forEach((link, index) => {
        formData.append(`SocialMediaLinks[${index}].Platform`, link.platform);
        formData.append(`SocialMediaLinks[${index}].Url`, link.url);
      });
    }
    
    try {
      const apiRepository = new ApiRepository();
      apiRepository.create(
        EndPoints.createStore,
        formData as Partial<ICreateStore>,
        (payload) => {
          if (payload) {
            return dispatch(setStoreBasicInfo(payload));
          }
          return dispatch(setStoreBasicInfo({} as Partial<ICreateStore>));
        }
      );

    } catch (error) {
      console.error('Error creating store:', error);
      setErrorMessage(t('storeCreation.errors.failed_to_create'));
      setShowError(true);
      setIsCreating(false);
    }
  };

  const getColorContrast = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  return (
    <PageTransition transitionKey="color-theme-selection">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Palette className="text-white" size={32} />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center">
                <Sparkles className="text-white" size={12} />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-3 text-center">
              {t('storeCreation.colors')}
            </h1>
            <p className="text-neutral-600 max-w-2xl text-lg text-center leading-relaxed">
              {t('storeCreation.colors_description')}
            </p>
          </div>

          <div className="mb-10">
            <ProgressBar steps={steps} currentStep={currentStep} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
            {/* Color Palette Section */}
            <div className="xl:col-span-2 space-y-8">
              {/* Predefined Themes */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-3">
                    <Palette className="text-primary-500" size={24} />
                    {t('storeCreation.choose_palette')}
                  </h2>
                  <button
                    onClick={generateRandomColors}
                    className="btn btn-outline btn-sm flex items-center gap-2 hover:bg-primary-50"
                    title={t('storeCreation.generate_random_colors')}
                  >
                    <Shuffle size={16} />
                    {t('storeCreation.random')}
                  </button>
                </div>
                
                <ColorPalette 
                  colorThemes={colorThemes}
                  selectedTheme={selectedTheme}
                  customColors={customColors}
                  isCustom={isCustom}
                  onThemeSelect={applyTheme}
                  onCustomColorChange={handleColorChange}
                  onRandomColors={generateRandomColors}
                />
              </div>

              {/* Custom Colors Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="text-accent-500" size={20} />
                  {t('storeCreation.custom_colors')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(['primary', 'secondary', 'accent'] as const).map((type) => (
                    <div key={type} className="space-y-3">
                      <label className="block text-sm font-medium text-neutral-700 capitalize">
                        {t(`storeCreation.${type}_color`)}
                      </label>
                      <div className="relative">
                        <div
                          className="w-full h-16 rounded-xl border-2 border-gray-200 shadow-sm cursor-pointer transition-all hover:shadow-md hover:scale-105"
                          style={{ background: customColors[type] }}
                          onClick={() => {
                            setActiveColorType(type);
                            setShowColorPicker(true);
                          }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span 
                              className="text-lg font-bold"
                              style={{ color: getColorContrast(customColors[type]) }}
                            >
                              {type.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-500 font-mono">
                            {customColors[type]}
                          </span>
                          <button
                            onClick={() => {
                              setActiveColorType(type);
                              setShowColorPicker(true);
                            }}
                            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                          >
                            {t('storeCreation.change')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logo Upload Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Upload className="text-primary-500" size={20} />
                  {t('storeCreation.store_logo')}
                </h3>
                <div className="flex flex-col items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-outline flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-primary-50 transition-all"
                  >
                    <Upload size={18} />
                    {logoFile ? t('storeCreation.change_logo') : t('storeCreation.upload_logo')}
                  </button>
                  
                  {logoFile && (
                    <div className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <img
                        src={URL.createObjectURL(logoFile)}
                        alt="logo preview"
                        className="w-24 h-24 object-contain rounded-lg border-2 border-gray-200 shadow-sm"
                      />
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700">{logoFile.name}</p>
                        <p className="text-xs text-gray-500">{(logoFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                  )}
                  
                  {validationErrors.logo && (
                    <p className="text-red-500 text-sm text-center bg-red-50 px-3 py-2 rounded-lg">
                      {validationErrors.logo[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Theme Preview Section */}
            <div className="xl:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                    <Eye className="text-primary-500" size={24} />
                    {t('storeCreation.preview')}
                  </h2>
                  <div className="flex border rounded-lg overflow-hidden shadow-sm">
                    <button
                      className={`px-3 py-2 text-xs font-medium transition-all ${
                        activePreview === 'light' 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-white text-neutral-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setActivePreview('light')}
                    >
                      {t('storeCreation.light_mode')}
                    </button>
                    <button
                      className={`px-3 py-2 text-xs font-medium transition-all ${
                        activePreview === 'dark' 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-white text-neutral-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setActivePreview('dark')}
                    >
                      {t('storeCreation.dark_mode')}
                    </button>
                  </div>
                </div>
                
                <ThemePreview 
                  selectedTheme={selectedTheme}
                  selectedFont={selectedFont}
                  activePreview={activePreview}
                  onTogglePreview={setActivePreview}
                  onFontChange={handleFontChange}
                  fontOptions={fontOptions}
                />
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <button
              onClick={handleBack}
              className="btn btn-outline flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              <ArrowLeft size={20} />
              {t('storeCreation.back_to_templates')}
            </button>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleCreateStore}
                className="btn btn-success flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                <Store size={20} />
                {t('storeCreation.create_store')}
              </button>

              <button
                onClick={handleContinue}
                className="btn btn-primary flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                {t('storeCreation.continue_to_customization')}
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Color Picker Modal */}
        {showColorPicker && activeColorType && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">
                {t('storeCreation.choose_color_for')} {t(`storeCreation.${activeColorType}_color`)}
              </h3>
              <input
                type="color"
                value={customColors[activeColorType]}
                onChange={(e) => handleColorChange(activeColorType, e.target.value)}
                className="w-full h-16 rounded-lg border-2 border-gray-200 cursor-pointer"
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowColorPicker(false)}
                  className="btn btn-outline flex-1"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={() => setShowColorPicker(false)}
                  className="btn btn-primary flex-1"
                >
                  {t('common.save')}
                </button>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {showModal && (
            <StoreCreationModal 
              key="store-creation-modal"
              showModal={showModal}
              isCreating={isCreating}
              onClose={() => setShowModal(false)}
              onConfirm={confirmCreateStore}
              selectedTheme={selectedTheme}
              selectedFont={selectedFont}
              templateInfo={templateInfo}
              logoFileName={logoFile?.name}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showError && (
            <ErrorNotification 
              key="error-notification"
              show={showError}
              message={errorMessage}
              onClose={() => setShowError(false)}
              validationErrors={validationErrors}
            />
          )}
          {isCreating && (
            <LoadingOverlay 
              key="loading-overlay"
              show={isCreating} 
            />
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default ColorThemeSelection;