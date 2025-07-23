

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Info
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { storeData } = useSelector((state: RootState) => state.createStore);
  const { user } = useSelector((state: RootState) => state.Auth);
  
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
    typeStore: storeData.typeStore?.toString() || '0' // إضافة قيمة typeStore
  };

  const urlRegex = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;

  const StoreSchema = Yup.object().shape({
    dominName: Yup.string()
      .required('storeCreation.errors.domain_name_required')
      .matches(
        /^([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](\.[a-zA-Z]{2,})+|[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9])$/,
        'storeCreation.errors.invalid_domain_name'
      ),
    businessType: Yup.string().required('storeCreation.errors.business_type_required'),
    typeStore: Yup.string().required('storeCreation.errors.store_type_required'),
    emailContact: Yup.string()
      .required('storeCreation.errors.email_required')
      .email('storeCreation.errors.invalid_email'),
    phoneContact: Yup.string(),
    socialMedia: Yup.object().test(
      'at-least-one-valid',
      'storeCreation.errors.at_least_one_social_media',
      value => Object.values(value || {}).some(url => urlRegex.test(url))
    ).shape({
      facebook: Yup.string().matches(/^$|^https?:\/\//, 'storeCreation.errors.invalid_url'),
      instagram: Yup.string().matches(/^$|^https?:\/\//, 'storeCreation.errors.invalid_url'),
      twitter: Yup.string().matches(/^$|^https?:\/\//, 'storeCreation.errors.invalid_url'),
      linkedin: Yup.string().matches(/^$|^https?:\/\//, 'storeCreation.errors.invalid_url'),
      youtube: Yup.string().matches(/^$|^https?:\/\//, 'storeCreation.errors.invalid_url'),
      website: Yup.string().matches(/^$|^https?:\/\//, 'storeCreation.errors.invalid_url'),
    })
  });

  // Initialize social media links from Redux state
  useEffect(() => {
    if (storeData.socialMediaLinks.length > 0) {
      const socialMediaData = { ...socialMediaInitial };
      
      storeData.socialMediaLinks.forEach(link => {
        if (link.platform in socialMediaData) {
          socialMediaData[link.platform as keyof typeof socialMediaData] = link.url;
        }
      });
      
      // Update initialValues to reflect existing social media links
      // setFormData(prev => ({
      //   ...prev,
      //   socialMedia: socialMediaData
      // }));
    }
  }, [storeData.socialMediaLinks]); // Added dependency

  const steps = [
    t('storeCreation.steps.store_info'),
    t('storeCreation.steps.templates'),
    t('storeCreation.steps.colors'),
    t('storeCreation.steps.customize')
  ];

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col items-center mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-primary-100 p-6 rounded-2xl mb-6 shadow-lg"
          >
            <Store className="text-primary-600" size={40} />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-neutral-900 mb-3 tracking-tight leading-tight drop-shadow-sm">
            {t('storeCreation.create_your_store')}
          </h1>
          <p className="text-neutral-600 max-w-xl text-lg">
            {t('storeCreation.setup_description')}
          </p>
        </div>

        <ProgressBar steps={steps} currentStep={0} />

        <Formik
          initialValues={initialValues}
          validationSchema={StoreSchema}
          enableReinitialize
          onSubmit={(values: FormValues, { setSubmitting }) => {
            dispatch(setStoreBasicInfo({
              dominName: values.dominName,
              emailContact: values.emailContact,
              phoneContact: values.phoneContact,
              businessType: parseInt(values.businessType) as BusinessType,
              ownerId: user?.userid ? parseInt(user.userid) : 0
            }));
            
            // @ts-expect-error - مطلوب مراجعة لاحقاً لإصلاح مشكلة التوافق
            // تعيين نوع المتجر باستخدام الـ reducer الجديد
            if (values.typeStore === "0") {
              dispatch(setTypeStore(BusinessTypeMarchent.Products));
            } else {
              dispatch(setTypeStore(BusinessTypeMarchent.Services));
            }
            
            // Social media
            Object.entries(values.socialMedia).forEach(([platform, url]) => {
              if (urlRegex.test(url)) {
                dispatch(addSocialMediaLink({ platform, url }));
              }
            });
            dispatch(nextStep());
            navigate('/templates');
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="mt-10 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card title={t('storeCreation.basic_information')} className="h-full rounded-2xl shadow-lg p-7">
                    <div className="space-y-8">
                      <div>
                        <label htmlFor="dominName" className="block text-base font-semibold text-neutral-700 mb-2">
                          {t('storeCreation.domain_name')}* <span className="text-xs text-neutral-500">({t('storeCreation.your_store_url')})</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Globe size={20} className="text-neutral-400" />
                          </div>
                          <Field
                            type="text"
                            id="dominName"
                            name="dominName"
                            className={`input pl-11 w-full rounded-xl bg-neutral-50 border-2 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-200 text-base py-3 ${errors.dominName && touched.dominName ? 'border-red-400 bg-red-50' : ''}`}
                            placeholder={t('storeCreation.domain_placeholder')}
                          />
                        </div>
                        <ErrorMessage name="dominName">
                          {msg => <p className="mt-2 text-sm text-red-500 flex items-center"><AlertCircle size={16} className="mr-1" /> {t(String(msg))}</p>}
                        </ErrorMessage>
                        <p className="mt-2 text-xs text-neutral-500">{t('storeCreation.domain_description')}</p>
                      </div>

                      <div>
                        <label htmlFor="businessType" className="block text-base font-semibold text-neutral-700 mb-2">
                          {t('storeCreation.business_type')}*
                        </label>
                        <Field as="select"
                          id="businessType"
                          name="businessType"
                          className="input w-full rounded-xl bg-neutral-50 border-2 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-200 text-base py-3"
                          required
                        >
                          <option value={BusinessType.restaurant}>{t('businessType.restaurant')}</option>
                          <option value={BusinessType.cafe}>{t('businessType.cafe')}</option>
                          <option value={BusinessType.ecommerce}>{t('businessType.ecommerce')}</option>
                          <option value={BusinessType.event}>{t('businessType.event')}</option>
                          <option value={BusinessType.consulting}>{t('businessType.consulting')}</option>
                          <option value={BusinessType.service}>{t('businessType.service')}</option>
                          <option value={BusinessType.other}>{t('businessType.other')}</option>
                        </Field>
                        <ErrorMessage name="businessType">
                          {msg => <p className="mt-2 text-sm text-red-500 flex items-center"><AlertCircle size={16} className="mr-1" /> {t(String(msg))}</p>}
                        </ErrorMessage>
                      </div>

                      <div>
                        <label htmlFor="typeStore" className="block text-base font-semibold text-neutral-700 mb-2">
                          {t('storeCreation.store_type')}*
                        </label>
                        <Field as="select"
                          id="typeStore"
                          name="typeStore"
                          className="input w-full rounded-xl bg-neutral-50 border-2 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-200 text-base py-3"
                          required
                        >
                          <option value={BusinessTypeMarchent.Products}>{t('storeCreation.store_types.products')}</option>
                          <option value={BusinessTypeMarchent.Services}>{t('storeCreation.store_types.services')}</option>
                        </Field>
                        <ErrorMessage name="typeStore">
                          {msg => <p className="mt-2 text-sm text-red-500 flex items-center"><AlertCircle size={16} className="mr-1" /> {t(String(msg))}</p>}
                        </ErrorMessage>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card title={t('storeCreation.contact_information')} className="h-full rounded-2xl shadow-lg p-7">
                    <div className="space-y-8">
                      <div>
                        <label htmlFor="emailContact" className="block text-base font-semibold text-neutral-700 mb-2">
                          {t('storeCreation.business_email')}*
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail size={20} className="text-neutral-400" />
                          </div>
                          <Field
                            type="email"
                            id="emailContact"
                            name="emailContact"
                            className={`input pl-11 w-full rounded-xl bg-neutral-50 border-2 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-200 text-base py-3 ${errors.emailContact && touched.emailContact ? 'border-red-400 bg-red-50' : ''}`}
                            placeholder={t('storeCreation.email_placeholder')}
                          />
                        </div>
                        <ErrorMessage name="emailContact">
                          {msg => <p className="mt-2 text-sm text-red-500 flex items-center"><AlertCircle size={16} className="mr-1" /> {t(String(msg))}</p>}
                        </ErrorMessage>
                        <p className="mt-2 text-xs text-neutral-500">{t('storeCreation.email_description')}</p>
                      </div>

                      <div>
                        <label htmlFor="phoneContact" className="block text-base font-semibold text-neutral-700 mb-2">
                          {t('storeCreation.phone_number')}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone size={20} className="text-neutral-400" />
                          </div>
                          <Field
                            type="tel"
                            id="phoneContact"
                            name="phoneContact"
                            className="input pl-11 w-full rounded-xl bg-neutral-50 border-2 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-200 text-base py-3"
                            placeholder={t('storeCreation.phone_placeholder')}
                          />
                        </div>
                        <ErrorMessage name="phoneContact">
                          {msg => <p className="mt-2 text-sm text-red-500 flex items-center"><AlertCircle size={16} className="mr-1" /> {t(String(msg))}</p>}
                        </ErrorMessage>
                        <p className="mt-2 text-xs text-neutral-500">{t('storeCreation.phone_description')}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card title={t('storeCreation.social_media_links')} className="mt-10 rounded-2xl shadow-lg p-7">
                  <div className="mb-5 flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-base text-blue-700">
                      {t('storeCreation.social_media_instruction')}
                    </p>
                  </div>
                  <ErrorMessage name="socialMedia">
                    {msg => <div className="mb-5 p-4 bg-red-50 rounded-lg border border-red-100 flex items-start space-x-3"><AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" /><p className="text-base text-red-700">{t(String(msg))}</p></div>}
                  </ErrorMessage>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                    {['facebook','instagram','twitter','linkedin','youtube','website'].map(platform => (
                      <div className="relative" key={platform}>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          {platform === 'facebook' && <Facebook size={20} className="text-blue-600" />}
                          {platform === 'instagram' && <Instagram size={20} className="text-pink-600" />}
                          {platform === 'twitter' && <Twitter size={20} className="text-blue-400" />}
                          {platform === 'linkedin' && <Linkedin size={20} className="text-blue-700" />}
                          {platform === 'youtube' && <Youtube size={20} className="text-red-600" />}
                          {platform === 'website' && <Link size={20} className="text-neutral-600" />}
                        </div>
                        <Field
                          type="url"
                          name={`socialMedia.${platform}`}
                          className="input pl-11 w-full rounded-xl bg-neutral-50 border-2 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-200 text-base py-3"
                          placeholder={t(`storeCreation.social_media_placeholders.${platform}`)}
                        />
                        <ErrorMessage name={`socialMedia.${platform}`}>
                          {msg => <p className="mt-2 text-sm text-red-500 flex items-center"><AlertCircle size={16} className="mr-1" /> {t(String(msg))}</p>}
                        </ErrorMessage>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              <motion.div 
                className="mt-12 flex justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  type="submit"
                  className="btn btn-primary flex items-center px-8 py-4 text-lg rounded-xl shadow-md hover:bg-primary-700 transition-all duration-200 gap-2"
                  disabled={isSubmitting}
                >
                  {t('storeCreation.next_step')}
                  <ArrowRight size={20} />
                </button>
              </motion.div>
            </Form>
          )}
        </Formik>
      </div>
    </PageTransition>
  );
};

export default StoreCreation;