

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Palette, ArrowRight, ArrowLeft, Store, Upload } from 'lucide-react';
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
    primary: storeReduxData.primaryColor,
    secondary: storeReduxData.secondaryColor,
    accent: storeReduxData.accentColor,
  });
  
  const [selectedFont, setSelectedFont] = useState(storeReduxData.font);
  const [customColors, setCustomColors] = useState({
    primary: storeReduxData.primaryColor,
    secondary: storeReduxData.secondaryColor,
    accent: storeReduxData.accentColor,
  });
  
  const [isCustom, setIsCustom] = useState(false);
  const [activePreview, setActivePreview] = useState<'light' | 'dark'>('light');
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

  return (
    <PageTransition transitionKey="color-theme-selection">
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header Section */}
          <div className="flex flex-col items-center mb-8">
            <Palette className="text-primary-600 mb-3" size={40} />
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              {t('storeCreation.colors')}
            </h1>
            <p className="text-neutral-600 max-w-xl text-base text-center">
              {t('storeCreation.colors_description')}
            </p>
          </div>

          <div className="mb-8">
            <ProgressBar steps={steps} currentStep={currentStep} />
          </div>

          {/* Main Section: ColorPalette & ThemePreview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
            <div className="md:col-span-2 flex flex-col gap-6">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Palette size={18} className="text-primary-500" />
                {t('storeCreation.choose_palette') || 'اختر لوحة الألوان'}
              </h2>
              <ColorPalette 
                colorThemes={colorThemes}
                selectedTheme={selectedTheme}
                customColors={customColors}
                isCustom={isCustom}
                onThemeSelect={applyTheme}
                onCustomColorChange={handleColorChange}
                onRandomColors={generateRandomColors}
              />
              {/* Custom Colors Section */}
              <div className="mt-4">
                <h3 className="text-base font-medium mb-2">{t('storeCreation.custom_colors') || 'الألوان المخصصة'}</h3>
                <div className="flex gap-6">
                  {['primary', 'secondary', 'accent'].map((type) => (
                    <div key={type} className="flex flex-col items-center">
                      <span className="mb-1 text-xs font-medium capitalize">
                        {t(`storeCreation.${type}_color`) || type}
                      </span>
                      <div
                        className="w-14 h-14 rounded-lg border-2 border-gray-200 shadow-sm mb-1"
                        style={{ background: customColors[type as keyof typeof customColors] }}
                      />
                      <span className="text-xs text-gray-500">{customColors[type as keyof typeof customColors]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                {t('storeCreation.preview') || 'معاينة'}
              </h2>
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

          {/* Logo Upload Section */}
          <div className="mb-10 flex flex-col items-center">
            <div className="w-full max-w-md bg-white/70 border border-gray-200 rounded-xl p-6 flex flex-col items-center gap-4 shadow-sm">
              <h3 className="text-base font-medium mb-2 w-full text-center">{t('storeCreation.store_logo')}</h3>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-outline flex items-center"
              >
                <Upload size={16} className="mr-2" />
                {logoFile ? t('storeCreation.change_logo') : t('storeCreation.upload_logo')}
              </button>
              {logoFile && (
                <>
                  <span className="text-sm text-gray-600 mt-1">{logoFile.name} ({(logoFile.size / 1024).toFixed(2)} KB)</span>
                  <img
                    src={URL.createObjectURL(logoFile)}
                    alt="logo preview"
                    className="w-20 h-20 object-contain rounded border mt-2"
                  />
                </>
              )}
              {validationErrors.logo && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.logo[0]}</p>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
            <button
              onClick={handleBack}
              className="btn btn-outline flex items-center px-8 py-3 text-base font-semibold"
            >
              <ArrowLeft size={18} className="mr-2" />
              {t('storeCreation.back_to_templates')}
            </button>

            <div className="flex gap-4">
              <button
                onClick={handleCreateStore}
                className="btn btn-success flex items-center px-8 py-3 text-base font-semibold"
              >
                <Store size={18} className="mr-2" />
                {t('storeCreation.create_store')}
              </button>

              <button
                onClick={handleContinue}
                className="btn btn-primary flex items-center px-8 py-3 text-base font-semibold"
              >
                {t('storeCreation.continue_to_customization')}
                <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </div>
        </div>

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