import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage, FormikHelpers, FieldProps, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { User, MapPin, Calendar, FileText, Upload, AlertCircle, Briefcase } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import DatePicker from '../../ui/DatePicker';
import Checkbox from '../../ui/Checkbox';
import FileUpload from '../../ui/FileUpload';
import { ApiRepository } from '../../../Api/ApiRepository';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Store/Store';
import { SetCustomerData } from '../../../Store/DashBoardSlice/CustomerInfoSlice';
import { EndPoints } from '../../../Api/EndPoints';

// Match backend enums
enum Nationality {
    Saudi = 0,
    NonSaudi = 1
}

enum DocumentType {
    CommercialRegistration = 0,
    FreelancerLicense = 1
}

interface Step1FormProps {
  onComplete: (data: FormValues) => void;
  formData?: Partial<FormValues>;
  isStepCompleted?: boolean;
}

interface FormValues {
  location: string;
  nationality: number;
  documentType: number;
  nationalAddress: string;
  isFreelancer: boolean;
  birthDate: string;
  idIssueDate: string;
  idExpiryDate: string;
  imageIdentity: File | null;
  imageNationalAddress: File | null;
  identityImageUrl?: string;
  imageNationalAddressUrl?: string;
  isSubmitting?: boolean;
}

const validationSchema = Yup.object({
  location: Yup.string().required('step1Form.errors.location_required'),
  nationality: Yup.number()
    .required('step1Form.errors.nationality_required')
    .oneOf([Nationality.Saudi, Nationality.NonSaudi], 'step1Form.errors.nationality_invalid'),
  documentType: Yup.number()
    .required('step1Form.errors.documentType_required')
    .oneOf([DocumentType.CommercialRegistration, DocumentType.FreelancerLicense], 'step1Form.errors.documentType_invalid'),
  nationalAddress: Yup.string().required('step1Form.errors.nationalAddress_required'),
  birthDate: Yup.string()
    .required('step1Form.errors.birthDate_required')
    .test('age', 'step1Form.errors.birthDate_age', function(value) {
      if (!value) return false;
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18 && age - 1 <= 100;
      }
      return age >= 18 && age <= 100;
    }),
  idIssueDate: Yup.string().required('step1Form.errors.idIssueDate_required'),
  idExpiryDate: Yup.string()
    .required('step1Form.errors.idExpiryDate_required')
    .test('expiry', 'step1Form.errors.idExpiryDate_expired', function(value) {
      if (!value) return false;
      const expiryDate = new Date(value);
      const today = new Date();
      return expiryDate > today;
    }),
  isFreelancer: Yup.boolean().required('step1Form.errors.isFreelancer_required'),
  imageIdentity: Yup.mixed()
    .test('fileRequired', 'step1Form.errors.imageIdentity_required', function(value) {
      return !!value || !!this.parent.identityImageUrl;
    })
    .test('fileSize', 'step1Form.errors.imageIdentity_size', function(value) {
      if (!value || !(value instanceof File)) return true;
      return value.size <= 5 * 1024 * 1024; // 5MB in bytes
    })
    .test('fileType', 'step1Form.errors.imageIdentity_type', function(value) {
      if (!value || !(value instanceof File)) return true;
      return ['image/jpeg', 'image/png'].includes(value.type);
    }),
  imageNationalAddress: Yup.mixed()
    .when('nationality', {
      is: Nationality.Saudi,
      then: (schema) => schema
        .test('fileRequired', 'step1Form.errors.imageNationalAddress_required', function(value) {
          return !!value || !!this.parent.imageNationalAddressUrl;
        })
        .test('fileSize', 'step1Form.errors.imageNationalAddress_size', function(value) {
          if (!value || !(value instanceof File)) return true;
          return value.size <= 5 * 1024 * 1024;
        })
        .test('fileType', 'step1Form.errors.imageNationalAddress_type', function(value) {
          if (!value || !(value instanceof File)) return true;
          return ['image/jpeg', 'image/png'].includes(value.type);
        }),
      otherwise: (schema) => schema.notRequired()
    })
});

const Step1Form: React.FC<Step1FormProps> = ({ onComplete, formData, isStepCompleted }) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.Auth.user);
  const apiRepository = new ApiRepository();

  // Automatically move to next step if data exists
  useEffect(() => {
    if (isStepCompleted && formData && !formData.isSubmitting) {
      // Add a small delay to prevent immediate re-render
      const timeoutId = setTimeout(() => {
        console.log('Step 1 already completed, automatically moving to next step');
        onComplete(formData as FormValues);
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isStepCompleted, formData, onComplete]);

  // Nationality options with improved styling
  const nationalityOptions = [
    { 
      value: Nationality.Saudi, 
      label: t('step1Form.nationality.saudi'),
      icon: '🇸🇦',
      description: t('step1Form.nationality.saudi_desc', 'Saudi Arabian citizen')
    },
    { 
      value: Nationality.NonSaudi, 
      label: t('step1Form.nationality.nonSaudi'),
      icon: '🌍',
      description: t('step1Form.nationality.nonSaudi_desc', 'Non-Saudi resident')
    },
  ];

  // Document type options with improved styling
  const getDocumentTypeOptions = (isFreelancer: boolean) => {
    const options = [
      { 
        value: DocumentType.CommercialRegistration, 
        label: t('step1Form.documentType.commercial'),
        icon: '🏢',
        description: t('step1Form.documentType.commercial_desc', 'Business registration document'),
        disabled: isFreelancer
      },
      { 
        value: DocumentType.FreelancerLicense, 
        label: t('step1Form.documentType.freelancer'),
        icon: '💼',
        description: t('step1Form.documentType.freelancer_desc', 'Freelancer work permit')
      },
    ];
    
    return isFreelancer ? options.filter(option => option.value === DocumentType.FreelancerLicense) : options;
  };

  const initialValues: FormValues = {
    location: formData?.location || '',
    nationality: typeof formData?.nationality === 'number' ? formData.nationality : Nationality.NonSaudi,
    documentType: typeof formData?.documentType === 'number' ? formData.documentType : DocumentType.CommercialRegistration,
    nationalAddress: formData?.nationalAddress || '',
    isFreelancer: formData?.isFreelancer || false,
    birthDate: formData?.birthDate || '',
    idIssueDate: formData?.idIssueDate || '',
    idExpiryDate: formData?.idExpiryDate || '',
    imageIdentity: formData?.imageIdentity || null,
    imageNationalAddress: formData?.nationality === Nationality.Saudi ? formData?.imageNationalAddress || null : null,
    identityImageUrl: formData?.identityImageUrl || '',
    imageNationalAddressUrl: formData?.nationality === Nationality.Saudi ? formData?.imageNationalAddressUrl || '' : '',
    isSubmitting: formData?.isSubmitting || false
  };

  const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    try {
      // If the step is already completed, skip the API call
      if (isStepCompleted) {
        console.log('Step 1 already completed, skipping API request');
        onComplete(values);
        return;
      }

      if (!user?.userId) {
        console.error('Missing user ID');
        return;
      }

      setSubmitting(true);
      const formdata = new FormData();
      
      // Add all form fields to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'isFreelancer') {
            formdata.append(key, value.toString());
          } else if (value instanceof File) {
            formdata.append(key, value);
          } else {
            formdata.append(key, value);
          }
        }
      });

      // For non-Saudi nationality, explicitly set imageNationalAddress to null
      if (values.nationality === Nationality.NonSaudi) {
        values.imageNationalAddress = null;
        values.imageNationalAddressUrl = '';
      }
      
      await apiRepository.create(
        EndPoints.maincustomeraddmaindata(user.userId as string),
        formdata,
        SetCustomerData
      );
      
      onComplete(values);
    } catch (error) {
      console.error('Error saving customer data:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Form field watcher component to handle automatic updates
  const FormWatcher: React.FC = () => {
    const { values, setFieldValue } = useFormikContext<FormValues>();
    
    useEffect(() => {
      // Automatically set isFreelancer to true when documentType is FreelancerLicense
      if (values.documentType === DocumentType.FreelancerLicense && !values.isFreelancer) {
        setFieldValue('isFreelancer', true);
      }
      
      // Reset documentType to CommercialRegistration when isFreelancer is unchecked
      if (!values.isFreelancer && values.documentType === DocumentType.FreelancerLicense) {
        setFieldValue('documentType', DocumentType.CommercialRegistration);
      }
      
      // Only update if nationality is NonSaudi AND the fields haven't been reset yet
      if (values.nationality === Nationality.NonSaudi && 
          (values.imageNationalAddress !== null || values.imageNationalAddressUrl !== '')) {
        setFieldValue('imageNationalAddress', null);
        setFieldValue('imageNationalAddressUrl', '');
      }
    }, [values.nationality, values.documentType, values.isFreelancer, setFieldValue]);
    
    return null; // This is a utility component that doesn't render anything
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting, setFieldValue, values }) => (
        <Form className="space-y-8">
          <FormWatcher />
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t('step1Form.title')}
              </h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('step1Form.description', 'Please provide your basic personal information. This information will be used for account verification and service delivery.')}
            </p>
          </div>

          {/* Personal Information Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary-600" />
              {t('step1Form.personal_info_section', 'Personal Information')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  {t('step1Form.location_label')} *
                </label>
                <Field
                  as={Input}
                  id="location"
                  name="location"
                  placeholder={t('step1Form.location_placeholder', 'Enter your location')}
                  className={`p-3 border rounded-lg transition-all duration-200 ${
                    touched.location && errors.location 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
                  }`}
                  error={touched.location && errors.location ? t(errors.location) : undefined}
                />
                {touched.location && errors.location && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {t(errors.location)}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                  {t('step1Form.nationality_label')} *
                </label>
                <Field name="nationality">
                  {({ field }: FieldProps) => (
                    <Select
                      id="nationality"
                      options={nationalityOptions}
                      placeholder={t('step1Form.nationality_placeholder', 'Select nationality')}
                      className={`p-3 border rounded-lg transition-all duration-200 ${
                        touched.nationality && errors.nationality 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
                      }`}
                      value={field.value}
                      onChange={(value) => setFieldValue('nationality', value)}
                      error={touched.nationality && errors.nationality ? t(errors.nationality) : undefined}
                    />
                  )}
                </Field>
                {touched.nationality && errors.nationality && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {t(errors.nationality)}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="nationalAddress" className="block text-sm font-medium text-gray-700">
                  {t('step1Form.nationalAddress_label')} *
                </label>
                <Field
                  as={Input}
                  id="nationalAddress"
                  name="nationalAddress"
                  placeholder={t('step1Form.nationalAddress_placeholder', 'Enter your national address')}
                  className={`p-3 border rounded-lg transition-all duration-200 ${
                    touched.nationalAddress && errors.nationalAddress 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
                  }`}
                  error={touched.nationalAddress && errors.nationalAddress ? t(errors.nationalAddress) : undefined}
                />
                {touched.nationalAddress && errors.nationalAddress && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {t(errors.nationalAddress)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Work Status Section - Moved above document type */}
          <div className="bg-primary-50 rounded-xl p-6 border border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-primary-600" />
                  {t('step1Form.freelancer_section', 'Work Status')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('step1Form.freelancer_description', 'Please indicate if you are a freelancer or business owner.')}
                </p>
              </div>
              <Field name="isFreelancer">
                {({ field }: FieldProps) => (
                  <Checkbox
                    label={t('step1Form.isFreelancer_label')}
                    id="isFreelancer"
                    checked={field.value}
                    onChange={(checked: boolean) => setFieldValue('isFreelancer', checked)}
                    className="text-primary-600"
                  />
                )}
              </Field>
            </div>
          </div>

          {/* Document Type Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary-600" />
              {t('step1Form.document_type_section', 'Document Type')}
            </h3>
            
            <div className="space-y-2">
              <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">
                {t('step1Form.documentType_label')} *
              </label>
              <Field name="documentType">
                {({ field }: FieldProps) => (
                  <Select
                    id="documentType"
                    options={getDocumentTypeOptions(values.isFreelancer)}
                    placeholder={t('step1Form.documentType_placeholder', 'Select document type')}
                    className={`p-3 border rounded-lg transition-all duration-200 ${
                      touched.documentType && errors.documentType 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
                    }`}
                    value={field.value}
                    onChange={(value) => setFieldValue('documentType', value)}
                    error={touched.documentType && errors.documentType ? t(errors.documentType) : undefined}
                  />
                )}
              </Field>
              {touched.documentType && errors.documentType && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {t(errors.documentType)}
                </div>
              )}
              {values.isFreelancer && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    {t('step1Form.freelancer_note', 'As a freelancer, you will need to provide a freelancer work permit.')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Date Information Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary-600" />
              {t('step1Form.date_info_section', 'Date Information')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                  {t('step1Form.birthDate_label')} *
                </label>
                <Field name="birthDate">
                  {({ field }: FieldProps) => (
                    <DatePicker
                      id="birthDate"
                      placeholder={t('step1Form.birthDate_placeholder', 'Select birth date')}
                      className={`p-3 border rounded-lg transition-all duration-200 ${
                        touched.birthDate && errors.birthDate 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
                      }`}
                      value={field.value}
                      onChange={(date: string) => setFieldValue('birthDate', date)}
                      error={touched.birthDate && errors.birthDate ? t(errors.birthDate) : undefined}
                    />
                  )}
                </Field>
                {touched.birthDate && errors.birthDate && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {t(errors.birthDate)}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="idIssueDate" className="block text-sm font-medium text-gray-700">
                  {t('step1Form.idIssueDate_label')} *
                </label>
                <Field name="idIssueDate">
                  {({ field }: FieldProps) => (
                    <DatePicker
                      id="idIssueDate"
                      placeholder={t('step1Form.idIssueDate_placeholder', 'Select issue date')}
                      className={`p-3 border rounded-lg transition-all duration-200 ${
                        touched.idIssueDate && errors.idIssueDate 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
                      }`}
                      value={field.value}
                      onChange={(date: string) => setFieldValue('idIssueDate', date)}
                      error={touched.idIssueDate && errors.idIssueDate ? t(errors.idIssueDate) : undefined}
                    />
                  )}
                </Field>
                {touched.idIssueDate && errors.idIssueDate && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {t(errors.idIssueDate)}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="idExpiryDate" className="block text-sm font-medium text-gray-700">
                  {t('step1Form.idExpiryDate_label')} *
                </label>
                <Field name="idExpiryDate">
                  {({ field }: FieldProps) => (
                    <DatePicker
                      id="idExpiryDate"
                      placeholder={t('step1Form.idExpiryDate_placeholder', 'Select expiry date')}
                      className={`p-3 border rounded-lg transition-all duration-200 ${
                        touched.idExpiryDate && errors.idExpiryDate 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200'
                      }`}
                      value={field.value}
                      onChange={(date: string) => setFieldValue('idExpiryDate', date)}
                      error={touched.idExpiryDate && errors.idExpiryDate ? t(errors.idExpiryDate) : undefined}
                    />
                  )}
                </Field>
                {touched.idExpiryDate && errors.idExpiryDate && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {t(errors.idExpiryDate)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary-600" />
              {t('step1Form.documents_section', 'Required Documents')}
            </h3>
            
            <div className="space-y-6">
              {/* Identity Image */}
              <div className="space-y-3">
                <label htmlFor="imageIdentity" className="block text-sm font-medium text-gray-700">
                  {t('step1Form.imageIdentity_label')} *
                </label>
                {values.identityImageUrl && (
                  <div className="mb-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={values.identityImageUrl} 
                        alt={t('step1Form.imageIdentity_alt')} 
                        className="w-16 h-16 object-cover rounded-lg border border-gray-300" 
                      />
                      <div>
                        <p className="text-sm font-medium text-primary-800">
                          {t('step1Form.imageIdentity_existing')}
                        </p>
                        <p className="text-xs text-primary-600">
                          {t('step1Form.imageIdentity_upload_new', 'Upload a new image to replace')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <Field name="imageIdentity">
                  {() => (
                    <FileUpload
                      id="imageIdentity"
                      accept="image/*"
                      onChange={(file: File | null) => setFieldValue('imageIdentity', file)}
                      error={touched.imageIdentity && errors.imageIdentity ? t(errors.imageIdentity) : undefined}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-400 transition-colors"
                    />
                  )}
                </Field>
                {touched.imageIdentity && errors.imageIdentity && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {t(errors.imageIdentity)}
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  {t('step1Form.imageIdentity_help', 'Upload a clear image of your ID document. Accepted formats: JPG, PNG. Maximum size: 5MB.')}
                </p>
              </div>

              {/* National Address Image - Only for Saudi nationals */}
              {values.nationality === Nationality.Saudi && (
                <div className="space-y-3">
                  <label htmlFor="imageNationalAddress" className="block text-sm font-medium text-gray-700">
                    {t('step1Form.imageNationalAddress_label')} *
                  </label>
                  {values.imageNationalAddressUrl && (
                    <div className="mb-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={values.imageNationalAddressUrl} 
                          alt={t('step1Form.imageNationalAddress_alt')} 
                          className="w-16 h-16 object-cover rounded-lg border border-gray-300" 
                        />
                        <div>
                          <p className="text-sm font-medium text-primary-800">
                            {t('step1Form.imageNationalAddress_existing')}
                          </p>
                          <p className="text-xs text-primary-600">
                            {t('step1Form.imageNationalAddress_upload_new', 'Upload a new image to replace')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <Field name="imageNationalAddress">
                    {() => (
                      <FileUpload
                        id="imageNationalAddress"
                        accept="image/*"
                        onChange={(file: File | null) => setFieldValue('imageNationalAddress', file)}
                        error={touched.imageNationalAddress && errors.imageNationalAddress ? t(errors.imageNationalAddress) : undefined}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-400 transition-colors"
                      />
                    )}
                  </Field>
                  {touched.imageNationalAddress && errors.imageNationalAddress && (
                    <div className="flex items-center text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {t(errors.imageNationalAddress)}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    {t('step1Form.imageNationalAddress_help', 'Upload a clear image of your national address document. Accepted formats: JPG, PNG. Maximum size: 5MB.')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <Button 
              type="submit" 
              size="lg" 
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{t('common.loading')}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>{t('common.next')}</span>
                  <Upload className="w-4 h-4" />
                </div>
              )}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Step1Form;