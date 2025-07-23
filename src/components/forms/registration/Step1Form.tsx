import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage, FormikHelpers, FieldProps, useFormikContext } from 'formik';
import * as Yup from 'yup';
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

  // Nationality options
  const nationalityOptions = [
    { value: Nationality.Saudi, label: t('step1Form.nationality.saudi') },
    { value: Nationality.NonSaudi, label: t('step1Form.nationality.nonSaudi') },
  ];

  // Document type options
  const documentTypeOptions = [
    { value: DocumentType.CommercialRegistration, label: t('step1Form.documentType.commercial') },
    { value: DocumentType.FreelancerLicense, label: t('step1Form.documentType.freelancer') },
  ];

  const initialValues: FormValues = {
    location: formData?.location || '',
    nationality: formData?.nationality || Nationality.NonSaudi,
    documentType: formData?.documentType || DocumentType.CommercialRegistration,
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

  // Form field watcher component to reset national address fields when nationality changes
  const NationalityWatcher: React.FC = () => {
    const { values, setFieldValue } = useFormikContext<FormValues>();
    
    useEffect(() => {
      // Only update if nationality is NonSaudi AND the fields haven't been reset yet
      if (values.nationality === Nationality.NonSaudi && 
          (values.imageNationalAddress !== null || values.imageNationalAddressUrl !== '')) {
        setFieldValue('imageNationalAddress', null);
        setFieldValue('imageNationalAddressUrl', '');
      }
    }, [values.nationality, setFieldValue]);
    
    return null; // This is a utility component that doesn't render anything
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting, setFieldValue, values }) => (
        <Form className="space-y-6">
          <NationalityWatcher />
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t('step1Form.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step1Form.location_label')}
              </label>
              <Field
                as={Input}
                id="location"
                name="location"
                className="p-2 outline-none"
                error={touched.location && errors.location ? t(errors.location) : undefined}
              />
              <ErrorMessage name="location" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step1Form.nationality_label')}
              </label>
              <Field name="nationality">
                {({ field }: FieldProps) => (
                  <Select
                    id="nationality"
                    options={nationalityOptions}
                    className="p-2.5 outline-none"
                    value={field.value}
                    onChange={(value) => setFieldValue('nationality', value)}
                    error={touched.nationality && errors.nationality ? t(errors.nationality) : undefined}
                  />
                )}
              </Field>
              <ErrorMessage name="nationality" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step1Form.documentType_label')}
              </label>
              <Field name="documentType">
                {({ field }: FieldProps) => (
                  <Select
                    id="documentType"
                    options={documentTypeOptions}
                    className="p-2.5 outline-none"
                    value={field.value}
                    onChange={(value) => setFieldValue('documentType', value)}
                    error={touched.documentType && errors.documentType ? t(errors.documentType) : undefined}
                  />
                )}
              </Field>
              <ErrorMessage name="documentType" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="nationalAddress" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step1Form.nationalAddress_label')}
              </label>
              <Field
                as={Input}
                id="nationalAddress"
                name="nationalAddress"
                className="p-2 outline-none"
                error={touched.nationalAddress && errors.nationalAddress ? t(errors.nationalAddress) : undefined}
              />
              <ErrorMessage name="nationalAddress" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step1Form.birthDate_label')}
              </label>
              <Field name="birthDate">
                {({ field }: FieldProps) => (
                  <DatePicker
                    id="birthDate"
                    className="p-2 outline-none"
                    value={field.value}
                    onChange={(date: string) => setFieldValue('birthDate', date)}
                    error={touched.birthDate && errors.birthDate ? t(errors.birthDate) : undefined}
                  />
                )}
              </Field>
              <ErrorMessage name="birthDate" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="idIssueDate" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step1Form.idIssueDate_label')}
              </label>
              <Field name="idIssueDate">
                {({ field }: FieldProps) => (
                  <DatePicker
                    id="idIssueDate"
                    className="p-2 outline-none"
                    value={field.value}
                    onChange={(date: string) => setFieldValue('idIssueDate', date)}
                    error={touched.idIssueDate && errors.idIssueDate ? t(errors.idIssueDate) : undefined}
                  />
                )}
              </Field>
              <ErrorMessage name="idIssueDate" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="idExpiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step1Form.idExpiryDate_label')}
              </label>
              <Field name="idExpiryDate">
                {({ field }: FieldProps) => (
                  <DatePicker
                    id="idExpiryDate"
                    className="p-2 outline-none"
                    value={field.value}
                    onChange={(date: string) => setFieldValue('idExpiryDate', date)}
                    error={touched.idExpiryDate && errors.idExpiryDate ? t(errors.idExpiryDate) : undefined}
                  />
                )}
              </Field>
              <ErrorMessage name="idExpiryDate" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <Field name="isFreelancer">
                {({ field }: FieldProps) => (
                  <Checkbox
                    label={t('step1Form.isFreelancer_label')}
                    id="isFreelancer"
                    checked={field.value}
                    onChange={(checked: boolean) => setFieldValue('isFreelancer', checked)}
                  />
                )}
              </Field>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="imageIdentity" className="block text-sm font-medium text-gray-700 mb-1">
              {t('step1Form.imageIdentity_label')}
            </label>
            {values.identityImageUrl && (
              <div className="mb-2">
                <img 
                  src={values.identityImageUrl} 
                  alt={t('step1Form.imageIdentity_alt')} 
                  className="max-h-24 rounded-md border border-gray-300" 
                />
                <p className="text-xs text-gray-500 mt-1">{t('step1Form.imageIdentity_existing')}</p>
              </div>
            )}
            <Field name="imageIdentity">
              {() => (
                <FileUpload
                  id="imageIdentity"
                  accept="image/*"
                  onChange={(file: File | null) => setFieldValue('imageIdentity', file)}
                  error={touched.imageIdentity && errors.imageIdentity ? t(errors.imageIdentity) : undefined}
                />
              )}
            </Field>
            <ErrorMessage name="imageIdentity" component="div" className="mt-1 text-sm text-red-600" />
          </div>

          {values.nationality === Nationality.Saudi && (
            <div className="mt-6">
              <label htmlFor="imageNationalAddress" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step1Form.imageNationalAddress_label')}
              </label>
              {values.imageNationalAddressUrl && (
                <div className="mb-2">
                  <img 
                    src={values.imageNationalAddressUrl} 
                    alt={t('step1Form.imageNationalAddress_alt')} 
                    className="max-h-24 rounded-md border border-gray-300" 
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('step1Form.imageNationalAddress_existing')}</p>
                </div>
              )}
              <Field name="imageNationalAddress">
                {() => (
                  <FileUpload
                    id="imageNationalAddress"
                    accept="image/*"
                    onChange={(file: File | null) => setFieldValue('imageNationalAddress', file)}
                    error={touched.imageNationalAddress && errors.imageNationalAddress ? t(errors.imageNationalAddress) : undefined}
                  />
                )}
              </Field>
              <ErrorMessage name="imageNationalAddress" component="div" className="mt-1 text-sm text-red-600" />
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? t('common.loading') : t('common.next')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Step1Form;