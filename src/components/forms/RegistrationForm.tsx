import React, { useState, useEffect, useCallback, useMemo } from "react";
import { CheckCircle, ChevronLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/Store";
import {
  SetCheckCustomerSteps,
  SetError,
} from "../../Store/DashBoardSlice/CustomerInfoSlice";
import { useTranslation } from "react-i18next";

import Step1Form from "./registration/Step1Form";
import Step2Form from "./registration/Step2Form";
import Step3Form from "./registration/Step3Form";
import Step4Form from "./registration/Step4Form";
import Step5Form from "./registration/Step5Form";
import Step6Form from "./registration/Step6Form";
import { ApiRepository } from "../../Api/ApiRepository";
import { EndPoints } from "../../Api/EndPoints";

interface RegistrationFormProps {
  step: number;
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

interface Step6FormData {
  managerName: string;
  managerContactNumber: string;
  managerBirthDate: string;
  managerIdIssueDate: string;
  managerIdExpiryDate: string;
  managerImageIdentity: File | null;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ step }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(step);
  const totalSteps = 6;

  const checkCustomerSteps = useSelector(
    (state: RootState) => state.customer.checkCustomerSteps
  );
  console.log(checkCustomerSteps);  
  const userId = useSelector((state: RootState) => state.Auth.user?.userId);

  const api = new ApiRepository();

  useEffect(() => {
    if (userId) {
      api.getById(
        EndPoints.checkCustomerSteps,
        userId,
        SetCheckCustomerSteps,
        SetError
      );
    }
  }, [userId]);

  const isStepCompleted = useCallback(
    (stepNumber: number): boolean => {
      if (!checkCustomerSteps) return false;

      switch (stepNumber) {
        case 1:
          return checkCustomerSteps.basicData;
        case 2:
          return checkCustomerSteps.commercialRegistration;
        case 3:
          return checkCustomerSteps.freelancerLicense;
        case 4:
          return checkCustomerSteps.bankAccount;
        case 5:
          return checkCustomerSteps.taxDetails;
        case 6:
          return checkCustomerSteps.managerDetails;
        default:
          return false;
      }
    },
    [checkCustomerSteps]
  );

  // Update current step when prop changes
  useEffect(() => {
    console.log("Step changed to:", step);
    setCurrentStep(step);
  }, [step]);

  // Define a union type for all form values
  type AllFormValues =
    | Step1FormData
    | Step2FormData
    | Step3FormData
    | Step4FormData
    | Step5FormData
    | Step6FormData;

  const handleStepComplete = (stepData: AllFormValues) => {
    console.log("Step completed:", stepData);

    // Move to next step
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
    }
  };

  // Create empty form data for each step
  const getStep1Data = (): Step1FormData => {
    return {
      location: "",
      nationality: 0, // Nationality.Saudi = 0
      documentType: 0, // DocumentType.CommercialRegistration = 0
      nationalAddress: "",
      isFreelancer: false,
      birthDate: "",
      idIssueDate: "",
      idExpiryDate: "",
      imageIdentity: null,
      imageNationalAddress: null,
      identityImageUrl: "",
      imageNationalAddressUrl: "",
    };
  };

  const getStep2Data = (): Step2FormData => {
    return {
      registrationNumber: "",
      issueDate: "",
      expiryDate: "",
      document: null,
    };
  };

  const getStep3Data = (): Step3FormData => {
    return {
      numberIdentity: "",
      licenseNumber: "",
      licensedActivity: "",
      issueDate: "",
      expiryDate: "",
      document: null,
    };
  };

  const getStep4Data = (): Step4FormData => {
    return {
      businessName: "",
      accountNumber: "",
      iban: "",
      swiftCode: "",
      country: "",
      bankName: "",
      bankCertificate: null,
    };
  };

  const getStep5Data = (): Step5FormData => {
    return {
      hasTaxDeclaration: false,
      taxNumber: "",
      imageTax: null,
      exemptionReasonDocument: null,
    };
  };

  const getStep6Data = (): Step6FormData => {
    return {
      managerName: "",
      managerContactNumber: "",
      managerBirthDate: "",
      managerIdIssueDate: "",
      managerIdExpiryDate: "",
      managerImageIdentity: null,
    };
  };

  const renderStepContent = () => {
    console.log(t("registrationForm.rendering_step", { step: currentStep }));
    switch (currentStep) {
      case 1:
        return (
          <Step1Form
            onComplete={handleStepComplete}
            formData={getStep1Data()}
            isStepCompleted={isStepCompleted(1)}
          />
        );
      case 2:
        return (
          <Step2Form
            onComplete={handleStepComplete}
            formData={getStep2Data()}
            onBack={handlePrevStep}
            isStepCompleted={isStepCompleted(2)}
          />
        );
      case 3:
        return (
          <Step3Form
            onComplete={handleStepComplete}
            formData={getStep3Data()}
            onBack={handlePrevStep}
            isStepCompleted={isStepCompleted(3)}
          />
        );
      case 4:
        return (
          <Step4Form
            onComplete={handleStepComplete}
            formData={getStep4Data()}
            onBack={handlePrevStep}
            isStepCompleted={isStepCompleted(4)}
          />
        );
      case 5:
        return (
          <Step5Form
            onComplete={handleStepComplete}
            formData={getStep5Data()}
            onBack={handlePrevStep}
            isStepCompleted={isStepCompleted(5)}
          />
        );
      case 6:
        return (
          <Step6Form
            onComplete={handleStepComplete}
            formData={getStep6Data()}
            onBack={handlePrevStep}
            isStepCompleted={isStepCompleted(6)}
          />
        );
      default:
        return (
          <Step1Form
            onComplete={handleStepComplete}
            formData={getStep1Data()}
            isStepCompleted={isStepCompleted(1)}
          />
        );
    }
  };

  // Get step titles for the stepper
  const getStepTitle = (stepNumber: number): string => {
    switch (stepNumber) {
      case 1:
        return t("step1Form.title");
      case 2:
        return t("step2Form.title");
      case 3:
        return t("step3Form.title");
      case 4:
        return t("step4Form.title");
      case 5:
        return t("step5Form.title");
      case 6:
        return t("step6Form.title");
      default:
        return "";
    }
  };

  // Show all steps - let checkCustomerSteps handle completion status
  const visibleSteps = useMemo(() => {
    return Array.from({ length: totalSteps }, (_, i) => i + 1);
  }, [totalSteps]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("registrationForm.title", "Complete Your Registration")}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t(
              "registrationForm.description",
              "Please complete all required steps to finish your registration process. This information will be used to verify your account and provide you with the best service."
            )}
          </p>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Enhanced Stepper */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {visibleSteps.map((stepNumber, index) => (
                <div key={stepNumber} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                        stepNumber < currentStep
                          ? "bg-primary-600 text-white shadow-lg"
                          : stepNumber === currentStep
                          ? "bg-white text-primary-600 border-4 border-primary-200 shadow-lg"
                          : isStepCompleted(stepNumber)
                          ? "bg-primary-100 text-primary-600 border-2 border-primary-500"
                          : "bg-gray-200 text-gray-400 border-2 border-gray-300"
                      }`}>
                      {stepNumber < currentStep ||
                      isStepCompleted(stepNumber) ? (
                        <CheckCircle
                          size={20}
                          className={
                            stepNumber < currentStep
                              ? "text-white"
                              : "text-primary-600"
                          }
                        />
                      ) : (
                        <span className="font-semibold text-sm">
                          {stepNumber}
                        </span>
                      )}
                    </div>

                    {/* Step Title */}
                    <div className="mt-3 text-center max-w-24">
                      <p
                        className={`text-xs font-medium transition-colors duration-300 ${
                          stepNumber <= currentStep
                            ? "text-white"
                            : "text-primary-200"
                        }`}>
                        {getStepTitle(stepNumber)}
                      </p>
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < visibleSteps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 transition-all duration-300 ${
                        stepNumber < currentStep || isStepCompleted(stepNumber)
                          ? "bg-primary-400"
                          : "bg-primary-300"
                      }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-100 h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-full transition-all duration-500 ease-out"
              style={{
                width: `${
                  ((currentStep - 1) / (visibleSteps.length - 1)) * 100
                }%`,
              }}></div>
          </div>

          {/* Step Content */}
          <div className="p-8">
            <div className="max-w-4xl mx-auto">{renderStepContent()}</div>
          </div>

          {/* Navigation Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex justify-between items-center max-w-4xl mx-auto">
              <div className="flex items-center space-x-4">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevStep}
                    className="flex items-center space-x-2 px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    <ChevronLeft size={18} />
                    <span className="font-medium">{t("common.back")}</span>
                  </button>
                )}
              </div>

              <div className="text-sm text-gray-500">
                {t(
                  "registrationForm.step_progress",
                  "Step {{current}} of {{total}}",
                  {
                    current: visibleSteps.indexOf(currentStep) + 1,
                    total: visibleSteps.length,
                  }
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("registrationForm.help.title", "Need Help?")}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-sm">
                    1
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {t(
                      "registrationForm.help.prepare_documents.title",
                      "Prepare Your Documents"
                    )}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t(
                      "registrationForm.help.prepare_documents.description",
                      "Make sure you have all required documents ready before starting the registration process."
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-sm">
                    2
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {t(
                      "registrationForm.help.save_progress.title",
                      "Save Your Progress"
                    )}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t(
                      "registrationForm.help.save_progress.description",
                      "Your progress is automatically saved. You can return to complete the registration at any time."
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
