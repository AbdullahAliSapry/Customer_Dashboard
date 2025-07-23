import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers, FieldProps } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Store/Store';
import { ApiRepository } from '../../../Api/ApiRepository';
import { EndPoints } from '../../../Api/EndPoints';
import { SetFreelancerLicense } from '../../../Store/DashBoardSlice/CustomerInfoSlice';
import { useTranslation } from 'react-i18next';

import Button from '../../ui/Button';
import Input from '../../ui/Input';
import DatePicker from '../../ui/DatePicker';
import FileUpload from '../../ui/FileUpload';

interface Step3FormProps {
  onComplete: (data: FormValues) => void;
  onBack: () => void;
  formData?: Partial<FormValues>;
  isStepCompleted?: boolean;
}

interface FormValues {
  numberIdentity: string;
  licenseNumber: string;
  licensedActivity: string;
  issueDate: string;
  expiryDate: string;
  document: File | null;
}

const validationSchema = Yup.object({
  numberIdentity: Yup.string().required('step3Form.errors.numberIdentity_required'),
  licenseNumber: Yup.string().required('step3Form.errors.licenseNumber_required'),
  licensedActivity: Yup.string().required('step3Form.errors.licensedActivity_required'),
  issueDate: Yup.string().required('step3Form.errors.issueDate_required'),
  expiryDate: Yup.string()
    .required('step3Form.errors.expiryDate_required')
    .test('expiry', 'step3Form.errors.expiryDate_expired', function(value) {
      if (!value) return false;
      const expiryDate = new Date(value);
      const today = new Date();
      return expiryDate > today;
    }),
  document: Yup.mixed()
    .required('step3Form.errors.document_required')
    .test('fileSize', 'step3Form.errors.document_size', function(value) {
      if (!value || !(value instanceof File)) return false;
      return value.size <= 5 * 1024 * 1024; // 5MB in bytes
    })
    .test('fileType', 'step3Form.errors.document_type', function(value) {
      if (!value || !(value instanceof File)) return false;
      return ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type);
    })
});

const Step3Form: React.FC<Step3FormProps> = ({ onComplete, onBack, formData, isStepCompleted }) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.Auth.user);
  const apiRepository = new ApiRepository();
  const customerId = useSelector((state: RootState) => state.customer.customerData?.id);

  // Automatically move to next step if data exists
  useEffect(() => {
    if (isStepCompleted && formData && !formData.isSubmitting) {
      console.log('Step 3 already completed, automatically moving to next step');
      onComplete(formData as FormValues);
    }
  }, [isStepCompleted, formData, onComplete]);

  const initialValues: FormValues = {
    numberIdentity: formData?.numberIdentity || '',
    licenseNumber: formData?.licenseNumber || '',
    licensedActivity: formData?.licensedActivity || '',
    issueDate: formData?.issueDate || '',
    expiryDate: formData?.expiryDate || '',
    document: formData?.document || null
  };

  const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    try {
      // If the step is already completed, skip the API call
      if (isStepCompleted) {
        console.log('Step 3 already completed, skipping API request');
        onComplete(values);
        return;
      }

      if (!user?.userId) {
        console.error('Missing user ID or customer ID');
        return;
      }

      const formdata = new FormData();
      
      // Add all form fields to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (value instanceof File) {
            formdata.append(key, value);
          } else {
            formdata.append(key, value);
          }
        }
      });

      formdata.append('maincustomerid', customerId?.toString() || '');

      await apiRepository.create(
        EndPoints.maincustomeraddfreelancerlicense(user.userId),
        formdata,
        SetFreelancerLicense
      );
      onComplete(values);
    } catch (error) {
      console.error('Error saving freelancer license data:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ errors, touched, isSubmitting, setFieldValue }) => (
        <Form className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t('step3Form.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="numberIdentity" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step3Form.numberIdentity_label')}
              </label>
              <Field
                as={Input}
                id="numberIdentity"
                name="numberIdentity"
                className="p-2 outline-none"
                error={touched.numberIdentity && errors.numberIdentity ? t(errors.numberIdentity) : undefined}
              />
              <ErrorMessage name="numberIdentity" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step3Form.licenseNumber_label')}
              </label>
              <Field
                as={Input}
                id="licenseNumber"
                name="licenseNumber"
                className="p-2 outline-none"
                error={touched.licenseNumber && errors.licenseNumber ? t(errors.licenseNumber) : undefined}
              />
              <ErrorMessage name="licenseNumber" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="licensedActivity" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step3Form.licensedActivity_label')}
              </label>
              <Field
                as={Input}
                id="licensedActivity"
                name="licensedActivity"
                className="p-2 outline-none"
                error={touched.licensedActivity && errors.licensedActivity ? t(errors.licensedActivity) : undefined}
              />
              <ErrorMessage name="licensedActivity" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step3Form.issueDate_label')}
              </label>
              <Field name="issueDate">
                {({ field }: FieldProps) => (
                  <DatePicker
                    id="issueDate"
                    className="p-2 outline-none"
                    value={field.value}
                    onChange={(date: string) => setFieldValue('issueDate', date)}
                    error={touched.issueDate && errors.issueDate ? t(errors.issueDate) : undefined}
                  />
                )}
              </Field>
              <ErrorMessage name="issueDate" component="div" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step3Form.expiryDate_label')}
              </label>
              <Field name="expiryDate">
                {({ field }: FieldProps) => (
                  <DatePicker
                    id="expiryDate"
                    className="p-2 outline-none"
                    value={field.value}
                    onChange={(date: string) => setFieldValue('expiryDate', date)}
                    error={touched.expiryDate && errors.expiryDate ? t(errors.expiryDate) : undefined}
                  />
                )}
              </Field>
              <ErrorMessage name="expiryDate" component="div" className="mt-1 text-sm text-red-600" />
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-1">
              {t('step3Form.document_label')}
            </label>
            <Field name="document">
              {() => (
                <FileUpload
                  id="document"
                  accept="image/*,.pdf"
                  onChange={(file: File | null) => setFieldValue('document', file)}
                  error={touched.document && errors.document ? t(errors.document) : undefined}
                />
              )}
            </Field>
            <ErrorMessage name="document" component="div" className="mt-1 text-sm text-red-600" />
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              {t('step3Form.back')}
            </Button>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? t('common.loading') : t('common.next')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Step3Form;