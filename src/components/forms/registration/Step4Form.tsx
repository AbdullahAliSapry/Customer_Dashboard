
import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Store/Store';
import { ApiRepository } from '../../../Api/ApiRepository';
import { EndPoints } from '../../../Api/EndPoints';
import { SetBankAccount } from '../../../Store/DashBoardSlice/CustomerInfoSlice';
import { useTranslation } from 'react-i18next';

import Button from '../../ui/Button';
import Input from '../../ui/Input';
import FileUpload from '../../ui/FileUpload';

interface Step4FormProps {
  onComplete: (data: FormValues) => void;
  onBack: () => void;
  formData?: Partial<FormValues>;
  isStepCompleted?: boolean;
}

interface FormValues {
  businessName: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  country: string;
  bankName: string;
  bankCertificate: File | null;
}

const validationSchema = Yup.object({
  businessName: Yup.string().required('step4Form.errors.businessName_required'),
  accountNumber: Yup.string().required('step4Form.errors.accountNumber_required'),
  iban: Yup.string()
    .required('step4Form.errors.iban_required')
    .matches(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/, 'step4Form.errors.iban_invalid'),
  swiftCode: Yup.string()
    .required('step4Form.errors.swiftCode_required')
    .matches(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, 'step4Form.errors.swiftCode_invalid'),
  country: Yup.string().required('step4Form.errors.country_required'),
  bankName: Yup.string().required('step4Form.errors.bankName_required'),
  bankCertificate: Yup.mixed()
    .required('step4Form.errors.bankCertificate_required')
    .test('fileSize', 'step4Form.errors.bankCertificate_size', function(value) {
      if (!value || !(value instanceof File)) return false;
      return value.size <= 5 * 1024 * 1024; // 5MB in bytes
    })
    .test('fileType', 'step4Form.errors.bankCertificate_type', function(value) {
      if (!value || !(value instanceof File)) return false;
      return ['application/pdf'].includes(value.type);
    })
});

const Step4Form: React.FC<Step4FormProps> = ({ onComplete, onBack, formData, isStepCompleted }) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.Auth.user);
  const apiRepository = new ApiRepository();
  const customerId = useSelector((state: RootState) => state.customer.customerData?.id);

  // Automatically move to next step if data exists
  useEffect(() => {
    if (isStepCompleted && formData) {
      console.log('Step 4 already completed, automatically moving to next step');
      onComplete(formData as FormValues);
    }
  }, [isStepCompleted, formData, onComplete]);

  const initialValues: FormValues = {
    businessName: formData?.businessName || '',
    accountNumber: formData?.accountNumber || '',
    iban: formData?.iban || '',
    swiftCode: formData?.swiftCode || '',
    country: formData?.country || '',
    bankName: formData?.bankName || '',
    bankCertificate: formData?.bankCertificate || null
  };

  const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    try {
      // If the step is already completed, skip the API call
      if (isStepCompleted) {
        console.log('Step 4 already completed, skipping API request');
        onComplete(values);
        return;
      }

      if (!user?.userId || !customerId) {
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

      formdata.append('maincustomerid', customerId.toString());

      await apiRepository.create(
        EndPoints.maincustomeraddbankaccount(user.userId),
        formdata,
        SetBankAccount
      );
      onComplete(values);
    } catch (error) {
      console.error('Error saving bank account data:', error);
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
            {t('step4Form.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step4Form.businessName_label')}
              </label>
              <Field
                as={Input}
                id="businessName"
                name="businessName"
                className="p-2 outline-none"
                error={touched.businessName && errors.businessName ? t(errors.businessName) : undefined}
              />
              <ErrorMessage name="businessName" component="div" className="mt-1 text-sm text-red-600">
                {(msg) => <div>{t(msg)}</div>}
              </ErrorMessage>
            </div>

            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step4Form.accountNumber_label')}
              </label>
              <Field
                as={Input}
                id="accountNumber"
                name="accountNumber"
                className="p-2 outline-none"
                error={touched.accountNumber && errors.accountNumber ? t(errors.accountNumber) : undefined}
              />
              <ErrorMessage name="accountNumber" component="div" className="mt-1 text-sm text-red-600">
                {(msg) => <div>{t(msg)}</div>}
              </ErrorMessage>
            </div>

            <div>
              <label htmlFor="iban" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step4Form.iban_label')}
              </label>
              <Field
                as={Input}
                id="iban"
                name="iban"
                className="p-2 outline-none"
                error={touched.iban && errors.iban ? t(errors.iban) : undefined}
              />
              <ErrorMessage name="iban" component="div" className="mt-1 text-sm text-red-600">
                {(msg) => <div>{t(msg)}</div>}
              </ErrorMessage>
            </div>

            <div>
              <label htmlFor="swiftCode" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step4Form.swiftCode_label')}
              </label>
              <Field
                as={Input}
                id="swiftCode"
                name="swiftCode"
                className="p-2 outline-none"
                error={touched.swiftCode && errors.swiftCode ? t(errors.swiftCode) : undefined}
              />
              <ErrorMessage name="swiftCode" component="div" className="mt-1 text-sm text-red-600">
                {(msg) => <div>{t(msg)}</div>}
              </ErrorMessage>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step4Form.country_label')}
              </label>
              <Field
                as={Input}
                id="country"
                name="country"
                className="p-2 outline-none"
                error={touched.country && errors.country ? t(errors.country) : undefined}
              />
              <ErrorMessage name="country" component="div" className="mt-1 text-sm text-red-600">
                {(msg) => <div>{t(msg)}</div>}
              </ErrorMessage>
            </div>

            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step4Form.bankName_label')}
              </label>
              <Field
                as={Input}
                id="bankName"
                name="bankName"
                className="p-2 outline-none"
                error={touched.bankName && errors.bankName ? t(errors.bankName) : undefined}
              />
              <ErrorMessage name="bankName" component="div" className="mt-1 text-sm text-red-600">
                {(msg) => <div>{t(msg)}</div>}
              </ErrorMessage>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="bankCertificate" className="block text-sm font-medium text-gray-700 mb-1">
              {t('step4Form.bankCertificate_label')}
            </label>
            <Field name="bankCertificate">
              {() => (
                <FileUpload
                  id="bankCertificate"
                  accept=".pdf"
                  onChange={(file: File | null) => setFieldValue('bankCertificate', file)}
                  error={touched.bankCertificate && errors.bankCertificate ? t(errors.bankCertificate) : undefined}
                />
              )}
            </Field>
            <ErrorMessage name="bankCertificate" component="div" className="mt-1 text-sm text-red-600">
              {(msg) => <div>{t(msg)}</div>}
            </ErrorMessage>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              {t('step4Form.back')}
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

export default Step4Form;