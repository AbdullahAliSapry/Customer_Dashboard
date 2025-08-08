// import React, { useEffect } from 'react';
// import { Formik, Form, Field, ErrorMessage, FormikHelpers, FieldProps } from 'formik';
// import * as Yup from 'yup';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../Store/Store';
// import { ApiRepository } from '../../../Api/ApiRepository';
// import { EndPoints } from '../../../Api/EndPoints';
// import { SetTaxDetails } from '../../../Store/DashBoardSlice/CustomerInfoSlice';

// import Button from '../../ui/Button';
// import Input from '../../ui/Input';
// import Checkbox from '../../ui/Checkbox';
// import FileUpload from '../../ui/FileUpload';

// interface Step5FormProps {
//   onComplete: (data: FormValues) => void;
//   onBack: () => void;
//   formData?: Partial<FormValues>;
//   isStepCompleted?: boolean;
// }

// interface FormValues {
//   hasTaxDeclaration: boolean;
//   taxNumber: string;
//   imageTax: File | null;
//   exemptionReasonDocument: File | null;
// }

// const validationSchema = Yup.object({
//   hasTaxDeclaration: Yup.boolean().required(),
//   taxNumber: Yup.string().when('hasTaxDeclaration', {
//     is: true,
//     then: (schema) => schema.required('Tax number is required when tax declaration is checked'),
//     otherwise: (schema) => schema.notRequired()
//   }),
//   imageTax: Yup.mixed().when('hasTaxDeclaration', {
//     is: true,
//     then: (schema) => schema
//       .required('Tax document is required when tax declaration is checked')
//       .test('fileSize', 'File size must be less than 5MB', function(value) {
//         if (!value || !(value instanceof File)) return false;
//         return value.size <= 5 * 1024 * 1024; // 5MB in bytes
//       })
//       .test('fileType', 'Invalid document (allowed: JPG, PNG, PDF)', function(value) {
//         if (!value || !(value instanceof File)) return false;
//         return ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type);
//       }),
//     otherwise: (schema) => schema.notRequired()
//   }),
//   exemptionReasonDocument: Yup.mixed().when('hasTaxDeclaration', {
//     is: false,
//     then: (schema) => schema
//       .required('Exemption reason document is required when tax declaration is not checked')
//       .test('fileSize', 'File size must be less than 5MB', function(value) {
//         if (!value || !(value instanceof File)) return false;
//         return value.size <= 5 * 1024 * 1024; // 5MB in bytes
//       })
//       .test('fileType', 'Invalid document (allowed: JPG, PNG, PDF)', function(value) {
//         if (!value || !(value instanceof File)) return false;
//         return ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type);
//       }),
//     otherwise: (schema) => schema.notRequired()
//   })
// });

// const Step5Form: React.FC<Step5FormProps> = ({ onComplete, onBack, formData, isStepCompleted }) => {
//   const user = useSelector((state: RootState) => state.Auth.user);
//   const apiRepository = new ApiRepository();
//   const customerData = useSelector((state: RootState) => state.customer.customerData);

//   // Automatically move to next step if data exists
//   useEffect(() => {
//     if (isStepCompleted && formData) {
//       console.log('Step 5 already completed, automatically moving to next step');
//       onComplete(formData as FormValues);
//     }
//   }, [isStepCompleted, formData, onComplete]);

//   const initialValues: FormValues = {
//     hasTaxDeclaration: formData?.hasTaxDeclaration || false,
//     taxNumber: formData?.taxNumber || '',
//     imageTax: formData?.imageTax || null,
//     exemptionReasonDocument: formData?.exemptionReasonDocument || null
//   };

//   const handleSubmit = async (values: FormValues, { setSubmitting, setErrors }: FormikHelpers<FormValues>) => {
//     try {
//       // If the step is already completed, skip the API call
//       if (isStepCompleted) {
//         console.log('Step 5 already completed, skipping API request');
//         onComplete(values);
//         return;
//       }

//       if (!user?.userId || !customerData?.id) {
//         console.error('Missing user ID or customer ID');
//         return;
//       }

//       // Validate tax number is present when declaration is checked
//       if (values.hasTaxDeclaration && !values.taxNumber) {
//         setErrors({ taxNumber: 'Tax number is required' });
//         return;
//       }

//       const formdata = new FormData();
      
//       // Add all form fields to FormData with proper capitalization to match C# DTO properties
//       formdata.append('HasTaxDeclaration', values.hasTaxDeclaration.toString());
      
//       if (values.hasTaxDeclaration) {
//         // Always append the tax number when tax declaration is true
//         formdata.append('TaxNumber', values.taxNumber);
        
//         if (values.imageTax) {
//           formdata.append('ImageTax', values.imageTax);
//         } else {
//           setErrors({ imageTax: 'Tax document is required' });
//           return;
//         }
//       } else {
//         if (values.exemptionReasonDocument) {
//           formdata.append('ExemptionReasonDocument', values.exemptionReasonDocument);
//         } else {
//           setErrors({ exemptionReasonDocument: 'Exemption reason document is required' });
//           return;
//         }
//       }

//       formdata.append('MainCustomerId', customerData.id.toString());

//       console.log('Submitting tax data:', {
//         hasDeclaration: values.hasTaxDeclaration,
//         taxNumber: values.taxNumber,
//         hasImageTax: !!values.imageTax,
//         hasExemptionDoc: !!values.exemptionReasonDocument,
//         customerId: customerData.id
//       });

//       try {
//         await apiRepository.create(
//           EndPoints.maincustomeraddtaxdata(user.userId),
//           formdata,
//           SetTaxDetails
//         );
//         onComplete(values);
//       } catch (apiError) {
//         console.error('API Error:', apiError);
//         // Handle API errors here if needed
//       }
//     } catch (error) {
//       console.error('Error saving tax data:', error);
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
//     >
//       {({ errors, touched, isSubmitting, setFieldValue, values }) => (
//         <Form className="space-y-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">
//             Tax Information
//           </h2>

//           <div className="space-y-6">
//             <div>
//               <Field name="hasTaxDeclaration">
//                 {({ field }: FieldProps) => (
//                   <Checkbox
//                     id="hasTaxDeclaration"
//                     label="I have a tax declaration"
//                     checked={field.value}
//                     onChange={(checked: boolean) => setFieldValue('hasTaxDeclaration', checked)}
//                   />
//                 )}
//               </Field>
//               <ErrorMessage name="hasTaxDeclaration" component="div" className="mt-1 text-sm text-red-600" />
//             </div>

//             {values.hasTaxDeclaration ? (
//               <>
//                 <div>
//                   <label htmlFor="taxNumber" className="block text-sm font-medium text-gray-700 mb-1">
//                     Tax Number
//                   </label>
//                   <Field
//                     as={Input}
//                     id="taxNumber"
//                     name="taxNumber"
//                     className="p-2 outline-none"
//                     error={touched.taxNumber && errors.taxNumber ? errors.taxNumber : undefined}
//                   />
//                   <ErrorMessage name="taxNumber" component="div" className="mt-1 text-sm text-red-600" />
//                 </div>

//                 <div>
//                   <label htmlFor="imageTax" className="block text-sm font-medium text-gray-700 mb-1">
//                     Tax Document
//                   </label>
//                   <Field name="imageTax">
//                     {() => (
//                       <FileUpload
//                         id="imageTax"
//                         accept="image/*,.pdf"
//                         onChange={(file: File | null) => setFieldValue('imageTax', file)}
//                         error={touched.imageTax && errors.imageTax ? errors.imageTax : undefined}
//                       />
//                     )}
//                   </Field>
//                   <ErrorMessage name="imageTax" component="div" className="mt-1 text-sm text-red-600" />
//                 </div>
//               </>
//             ) : (
//               <div>
//                 <label htmlFor="exemptionReasonDocument" className="block text-sm font-medium text-gray-700 mb-1">
//                   Exemption Reason Document
//                 </label>
//                 <Field name="exemptionReasonDocument">
//                   {() => (
//                     <FileUpload
//                       id="exemptionReasonDocument"
//                       accept="image/*,.pdf"
//                       onChange={(file: File | null) => setFieldValue('exemptionReasonDocument', file)}
//                       error={touched.exemptionReasonDocument && errors.exemptionReasonDocument ? errors.exemptionReasonDocument : undefined}
//                     />
//                   )}
//                 </Field>
//                 <ErrorMessage name="exemptionReasonDocument" component="div" className="mt-1 text-sm text-red-600" />
//               </div>
//             )}
//           </div>

//           <div className="flex justify-between pt-4">
//             <Button type="button" variant="outline" onClick={onBack}>
//               Back
//             </Button>
//             <Button type="submit" size="lg" disabled={isSubmitting}>
//               {isSubmitting ? 'Loading...' : 'Submit'}
//             </Button>
//           </div>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default Step5Form;


import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers, FieldProps } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Store/Store';
import { ApiRepository } from '../../../Api/ApiRepository';
import { EndPoints } from '../../../Api/EndPoints';
import { SetTaxDetails } from '../../../Store/DashBoardSlice/CustomerInfoSlice';
import { useTranslation } from 'react-i18next';

import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Checkbox from '../../ui/Checkbox';
import FileUpload from '../../ui/FileUpload';

interface Step5FormProps {
  onComplete: (data: FormValues) => void;
  onBack: () => void;
  formData?: Partial<FormValues>;
  isStepCompleted?: boolean;
}

interface FormValues {
  hasTaxDeclaration: boolean;
  taxNumber: string;
  imageTax: File | null;
  exemptionReasonDocument: File | null;
}

const validationSchema = Yup.object({
  hasTaxDeclaration: Yup.boolean().required('step5Form.errors.hasTaxDeclaration_required'),
  taxNumber: Yup.string().when('hasTaxDeclaration', {
    is: true,
    then: (schema) => schema.required('step5Form.errors.taxNumber_required'),
    otherwise: (schema) => schema.notRequired()
  }),
  imageTax: Yup.mixed().when('hasTaxDeclaration', {
    is: true,
    then: (schema) => schema
      .required('step5Form.errors.imageTax_required')
      .test('fileSize', 'step5Form.errors.imageTax_size', function(value) {
        if (!value || !(value instanceof File)) return false;
        return value.size <= 5 * 1024 * 1024; // 5MB in bytes
      })
      .test('fileType', 'step5Form.errors.imageTax_type', function(value) {
        if (!value || !(value instanceof File)) return false;
        return ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type);
      }),
    otherwise: (schema) => schema.notRequired()
  }),
  exemptionReasonDocument: Yup.mixed().when('hasTaxDeclaration', {
    is: false,
    then: (schema) => schema
      .required('step5Form.errors.exemptionReasonDocument_required')
      .test('fileSize', 'step5Form.errors.exemptionReasonDocument_size', function(value) {
        if (!value || !(value instanceof File)) return false;
        return value.size <= 5 * 1024 * 1024; // 5MB in bytes
      })
      .test('fileType', 'step5Form.errors.exemptionReasonDocument_type', function(value) {
        if (!value || !(value instanceof File)) return false;
        return ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type);
      }),
    otherwise: (schema) => schema.notRequired()
  })
});

const Step5Form: React.FC<Step5FormProps> = ({ onComplete, onBack, formData, isStepCompleted }) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.Auth.user);
  const apiRepository = new ApiRepository();
  const customerData = useSelector((state: RootState) => state.customer.customerData);

  // Automatically move to next step if data exists
  useEffect(() => {
    if (isStepCompleted && formData) {
      console.log('Step 5 already completed, automatically moving to next step');
      onComplete(formData as FormValues);
    }
  }, [isStepCompleted, formData, onComplete]);

  const initialValues: FormValues = {
    hasTaxDeclaration: formData?.hasTaxDeclaration || false,
    taxNumber: formData?.taxNumber || '',
    imageTax: formData?.imageTax || null,
    exemptionReasonDocument: formData?.exemptionReasonDocument || null
  };

  const handleSubmit = async (values: FormValues, { setSubmitting, setErrors }: FormikHelpers<FormValues>) => {
    try {
      // If the step is already completed, skip the API call
      if (isStepCompleted) {
        console.log('Step 5 already completed, skipping API request');
        onComplete(values);
        return;
      }

      if (!user?.userId || !customerData?.id) {
        console.error('Missing user ID or customer ID');
        return;
      }

      // Validate tax number is present when declaration is checked
      if (values.hasTaxDeclaration && !values.taxNumber) {
        setErrors({ taxNumber: t('step5Form.errors.taxNumber_required') });
        return;
      }

      const formdata = new FormData();
      
      // Add all form fields to FormData with proper capitalization to match C# DTO properties
      formdata.append('HasTaxDeclaration', values.hasTaxDeclaration.toString());
      
      if (values.hasTaxDeclaration) {
        // Always append the tax number when tax declaration is true
        formdata.append('TaxNumber', values.taxNumber);
        
        if (values.imageTax) {
          formdata.append('ImageTax', values.imageTax);
        } else {
          setErrors({ imageTax: t('step5Form.errors.imageTax_required') });
          return;
        }
      } else {
        if (values.exemptionReasonDocument) {
          formdata.append('ExemptionReasonDocument', values.exemptionReasonDocument);
        } else {
          setErrors({ exemptionReasonDocument: t('step5Form.errors.exemptionReasonDocument_required') });
          return;
        }
      }

      formdata.append('MainCustomerId', customerData.id.toString());

      console.log('Submitting tax data:', {
        hasDeclaration: values.hasTaxDeclaration,
        taxNumber: values.taxNumber,
        hasImageTax: !!values.imageTax,
        hasExemptionDoc: !!values.exemptionReasonDocument,
        customerId: customerData.id
      });

      try {
        await apiRepository.create(
          EndPoints.maincustomeraddtaxdata(user.userId),
          formdata,
          SetTaxDetails
        );
        onComplete(values);
      } catch (apiError) {
        console.error('API Error:', apiError);
        // Handle API errors here if needed
      }
    } catch (error) {
      console.error('Error saving tax data:', error);
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
      {({ errors, touched, isSubmitting, setFieldValue, values }) => (
        <Form className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t('step5Form.title')}
          </h2>

          <div className="space-y-6">
            <div>
              <Field name="hasTaxDeclaration">
                {({ field }: FieldProps) => (
                  <Checkbox
                    id="hasTaxDeclaration"
                    label={t('step5Form.hasTaxDeclaration_label')}
                    checked={field.value}
                    onChange={(checked: boolean) => setFieldValue('hasTaxDeclaration', checked)}
                  />
                )}
              </Field>
              <ErrorMessage name="hasTaxDeclaration" component="div" className="mt-1 text-sm text-red-600">
                {(msg) => <div>{t(msg)}</div>}
              </ErrorMessage>
            </div>

            {values.hasTaxDeclaration ? (
              <>
                <div>
                  <label htmlFor="taxNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('step5Form.taxNumber_label')}
                  </label>
                  <Field
                    as={Input}
                    id="taxNumber"
                    name="taxNumber"
                    className="p-2 outline-none"
                    error={touched.taxNumber && errors.taxNumber ? t(errors.taxNumber) : undefined}
                  />
                  <ErrorMessage name="taxNumber" component="div" className="mt-1 text-sm text-red-600">
                    {(msg) => <div>{t(msg)}</div>}
                  </ErrorMessage>
                </div>

                <div>
                  <label htmlFor="imageTax" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('step5Form.imageTax_label')}
                  </label>
                  <Field name="imageTax">
                    {() => (
                      <FileUpload
                        id="imageTax"
                        accept="image/*,.pdf"
                        onChange={(file: File | null) => setFieldValue('imageTax', file)}
                        error={touched.imageTax && errors.imageTax ? t(errors.imageTax) : undefined}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="imageTax" component="div" className="mt-1 text-sm text-red-600">
                    {(msg) => <div>{t(msg)}</div>}
                  </ErrorMessage>
                </div>
              </>
            ) : (
              <div>
                <label htmlFor="exemptionReasonDocument" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('step5Form.exemptionReasonDocument_label')}
                </label>
                <Field name="exemptionReasonDocument">
                  {() => (
                    <FileUpload
                      id="exemptionReasonDocument"
                      accept="image/*,.pdf"
                      onChange={(file: File | null) => setFieldValue('exemptionReasonDocument', file)}
                      error={touched.exemptionReasonDocument && errors.exemptionReasonDocument ? t(errors.exemptionReasonDocument) : undefined}
                    />
                  )}
                </Field>
                <ErrorMessage name="exemptionReasonDocument" component="div" className="mt-1 text-sm text-red-600">
                  {(msg) => <div>{t(msg)}</div>}
                </ErrorMessage>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              {t('step5Form.back')}
            </Button>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? t('common.loading') : t('step5Form.submit')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Step5Form;