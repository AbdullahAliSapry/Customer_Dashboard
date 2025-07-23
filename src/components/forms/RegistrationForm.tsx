import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Store/Store';
import { SetStep } from '../../Store/DashBoardSlice/CustomerInfoSlice';
import { useTranslation } from 'react-i18next';

import Step1Form from './registration/Step1Form';
import Step2Form from './registration/Step2Form'; 
import Step3Form from './registration/Step3Form';
import Step4Form from './registration/Step4Form';
import Step5Form from './registration/Step5Form';

// Define enums here to match those in Step1Form
enum Nationality {
  Saudi = 'Saudi',
  NonSaudi = 'NonSaudi'
}

enum DocumentType {
  CommercialRegistration = 'CommercialRegistration',
  FreelancerLicense = 'FreelancerLicense'
}

interface RegistrationFormProps {
  step: number;
}

// Define the form data types to match what's in the store
interface RegistrationFormData {
  // Step 1 data
  location?: string;
  nationality?: number;
  documentType?: number;
  nationalAddress?: string;
  isFreelancer?: boolean;
  birthDate?: string;
  idIssueDate?: string;
  idExpiryDate?: string;
  imageIdentity?: File | null;
  imageNationalAddress?: File | null;
  identityImageUrl?: string;
  imageNationalAddressUrl?: string;

  // Step 2 data (Commercial Registration)
  registrationNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  document?: File | null;

  // Step 3 data (Freelancer License)
  numberIdentity?: string;
  licenseNumber?: string;
  licensedActivity?: string;
  licenseIssueDate?: string;
  licenseExpiryDate?: string;
  image?: File | null;

  // Step 4 data (Bank Account)
  businessName?: string;
  accountNumber?: string;
  iban?: string;
  swiftCode?: string;
  country?: string;
  bankName?: string;
  bankCertificate?: File | null;

  // Step 5 data (Tax Details)
  hasTaxDeclaration?: boolean;
  taxNumber?: string;
  imageTax?: File | null;
  exemptionReasonDocument?: File | null;
}

// Type definitions for each step's form data
interface Step1FormData {
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
}

interface Step2FormData {
  registrationNumber: string;
  issueDate: string;
  expiryDate: string;
  document: File | null;
}

interface Step3FormData {
  numberIdentity: string;
  licenseNumber: string;
  licensedActivity: string;
  issueDate: string;
  expiryDate: string;
  document: File | null;
}

interface Step4FormData {
  businessName: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  country: string;
  bankName: string;
  bankCertificate: File | null;
}

interface Step5FormData {
  hasTaxDeclaration: boolean;
  taxNumber: string;
  imageTax: File | null;
  exemptionReasonDocument: File | null;
}

// Helper function to format dates
const formatDate = (date: string | Date | undefined | null): string => {
  if (!date) return '';
  if (typeof date === 'string') {
    // Handle ISO date string
    return date.substring(0, 10);
  }
  if (date instanceof Date) {
    return date.toISOString().substring(0, 10);
  }
  return '';
};

const RegistrationForm: React.FC<RegistrationFormProps> = ({ step }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(step);
  const [formData, setFormData] = useState<RegistrationFormData>({});
  const customerData = useSelector((state: RootState) => state.customer.customerData);
  const totalSteps = 5;
  console.log(t('registrationForm.customer_data'), customerData);
  // Check if a specific step is completed based on customerData
  const isStepCompleted = useCallback((stepNumber: number): boolean => {
    if (!customerData) return false;

    switch(stepNumber) {
      case 1:
        // Step 1: Basic Information
        return !!(
          customerData.location &&
          (customerData.nationality !== null && customerData.nationality !== undefined) &&
          (customerData.documentType !== null && customerData.documentType !== undefined) &&
          customerData.nationalAddress &&
          customerData.isFreelancer !== null &&
          customerData.birthDate &&
          customerData.idIssueDate &&
          customerData.idExpiryDate
        );
      case 2:
        // Step 2: Commercial Registration (only required for non-freelancers)
        if (customerData.isFreelancer === false) {
          return !!customerData.commercialRegistration;
        } else if (customerData.isFreelancer === true) {
          // Skip step 2 for freelancers, but don't mark it complete automatically
          return false;
        }
        return false;
      case 3:
        // Step 3: Freelancer License (only required for freelancers)
        if (customerData.isFreelancer === true) {
          return !!customerData.freelancerLicense;
        } else if (customerData.isFreelancer === false) {
          // Skip step 3 for non-freelancers, but don't mark it complete automatically
          return false;
        }
        return false;
      case 4:
        // Step 4: Bank Account
        return !!customerData.bankAccount;
      case 5:
        // Step 5: Tax Details
        return !!customerData.taxDetails;
      default:
        return false;
    }
  }, [customerData]);

  // Update current step when prop changes
  useEffect(() => {
    console.log(t('registrationForm.step_changed', { step }));
    setCurrentStep(step);
    // Remove dispatch to prevent infinite loop
    // dispatch(SetStep(step));
  }, [step, t]);

  // Define a union type for all form values
  type AllFormValues = Step1FormData | Step2FormData | Step3FormData | Step4FormData | Step5FormData;
  
  const handleStepComplete = (stepData: AllFormValues) => {
    console.log(t('registrationForm.step_completed'), stepData);
    
    // Only update form data if it's different from current data
    const hasChanges = Object.keys(stepData).some(key => {
      const currentValue = formData[key as keyof typeof formData];
      const newValue = stepData[key as keyof typeof stepData];
      
      // Special handling for File objects
      if (currentValue instanceof File && newValue instanceof File) {
        return currentValue.name !== newValue.name || currentValue.size !== newValue.size;
      }
      
      return JSON.stringify(currentValue) !== JSON.stringify(newValue);
    });
    
    if (hasChanges) {
      setFormData(prev => ({ ...prev, ...stepData }));
    }
    
    if (currentStep < totalSteps) {
      let newStep = currentStep + 1;
      
      // Skip Step 2 for freelancers
      if (currentStep === 1 && formData.isFreelancer === true && newStep === 2) {
        newStep = 3;
      }
      
      // Skip Step 3 for non-freelancers
      if (currentStep === 2 && formData.isFreelancer === false && newStep === 3) {
        newStep = 4;
      }
      
      // Only update step if it's different and not already in progress
      if (newStep !== currentStep && !formData.isSubmitting) {
        setCurrentStep(newStep);
        dispatch(SetStep(newStep));
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      let newStep = currentStep - 1;
      
      // Skip Step 3 when going back for non-freelancers
      if (currentStep === 4 && formData.isFreelancer === false && newStep === 3) {
        newStep = 2;
      }
      
      // Skip Step 2 when going back for freelancers
      if (currentStep === 3 && formData.isFreelancer === true && newStep === 2) {
        newStep = 1;
      }
      
      setCurrentStep(newStep);
      
      // Dispatch step change only when the user navigates back
      dispatch(SetStep(newStep));
    }
  };

  // Create appropriate form data for each step based on the form requirements
  const getStep1Data = (): Step1FormData => {
    return {
      location: customerData?.location || '',
      nationality: (typeof customerData?.nationality === 'number' ? customerData?.nationality : Nationality.Saudi) as number,
      documentType: (typeof customerData?.documentType === 'number' ? customerData?.documentType : DocumentType.CommercialRegistration) as number,
      nationalAddress: customerData?.nationalAddress || '',
      isFreelancer: customerData?.isFreelancer === true,
      birthDate: formatDate(customerData?.birthDate) || '',
      idIssueDate: formatDate(customerData?.idIssueDate) || '',
      idExpiryDate: formatDate(customerData?.idExpiryDate) || '',
      imageIdentity: null,
      imageNationalAddress: null,
      identityImageUrl: customerData?.imageIdentity?.url || '',
      imageNationalAddressUrl: customerData?.imageNationalAddress?.url || ''
    };
  };

  const getStep2Data = (): Step2FormData => {
    return {
      registrationNumber: formData.registrationNumber || '',
      issueDate: formData.issueDate || '',
      expiryDate: formData.expiryDate || '',
      document: formData.document || null
    };
  };

  const getStep3Data = (): Step3FormData => {
    return {
      numberIdentity: customerData?.freelancerLicense?.numberIdentity || '',
      licenseNumber: customerData?.freelancerLicense?.licenseNumber || '',
      licensedActivity: customerData?.freelancerLicense?.licensedActivity || '',
      issueDate: customerData?.freelancerLicense?.issueDate || '',
      expiryDate: customerData?.freelancerLicense?.expiryDate || '',
      document: null // We don't load existing image file, only URL reference would be available
    };
  };

  const getStep4Data = (): Step4FormData => {
    return {
      businessName: formData.businessName || '',
      accountNumber: formData.accountNumber || '',
      iban: formData.iban || '',
      swiftCode: formData.swiftCode || '',
      country: formData.country || '',
      bankName: formData.bankName || '',
      bankCertificate: formData.bankCertificate || null
    };
  };

  const getStep5Data = (): Step5FormData => {
    return {
      hasTaxDeclaration: formData.hasTaxDeclaration || false,
      taxNumber: formData.taxNumber || '',
      imageTax: formData.imageTax || null,
      exemptionReasonDocument: formData.exemptionReasonDocument || null
    };
  };

  const renderStepContent = () => {
    console.log(t('registrationForm.rendering_step', { step: currentStep }));
    switch (currentStep) {
      case 1:
        return <Step1Form 
          onComplete={handleStepComplete} 
          formData={getStep1Data()} 
          isStepCompleted={isStepCompleted(1)} 
        />;
      case 2:
        // Only show step 2 for non-freelancers, otherwise redirect to step 3
        if (formData.isFreelancer === true) {
          // Redirect to step 3 if the user is a freelancer
          setTimeout(() => {
            setCurrentStep(3);
            dispatch(SetStep(3));
          }, 0);
          return <div>{t('registrationForm.redirecting')}</div>;
        }
        return <Step2Form 
          onComplete={handleStepComplete} 
          formData={getStep2Data()} 
          onBack={handlePrevStep} 
          isStepCompleted={isStepCompleted(2)}
        />;
      case 3:
        // Only show step 3 for freelancers, otherwise redirect to step 4
        if (formData.isFreelancer === false) {
          // Redirect to step 4 if the user is not a freelancer
          setTimeout(() => {
            setCurrentStep(4);
            dispatch(SetStep(4));
          }, 0);
          return <div>{t('registrationForm.redirecting')}</div>;
        }
        return <Step3Form 
          onComplete={handleStepComplete} 
          formData={getStep3Data()} 
          onBack={handlePrevStep}
          isStepCompleted={isStepCompleted(3)}
        />;
      case 4:
        return <Step4Form 
          onComplete={handleStepComplete} 
          formData={getStep4Data()} 
          onBack={handlePrevStep}
          isStepCompleted={isStepCompleted(4)}
        />;
      case 5:
        return <Step5Form 
          onComplete={handleStepComplete} 
          formData={getStep5Data()} 
          onBack={handlePrevStep}
          isStepCompleted={isStepCompleted(5)}
        />;
      default:
        return <Step1Form 
          onComplete={handleStepComplete} 
          formData={getStep1Data()}
          isStepCompleted={isStepCompleted(1)}
        />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto">
      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }, (_, i) => {
            // Skip showing step 2 for freelancers
            if (i+1 === 2 && formData.isFreelancer === true) {
              return null;
            }
            
            // Skip showing step 3 for non-freelancers
            if (i+1 === 3 && formData.isFreelancer === false) {
              return null;
            }
            
            return (
              <div key={i} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  i + 1 < currentStep 
                    ? 'bg-primary-600 text-white' 
                    : i + 1 === currentStep
                      ? 'bg-primary-100 text-primary-600 border border-primary-600' 
                      : isStepCompleted(i + 1) // Highlight completed steps
                        ? 'bg-green-100 text-green-600 border border-green-600'
                        : 'bg-gray-100 text-gray-400'
                }`}>
                  {(i + 1 < currentStep || isStepCompleted(i + 1)) ? (
                    <CheckCircle size={16} className={i + 1 < currentStep ? 'text-white' : 'text-green-600'} />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`h-1 w-12 md:w-24 ${
                    i + 1 < currentStep || isStepCompleted(i + 1)
                      ? 'bg-primary-600' 
                      : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            );
          }).filter(Boolean)}
        </div>
      </div>

      {/* Step content */}
      <div className="py-4">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default RegistrationForm;