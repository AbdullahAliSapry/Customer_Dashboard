// import React, { useEffect } from 'react';
// import { Formik, Form, Field, ErrorMessage, FormikHelpers, FieldProps } from 'formik';
// import * as Yup from 'yup';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../Store/Store';
// import { ApiRepository } from '../../../Api/ApiRepository';
// import { EndPoints } from '../../../Api/EndPoints';
// import { SetCommercialRegistration } from '../../../Store/DashBoardSlice/CustomerInfoSlice';

// import Button from '../../ui/Button';
// import Input from '../../ui/Input';
// import DatePicker from '../../ui/DatePicker';
// import FileUpload from '../../ui/FileUpload';

// interface Step2FormProps {
//   onComplete: (data: FormValues) => void;
//   onBack: () => void;
//   formData?: Partial<FormValues>;
//   isStepCompleted?: boolean;
// }

// interface FormValues {
//   registrationNumber: string;
//   issueDate: string;
//   expiryDate: string;
//   document: File | null;
// }

// const validationSchema = Yup.object({
//   registrationNumber: Yup.string().required('Registration number is required'),
//   issueDate: Yup.string().required('Issue date is required'),
//   expiryDate: Yup.string()
//     .required('Expiry date is required')
//     .test('expiry', 'Document must not be expired', function(value) {
//       if (!value) return false;
//       const expiryDate = new Date(value);
//       const today = new Date();
//       return expiryDate > today;
//     }),
//   document: Yup.mixed()
//     .test('fileRequired', 'Document is required', function(value) {
//       // Skip validation if we're editing existing data (checking if customerId exists)
//       const customerId = this.parent.customerId || this.options.context?.customerId;
//       if (customerId) return true;
//       return value instanceof File;
//     })
//     .test('fileSize', 'File size must be less than 5MB', function(value) {
//       if (!value || !(value instanceof File)) return true; // Skip if not a file
//       return value.size <= 5 * 1024 * 1024; // 5MB in bytes
//     })
//     .test('fileType', 'Invalid document (allowed: JPG, PNG, PDF)', function(value) {
//       if (!value || !(value instanceof File)) return true; // Skip if not a file
//       return ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type);
//     })
// });

// const Step2Form: React.FC<Step2FormProps> = ({ onComplete, onBack, formData, isStepCompleted }) => {
//   const user = useSelector((state: RootState) => state.Auth.user);
//   const apiRepository = new ApiRepository();
//   const customerId = useSelector((state: RootState) => state.customer.customerData?.id);

//   // Automatically move to next step if data exists
//   useEffect(() => {
//     if (isStepCompleted && formData) {
//       console.log('Step 2 already completed, automatically moving to next step');
//       onComplete(formData as FormValues);
//     }
//   }, [isStepCompleted, formData, onComplete]);

//   const initialValues: FormValues = {
//     registrationNumber: formData?.registrationNumber || '',
//     issueDate: formData?.issueDate || '',
//     expiryDate: formData?.expiryDate || '',
//     document: formData?.document || null
//   };

//   const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
//     try {
//       // If the step is already completed, skip the API call
//       if (isStepCompleted) {
//         console.log('Step 2 already completed, skipping API request');
//         onComplete(values);
//         return;
//       }

//       if (!user?.userId ) {
//         console.error('Missing user ID or customer ID');
//         return;
//       }

//       const formdata = new FormData();
      
//       // Add all form fields to FormData
//       Object.entries(values).forEach(([key, value]) => {
//         if (value !== null && value !== undefined) {
//           if (value instanceof File) {
//             formdata.append(key, value);
//           } else {
//             formdata.append(key, value);
//           }
//         }
//       });

//       formdata.append('maincustomerid', customerId?.toString() || '');

//       await apiRepository.create(
//         EndPoints.maincustomeraddregisterdata(user.userId),
//         formdata,
//         SetCommercialRegistration
//       );
//       onComplete(values);
//     } catch (error) {
//       console.error('Error saving commercial registration data:', error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={validationSchema}
//       onSubmit={handleSubmit}
//       enableReinitialize
//       validationContext={{ customerId }}
//     >
//       {({ errors, touched, isSubmitting, setFieldValue }) => (
//         <Form className="space-y-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             Commercial Registration
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
//                 Registration Number
//               </label>
//               <Field
//                 as={Input}
//                 id="registrationNumber"
//                 name="registrationNumber"
//                 className="p-2 outline-none"
//                 error={touched.registrationNumber && errors.registrationNumber ? errors.registrationNumber : undefined}
//               />
//               <ErrorMessage name="registrationNumber" component="div" className="mt-1 text-sm text-red-600" />
//             </div>

//             <div>
//               <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1">
//                 Issue Date
//               </label>
//               <Field name="issueDate">
//                 {({ field }: FieldProps) => (
//                   <DatePicker
//                     id="issueDate"
//                     className="p-2 outline-none"
//                     value={field.value}
//                     onChange={(date: string) => setFieldValue('issueDate', date)}
//                     error={touched.issueDate && errors.issueDate ? errors.issueDate : undefined}
//                   />
//                 )}
//               </Field>
//               <ErrorMessage name="issueDate" component="div" className="mt-1 text-sm text-red-600" />
//             </div>

//             <div>
//               <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
//                 Expiry Date
//               </label>
//               <Field name="expiryDate">
//                 {({ field }: FieldProps) => (
//                   <DatePicker
//                     id="expiryDate"
//                     className="p-2 outline-none"
//                     value={field.value}
//                     onChange={(date: string) => setFieldValue('expiryDate', date)}
//                     error={touched.expiryDate && errors.expiryDate ? errors.expiryDate : undefined}
//                   />
//                 )}
//               </Field>
//               <ErrorMessage name="expiryDate" component="div" className="mt-1 text-sm text-red-600" />
//             </div>
//           </div>

//           <div className="mt-6">
//             <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-1">
//               Commercial Registration Document
//             </label>
//             <Field name="document">
//               {() => (
//                 <FileUpload
//                   id="document"
//                   accept="image/*,.pdf"
//                   onChange={(file: File | null) => setFieldValue('document', file)}
//                   error={touched.document && errors.document ? errors.document : undefined}
//                 />
//               )}
//             </Field>
//             <ErrorMessage name="document" component="div" className="mt-1 text-sm text-red-600" />
//           </div>

//           <div className="flex justify-between pt-4">
//             <Button type="button" variant="outline" onClick={onBack}>
//               Back
//             </Button>
//             <Button type="submit" size="lg" disabled={isSubmitting}>
//               {isSubmitting ? 'Loading...' : 'Next'}
//             </Button>
//           </div>
//         </Form>)}
//     </Formik>
//   );
// };
// export default Step2Form;


import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers, FieldProps } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Store/Store';
import { ApiRepository } from '../../../Api/ApiRepository';
import { EndPoints } from '../../../Api/EndPoints';
import { SetCommercialRegistration } from '../../../Store/DashBoardSlice/CustomerInfoSlice';
import { useTranslation } from 'react-i18next';

import Button from '../../ui/Button';
import Input from '../../ui/Input';
import DatePicker from '../../ui/DatePicker';
import FileUpload from '../../ui/FileUpload';

interface Step2FormProps {
  onComplete: (data: FormValues) => void;
  onBack: () => void;
  formData?: Partial<FormValues>;
  isStepCompleted?: boolean;
}

interface FormValues {
  registrationNumber: string;
  issueDate: string;
  expiryDate: string;
  document: File | null;
}

const validationSchema = Yup.object({
  registrationNumber: Yup.string().required('step2Form.errors.registrationNumber_required'),
  issueDate: Yup.string().required('step2Form.errors.issueDate_required'),
  expiryDate: Yup.string()
    .required('step2Form.errors.expiryDate_required')
    .test('expiry', 'step2Form.errors.expiryDate_expired', function(value) {
      if (!value) return false;
      const expiryDate = new Date(value);
      const today = new Date();
      return expiryDate > today;
    }),
  document: Yup.mixed()
    .test('fileRequired', 'step2Form.errors.document_required', function(value) {
      const customerId = this.parent.customerId || this.options.context?.customerId;
      if (customerId) return true;
      return value instanceof File;
    })
    .test('fileSize', 'step2Form.errors.document_size', function(value) {
      if (!value || !(value instanceof File)) return true;
      return value.size <= 5 * 1024 * 1024; // 5MB in bytes
    })
    .test('fileType', 'step2Form.errors.document_type', function(value) {
      if (!value || !(value instanceof File)) return true;
      return ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type);
    })
});

const Step2Form: React.FC<Step2FormProps> = ({ onComplete, onBack, formData, isStepCompleted }) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.Auth.user);
  const apiRepository = new ApiRepository();
  const customerId = useSelector((state: RootState) => state.customer.customerData?.id);

  // Automatically move to next step if data exists
  useEffect(() => {
    if (isStepCompleted && formData) {
      console.log('Step 2 already completed, automatically moving to next step');
      onComplete(formData as FormValues);
    }
  }, [isStepCompleted, formData, onComplete]);

  const initialValues: FormValues = {
    registrationNumber: formData?.registrationNumber || '',
    issueDate: formData?.issueDate || '',
    expiryDate: formData?.expiryDate || '',
    document: formData?.document || null
  };

  const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    try {
      // If the step is already completed, skip the API call
      if (isStepCompleted) {
        console.log('Step 2 already completed, skipping API request');
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
        EndPoints.maincustomeraddregisterdata(user.userId),
        formdata,
        SetCommercialRegistration
      );
      onComplete(values);
    } catch (error) {
      console.error('Error saving commercial registration data:', error);
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
            {t('step2Form.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step2Form.registrationNumber_label')}
              </label>
              <Field
                as={Input}
                id="registrationNumber"
                name="registrationNumber"
                className="p-2 outline-none"
                error={touched.registrationNumber && errors.registrationNumber ? t(errors.registrationNumber) : undefined}
              />
              <ErrorMessage name="registrationNumber" component="div" className="mt-1 text-sm text-red-600">
                {(msg) => <div>{t(msg)}</div>}
              </ErrorMessage>
            </div>

            <div>
              <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step2Form.issueDate_label')}
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
              <ErrorMessage name="issueDate" component="div" className="mt-1 text-sm text-red-600">
                {(msg) => <div>{t(msg)}</div>}
              </ErrorMessage>
            </div>

            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                {t('step2Form.expiryDate_label')}
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
              <ErrorMessage name="expiryDate" component="div" className="mt-1 text-sm text-red-600">
                {(msg) => <div>{t(msg)}</div>}
              </ErrorMessage>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-1">
              {t('step2Form.document_label')}
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
            <ErrorMessage name="document" component="div" className="mt-1 text-sm text-red-600">
              {(msg) => <div>{t(msg)}</div>}
            </ErrorMessage>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              {t('step2Form.back')}
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

export default Step2Form;