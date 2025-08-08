

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, 
  ArrowRight, 
  Globe, 
  Mail, 
  Phone,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Link,
  AlertCircle,
  Info,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import PageTransition from '../components/FormsComponents/PageTransition';
import ProgressBar from '../components/FormsComponents/ProgressBar';
import Card from '../components/FormsComponents/Card';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Store/Store';
import { 
  setStoreBasicInfo,
  addSocialMediaLink,
  setTypeStore,
  nextStep
} from '../Store/StoreSlice/CreateStoreSlice';
import { BusinessType } from '../interfaces/TemplateDataInterface';
import { BusinessTypeMarchent } from '../interfaces/StoreInterface';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface FormValues {
  dominName: string;
  businessType: string;
  typeStore: string;
  emailContact: string;
  phoneContact: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
    website: string;
  }
}

const StoreCreation = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { storeData } = useSelector((state: RootState) => state.createStore);
  const { user } = useSelector((state: RootState) => state.Auth);
  
  const [domainAvailability, setDomainAvailability] = useState<'checking' | 'available' | 'unavailable' | null>(null);
  
  const socialMediaInitial = {
    facebook: storeData.socialMediaLinks.find(link => link.platform === 'facebook')?.url || '',
    instagram: storeData.socialMediaLinks.find(link => link.platform === 'instagram')?.url || '',
    twitter: storeData.socialMediaLinks.find(link => link.platform === 'twitter')?.url || '',
    linkedin: storeData.socialMediaLinks.find(link => link.platform === 'linkedin')?.url || '',
    youtube: storeData.socialMediaLinks.find(link => link.platform === 'youtube')?.url || '',
    website: storeData.socialMediaLinks.find(link => link.platform === 'website')?.url || ''
  };

  const initialValues: FormValues = {
    dominName: storeData.dominName || '',
    businessType: storeData.businessType?.toString() || '3',
    emailContact: storeData.emailContact || '',
    phoneContact: storeData.phoneContact || '',
    socialMedia: socialMediaInitial,
    typeStore: storeData.typeStore !== undefined ? storeData.typeStore.toString() : '0'
  };

  const urlRegex = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
  const domainRegex = /^([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](\.[a-zA-Z]{2,})+|[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9])$/;
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;

  const StoreSchema = Yup.object().shape({
    dominName: Yup.string()
      .required('storeCreation.errors.domain_name_required')
      .matches(domainRegex, 'storeCreation.errors.invalid_domain_name')
      .test('domain-availability', 'storeCreation.errors.domain_unavailable', () => {
        return domainAvailability !== 'unavailable';
      }),
    businessType: Yup.string().required('storeCreation.errors.business_type_required'),
    typeStore: Yup.string().required('storeCreation.errors.store_type_required'),
    emailContact: Yup.string()
      .required('storeCreation.errors.email_required')
      .email('storeCreation.errors.invalid_email'),
    phoneContact: Yup.string()
      .matches(phoneRegex, 'storeCreation.errors.invalid_phone')
      .nullable(),
    socialMedia: Yup.object().test(
      'at-least-one-valid',
      'storeCreation.errors.at_least_one_social_media',
      value => Object.values(value || {}).some((url: unknown) => typeof url === 'string' && urlRegex.test(url))
    ).shape({
      facebook: Yup.string().matches(/^$|^https?:\/\//, 'storeCreation.errors.invalid_url'),
      instagram: Yup.string().matches(/^$|^https?:\/\//, 'storeCreation.errors.invalid_url'),
      twitter: Yup.string().matches(/^$|^https?:\/\//, 'storeCreation.errors.invalid_url'),
      linkedin: Yup.string().matches(/^$|^https?:\/\//, 'storeCreation.errors.invalid_url'),
      youtube: Yup.string().matches(/^$|^https?:\/\//, 'storeCreation.errors.invalid_url'),
      website: Yup.string().matches(/^$|^https?:\/\//, 'storeCreation.errors.invalid_url'),
    })
  });

  // Check domain availability
  useEffect(() => {
    const checkDomain = async (domain: string) => {
      if (!domain || !domainRegex.test(domain)) {
        setDomainAvailability(null);
        return;
      }
      
      setDomainAvailability('checking');
      
      // Simulate domain check - replace with actual API call
      setTimeout(() => {
        const isAvailable = Math.random() > 0.3; // 70% chance of being available
        setDomainAvailability(isAvailable ? 'available' : 'unavailable');
      }, 1000);
    };

    const timeoutId = setTimeout(() => {
      const domainName = initialValues.dominName || '';
      checkDomain(domainName);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [initialValues.dominName]);

  // Initialize social media links from Redux state
  useEffect(() => {
    if (storeData.socialMediaLinks.length > 0) {
      const socialMediaData = { ...socialMediaInitial };
      
      storeData.socialMediaLinks.forEach(link => {
        if (link.platform in socialMediaData) {
          socialMediaData[link.platform as keyof typeof socialMediaData] = link.url;
        }
      });
    }
  }, [storeData.socialMediaLinks]);

  const steps = [
    t('storeCreation.steps.store_info'),
    t('storeCreation.steps.templates'),
    t('storeCreation.steps.colors'),
    t('storeCreation.steps.customize')
  ];

  const businessTypes = [
    { value: '0', label: t('businessType.restaurant'), icon: '🍽️' },
    { value: '1', label: t('businessType.cafe'), icon: '☕' },
    { value: '2', label: t('businessType.ecommerce'), icon: '🛒' },
    { value: '3', label: t('businessType.event'), icon: '🎉' },
    { value: '4', label: t('businessType.consulting'), icon: '💼' },
    { value: '5', label: t('businessType.service'), icon: '🔧' },
    { value: '6', label: t('businessType.other'), icon: '📦' }
  ];

  const socialMediaPlatforms = [
    { key: 'facebook', icon: Facebook, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { key: 'instagram', icon: Instagram, color: 'text-pink-600', bgColor: 'bg-pink-50' },
    { key: 'twitter', icon: Twitter, color: 'text-blue-400', bgColor: 'bg-blue-50' },
    { key: 'linkedin', icon: Linkedin, color: 'text-blue-700', bgColor: 'bg-blue-50' },
    { key: 'youtube', icon: Youtube, color: 'text-red-600', bgColor: 'bg-red-50' },
    { key: 'website', icon: Link, color: 'text-neutral-600', bgColor: 'bg-neutral-50' }
  ];

  const handleSubmit = async (values: FormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      dispatch(setStoreBasicInfo({
        dominName: values.dominName,
        emailContact: values.emailContact,
        phoneContact: values.phoneContact,
        businessType: parseInt(values.businessType) as BusinessType,
        ownerId: user?.userId ? parseInt(user.userId) : 0
      }));
      
      const typeStoreValue = parseInt(values.typeStore);
      dispatch(setTypeStore(typeStoreValue === 0 ? BusinessTypeMarchent.products : BusinessTypeMarchent.services));
      
      // Social media
      Object.entries(values.socialMedia).forEach(([platform, url]) => {
        if (urlRegex.test(url)) {
          dispatch(addSocialMediaLink({ platform, url }));
        }
      });
      
      dispatch(nextStep());
      navigate('/templates');
    } catch (error) {
      console.error('Error creating store:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header Section */}
        <motion.div 
          className="flex flex-col items-center mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative bg-gradient-to-br from-primary-100 to-primary-200 p-8 rounded-3xl mb-8 shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-transparent rounded-3xl"></div>
            <Store className="text-primary-600 relative z-10" size={48} />
            <motion.div
              className="absolute -top-2 -right-2 bg-accent-500 text-white p-2 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={16} />
            </motion.div>
          </motion.div>
          
          <h1 className="text-5xl font-extrabold text-neutral-900 mb-4 tracking-tight leading-tight drop-shadow-sm">
            {t('storeCreation.create_your_store')}
          </h1>
          <p className="text-neutral-600 max-w-2xl text-xl leading-relaxed">
            {t('storeCreation.setup_description')}
          </p>
        </motion.div>

        <ProgressBar steps={steps} currentStep={0} />

        <Formik
          initialValues={initialValues}
          validationSchema={StoreSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, values, setFieldValue }) => (
            <Form className="mt-12 space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Basic Information Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card title={t('storeCreation.basic_information')} className="h-full rounded-2xl shadow-lg p-8 border border-neutral-100">
                    <div className="space-y-8">
                      {/* Domain Name */}
                      <div>
                        <label htmlFor="dominName" className="block text-base font-semibold text-neutral-700 mb-3">
                          {t('storeCreation.domain_name')}* 
                          <span className="text-sm text-neutral-500 font-normal ml-2">
                            ({t('storeCreation.your_store_url')})
                          </span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Globe size={20} className="text-neutral-400" />
                          </div>
                          <Field
                            type="text"
                            id="dominName"
                            name="dominName"
                            className={`input pl-12 w-full rounded-xl bg-neutral-50 border-2 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-base py-4 ${
                              errors.dominName && touched.dominName ? 'border-red-400 bg-red-50' : 
                              domainAvailability === 'available' ? 'border-green-400 bg-green-50' :
                              domainAvailability === 'unavailable' ? 'border-red-400 bg-red-50' : ''
                            }`}
                            placeholder={t('storeCreation.domain_placeholder')}
                            dir="ltr"
                          />
                          <AnimatePresence>
                            {domainAvailability === 'checking' && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                              >
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                              </motion.div>
                            )}
                            {domainAvailability === 'available' && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                              >
                                <CheckCircle size={20} className="text-green-500" />
                              </motion.div>
                            )}
                            {domainAvailability === 'unavailable' && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                              >
                                <AlertCircle size={20} className="text-red-500" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <ErrorMessage name="dominName">
                          {(msg: string) => (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 text-sm text-red-500 flex items-center"
                            >
                              <AlertCircle size={16} className="mr-2" /> 
                              {t(msg)}
                            </motion.p>
                          )}
                        </ErrorMessage>
                        <p className="mt-2 text-sm text-neutral-500">
                          {t('storeCreation.domain_description')}
                        </p>
                      </div>

                      {/* Business Type */}
                      <div>
                        <label className="block text-base font-semibold text-neutral-700 mb-3">
                          {t('storeCreation.business_type')}*
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {businessTypes.map((type) => (
                            <motion.button
                              key={type.value}
                              type="button"
                              onClick={() => setFieldValue('businessType', type.value)}
                              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                                values.businessType === type.value
                                  ? 'border-primary-400 bg-primary-50 text-primary-700 shadow-md'
                                  : 'border-neutral-200 bg-white hover:border-primary-200 hover:bg-primary-25'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{type.icon}</span>
                                <span className="font-medium">{type.label}</span>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                        <Field type="hidden" name="businessType" />
                        <ErrorMessage name="businessType">
                          {(msg: string) => (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 text-sm text-red-500 flex items-center"
                            >
                              <AlertCircle size={16} className="mr-2" /> 
                              {t(msg)}
                            </motion.p>
                          )}
                        </ErrorMessage>
                      </div>

                      {/* Store Type */}
                      <div>
                        <label className="block text-base font-semibold text-neutral-700 mb-3">
                          {t('storeCreation.store_type')}*
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { value: '0', label: t('storeCreation.store_types.products'), icon: '📦' },
                            { value: '1', label: t('storeCreation.store_types.services'), icon: '🔧' }
                          ].map((type) => (
                            <motion.button
                              key={type.value}
                              type="button"
                              onClick={() => setFieldValue('typeStore', type.value)}
                              className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                                values.typeStore === type.value
                                  ? 'border-primary-400 bg-primary-50 text-primary-700 shadow-md'
                                  : 'border-neutral-200 bg-white hover:border-primary-200 hover:bg-primary-25'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex flex-col items-center space-y-2">
                                <span className="text-3xl">{type.icon}</span>
                                <span className="font-medium">{type.label}</span>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                        <Field type="hidden" name="typeStore" />
                        <ErrorMessage name="typeStore">
                          {(msg: string) => (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 text-sm text-red-500 flex items-center"
                            >
                              <AlertCircle size={16} className="mr-2" /> 
                              {t(msg)}
                            </motion.p>
                          )}
                        </ErrorMessage>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Contact Information Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card title={t('storeCreation.contact_information')} className="h-full rounded-2xl shadow-lg p-8 border border-neutral-100">
                    <div className="space-y-8">
                      {/* Email */}
                      <div>
                        <label htmlFor="emailContact" className="block text-base font-semibold text-neutral-700 mb-3">
                          {t('storeCreation.business_email')}*
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail size={20} className="text-neutral-400" />
                          </div>
                          <Field
                            type="email"
                            id="emailContact"
                            name="emailContact"
                            className={`input pl-12 w-full rounded-xl bg-neutral-50 border-2 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-base py-4 ${
                              errors.emailContact && touched.emailContact ? 'border-red-400 bg-red-50' : ''
                            }`}
                            placeholder={t('storeCreation.email_placeholder')}
                            dir="ltr"
                          />
                        </div>
                        <ErrorMessage name="emailContact">
                          {(msg: string) => (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 text-sm text-red-500 flex items-center"
                            >
                              <AlertCircle size={16} className="mr-2" /> 
                              {t(msg)}
                            </motion.p>
                          )}
                        </ErrorMessage>
                        <p className="mt-2 text-sm text-neutral-500">
                          {t('storeCreation.email_description')}
                        </p>
                      </div>

                      {/* Phone */}
                      <div>
                        <label htmlFor="phoneContact" className="block text-base font-semibold text-neutral-700 mb-3">
                          {t('storeCreation.phone_number')}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Phone size={20} className="text-neutral-400" />
                          </div>
                          <Field
                            type="tel"
                            id="phoneContact"
                            name="phoneContact"
                            className="input pl-12 w-full rounded-xl bg-neutral-50 border-2 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-base py-4"
                            placeholder={t('storeCreation.phone_placeholder')}
                            dir="ltr"
                          />
                        </div>
                        <ErrorMessage name="phoneContact">
                          {(msg: string) => (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 text-sm text-red-500 flex items-center"
                            >
                              <AlertCircle size={16} className="mr-2" /> 
                              {t(msg)}
                            </motion.p>
                          )}
                        </ErrorMessage>
                        <p className="mt-2 text-sm text-neutral-500">
                          {t('storeCreation.phone_description')}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Social Media Links Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card title={t('storeCreation.social_media_links')} className="rounded-2xl shadow-lg p-8 border border-neutral-100">
                  <div className="mb-6 flex items-start space-x-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <Info size={24} className="text-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-base text-blue-700 font-medium mb-1">
                        {t('storeCreation.social_media_instruction')}
                      </p>
                      <p className="text-sm text-blue-600">
                        {i18n.language === 'ar' 
                          ? 'إضافة روابط وسائل التواصل الاجتماعي ستساعد في زيادة تواجدك الرقمي وجذب المزيد من العملاء'
                          : 'Adding social media links will help increase your digital presence and attract more customers'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <ErrorMessage name="socialMedia">
                    {msg => (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100 flex items-start space-x-3"
                      >
                        <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-base text-red-700">{t(String(msg))}</p>
                      </motion.div>
                    )}
                  </ErrorMessage>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {socialMediaPlatforms.map((platform, index) => (
                      <motion.div 
                        key={platform.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="relative"
                      >
                        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${platform.color}`}>
                          <platform.icon size={20} />
                        </div>
                        <Field
                          type="url"
                          name={`socialMedia.${platform.key}`}
                          className={`input pl-12 w-full rounded-xl bg-neutral-50 border-2 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-200 text-base py-4 ${
                            values.socialMedia[platform.key as keyof typeof values.socialMedia] && 
                            urlRegex.test(values.socialMedia[platform.key as keyof typeof values.socialMedia])
                              ? 'border-green-400 bg-green-50'
                              : ''
                          }`}
                          placeholder={t(`storeCreation.social_media_placeholders.${platform.key}`)}
                          dir="ltr"
                        />
                        <ErrorMessage name={`socialMedia.${platform.key}`}>
                          {(msg: string) => (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 text-sm text-red-500 flex items-center"
                            >
                              <AlertCircle size={16} className="mr-2" /> 
                              {t(msg)}
                            </motion.p>
                          )}
                        </ErrorMessage>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Submit Button */}
              <motion.div 
                className="mt-12 flex justify-end"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  type="submit"
                  className="btn btn-primary flex items-center px-10 py-5 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 gap-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {i18n.language === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      {t('storeCreation.next_step')}
                      <ArrowRight size={20} />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </Form>
          )}
        </Formik>
      </div>
    </PageTransition>
  );
};

export default StoreCreation;