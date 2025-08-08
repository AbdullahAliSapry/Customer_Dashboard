import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers, FieldProps } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Store/Store';
import { ApiRepository } from '../../../Api/ApiRepository';
import { EndPoints } from '../../../Api/EndPoints';
import { SetManagerDetails, SetCheckCustomerSteps, SetError } from '../../../Store/DashBoardSlice/CustomerInfoSlice';
import { useTranslation } from 'react-i18next';

import Button from '../../ui/Button';
import Input from '../../ui/Input';
import DatePicker from '../../ui/DatePicker';
import FileUpload from '../../ui/FileUpload';

interface Step6FormProps {
  onComplete: (data: FormValues) => void;
  onBack: () => void;
  formData?: Partial<FormValues>;
  isStepCompleted?: boolean;
}

interface FormValues {
  managerName: string;
  managerContactNumber: string;
  managerBirthDate: string;
  managerIdIssueDate: string;
  managerIdExpiryDate: string;
  managerImageIdentity: File | null;
}

const validationSchema = Yup.object({
  managerName: Yup.string().required('step6Form.errors.managerName_required'),
  managerContactNumber: Yup.string()
    .required('step6Form.errors.managerContactNumber_required')
    .matches(/^[0-9+\-\s()]+$/, 'step6Form.errors.managerContactNumber_invalid'),
  managerBirthDate: Yup.string()
    .required('step6Form.errors.managerBirthDate_required')
    .test('age', 'step6Form.errors.managerBirthDate_age', function(value) {
      if (!value) return false;
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 18 && age <= 100;
    }),
  managerIdIssueDate: Yup.string().required('step6Form.errors.managerIdIssueDate_required'),
  managerIdExpiryDate: Yup.string()
    .required('step6Form.errors.managerIdExpiryDate_required')
    .test('expiry', 'step6Form.errors.managerIdExpiryDate_expired', function(value) {
      if (!value) return false;
      const expiryDate = new Date(value);
      const today = new Date();
      return expiryDate > today;
    })
    .test('afterIssue', 'step6Form.errors.managerIdExpiryDate_afterIssue', function(value) {
      const issueDate = this.parent.managerIdIssueDate;
      if (!value || !issueDate) return false;
      const expiryDate = new Date(value);
      const idIssueDate = new Date(issueDate);
      return expiryDate > idIssueDate;
    }),
  managerImageIdentity: Yup.mixed()
    .required('step6Form.errors.managerImageIdentity_required')
    .test('fileSize', 'step6Form.errors.managerImageIdentity_size', function(value) {
      if (!value || !(value instanceof File)) return false;
      return value.size <= 5 * 1024 * 1024; // 5MB in bytes
    })
    .test('fileType', 'step6Form.errors.managerImageIdentity_type', function(value) {
      if (!value || !(value instanceof File)) return false;
      return ['image/jpeg', 'image/png'].includes(value.type);
    })
});

const Step6Form: React.FC<Step6FormProps> = ({ onComplete, onBack, formData, isStepCompleted }) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.Auth.user);
  const apiRepository = new ApiRepository();
  const customerId = useSelector((state: RootState) => state.customer.customerData?.id);

  // Automatically move to next step if data exists
  useEffect(() => {
    if (isStepCompleted && formData) {
      console.log('Step 6 already completed, automatically moving to next step');
      onComplete(formData as FormValues);
    }
  }, [isStepCompleted, formData, onComplete]);

  const initialValues: FormValues = {
    managerName: formData?.managerName || '',
    managerContactNumber: formData?.managerContactNumber || '',
    managerBirthDate: formData?.managerBirthDate || '',
    managerIdIssueDate: formData?.managerIdIssueDate || '',
    managerIdExpiryDate: formData?.managerIdExpiryDate || '',
    managerImageIdentity: formData?.managerImageIdentity || null
  };


  const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    try {
      // If the step is already completed, skip the API call
      if (isStepCompleted) {
        console.log('Step 6 already completed, skipping API request');
        onComplete(values);
        return;
      }

      if (!user?.userId) {
        console.error('Missing user ID');
        return;
      }

      if (!customerId) {
        console.error('Missing customer ID');
        return;
      }

      // Validate all required fields are present
      if (!values.managerName || !values.managerContactNumber || !values.managerBirthDate || 
          !values.managerIdIssueDate || !values.managerIdExpiryDate || !values.managerImageIdentity) {
        console.error('Missing required fields:', {
          managerName: !!values.managerName,
          managerContactNumber: !!values.managerContactNumber,
          managerBirthDate: !!values.managerBirthDate,
          managerIdIssueDate: !!values.managerIdIssueDate,
          managerIdExpiryDate: !!values.managerIdExpiryDate,
          managerImageIdentity: !!values.managerImageIdentity
        });
        return;
      }

      // Validate dates
      const birthDate = new Date(values.managerBirthDate);
      const issueDate = new Date(values.managerIdIssueDate);
      const expiryDate = new Date(values.managerIdExpiryDate);
      const today = new Date();

      // Check age
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18 || age > 100) {
        console.error('Invalid age:', age);
        return;
      }

      // Check expiry date is after issue date
      if (expiryDate <= issueDate) {
        console.error('Expiry date must be after issue date');
        return;
      }

      // Check expiry date is not expired
      if (expiryDate <= today) {
        console.error('ID is expired');
        return;
      }

      // Validate contact number format
      const contactNumberRegex = /^[0-9+\-\s()]+$/;
      if (!contactNumberRegex.test(values.managerContactNumber)) {
        console.error('Invalid contact number format');
        return;
      }

      // Validate file
      if (values.managerImageIdentity) {
        if (values.managerImageIdentity.size > 5 * 1024 * 1024) {
          console.error('File size too large');
          return;
        }
        if (!['image/jpeg', 'image/png'].includes(values.managerImageIdentity.type)) {
          console.error('Invalid file type');
          return;
        }
      }

      const formdata = new FormData();
      
      // Add all form fields to FormData with proper field names
      if (values.managerName) {
        formdata.append('Name', values.managerName);
      }
      if (values.managerContactNumber) {
        formdata.append('ContactNumber', values.managerContactNumber);
      }
      if (values.managerBirthDate) {
        formdata.append('BirthDate', values.managerBirthDate);
      }
      if (values.managerIdIssueDate) {
        formdata.append('IdIssueDate', values.managerIdIssueDate);
      }
      if (values.managerIdExpiryDate) {
        formdata.append('IdExpiryDate', values.managerIdExpiryDate);
      }
      if (values.managerImageIdentity) {
        formdata.append('ImageIdentity', values.managerImageIdentity);
      }

      formdata.append('MainCustomerId', customerId?.toString() || '');

      // Debug: Log the FormData contents
      console.log('FormData contents:');
      for (const [key, value] of formdata.entries()) {
        console.log(`${key}:`, value);
      }

      console.log('Submitting manager details:', {
        userId: user.userId,
        customerId: customerId,
        values: values
      });

      try {
        const response = await apiRepository.create(
          EndPoints.addManagerDetailsMainCustomer(user.userId),
          formdata,
          SetManagerDetails
        );
        console.log('Manager details saved successfully:', response);
        
        // Refresh checkCustomerSteps to get updated status
        if (user?.userId) {
          apiRepository.getById(
            EndPoints.checkCustomerSteps,
            user.userId,
            SetCheckCustomerSteps,
            SetError
          );
        }
        
        onComplete(values);
      } catch (apiError) {
        console.error('API Error saving manager details:', apiError);
        if (apiError && typeof apiError === 'object' && 'response' in apiError) {
          const error = apiError as { response: { data: unknown; status: number } };
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
        throw apiError; // Re-throw to be caught by outer catch
      }
    } catch (error) {
      console.error('Error saving manager details data:', error);
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
      validationContext={{ customerId }}
    >
      {({ errors, touched, isSubmitting, setFieldValue }) => (
        <Form className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t('step6Form.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="managerName" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step6Form.managerName_label')}
              </label>
              <Field
                as={Input}
                id="managerName"
                name="managerName"
                className="p-2 outline-none"
                error={touched.managerName && errors.managerName ? t(errors.managerName) : undefined}
              />
              <ErrorMessage name="managerName" component="div" className="mt-1 text-sm text-red-600">
                {(msg) => <div>{t(msg)}</div>}
              </ErrorMessage>
            </div>

            <div>
              <label htmlFor="managerContactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step6Form.managerContactNumber_label')}
              </label>
              <Field
                as={Input}
                id="managerContactNumber"
                name="managerContactNumber"
                className="p-2 outline-none"
                error={touched.managerContactNumber && errors.managerContactNumber ? t(errors.managerContactNumber) : undefined}
              />
              <ErrorMessage name="managerContactNumber" component="div" className="mt-1 text-sm text-red-600">
                {(msg) => <div>{t(msg)}</div>}
              </ErrorMessage>
            </div>

            <div>
              <label htmlFor="managerBirthDate" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step6Form.managerBirthDate_label')}
              </label>
              <Field name="managerBirthDate">
                {({ field }: FieldProps) => (
                  <DatePicker
                    id="managerBirthDate"
                    className="p-2 outline-none"
                    value={field.value}
                    onChange={(date: string) => setFieldValue('managerBirthDate', date)}
                    error={touched.managerBirthDate && errors.managerBirthDate ? t(errors.managerBirthDate) : undefined}
                  />
                )}
              </Field>
              <ErrorMessage name="managerBirthDate" component="div" className="mt-1 text-sm text-red-600">
                {(msg) => <div>{t(msg)}</div>}
              </ErrorMessage>
            </div>

            <div>
              <label htmlFor="managerIdIssueDate" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step6Form.managerIdIssueDate_label')}
              </label>
              <Field name="managerIdIssueDate">
                {({ field }: FieldProps) => (
                  <DatePicker
                    id="managerIdIssueDate"
                    className="p-2 outline-none"
                    value={field.value}
                    onChange={(date: string) => setFieldValue('managerIdIssueDate', date)}
                    error={touched.managerIdIssueDate && errors.managerIdIssueDate ? t(errors.managerIdIssueDate) : undefined}
                  />
                )}
              </Field>
              <ErrorMessage name="managerIdIssueDate" component="div" className="mt-1 text-sm text-red-600">
                {(msg) => <div>{t(msg)}</div>}
              </ErrorMessage>
            </div>

            <div>
              <label htmlFor="managerIdExpiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step6Form.managerIdExpiryDate_label')}
              </label>
              <Field name="managerIdExpiryDate">
                {({ field }: FieldProps) => (
                  <DatePicker
                    id="managerIdExpiryDate"
                    className="p-2 outline-none"
                    value={field.value}
                    onChange={(date: string) => setFieldValue('managerIdExpiryDate', date)}
                    error={touched.managerIdExpiryDate && errors.managerIdExpiryDate ? t(errors.managerIdExpiryDate) : undefined}
                  />
                )}
              </Field>
              <ErrorMessage name="managerIdExpiryDate" component="div" className="mt-1 text-sm text-red-600">
                {(msg) => <div>{t(msg)}</div>}
              </ErrorMessage>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="managerImageIdentity" className="block text-sm font-medium text-gray-700 mb-1">
              {t('step6Form.managerImageIdentity_label')}
            </label>
            <Field name="managerImageIdentity">
              {() => (
                <FileUpload
                  id="managerImageIdentity"
                  accept="image/*"
                  onChange={(file: File | null) => setFieldValue('managerImageIdentity', file)}
                  error={touched.managerImageIdentity && errors.managerImageIdentity ? t(errors.managerImageIdentity) : undefined}
                />
              )}
            </Field>
            <ErrorMessage name="managerImageIdentity" component="div" className="mt-1 text-sm text-red-600">
              {(msg) => <div>{t(msg)}</div>}
            </ErrorMessage>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              {t('step6Form.back')}
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

export default Step6Form; 