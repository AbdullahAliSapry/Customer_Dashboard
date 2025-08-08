

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Store/Store";
import RegistrationForm from "../components/forms/RegistrationForm";
import { ApiRepository } from "../Api/ApiRepository";
import { EndPoints } from "../Api/EndPoints";
import { SetCustomerData, SetStep } from "../Store/DashBoardSlice/CustomerInfoSlice";
import { useTranslation } from 'react-i18next';

const IsCompletedRoute = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.Auth.user);
  const customerData = useSelector((state: RootState) => state.customer.customerData);
  const step = useSelector((state: RootState) => state.customer.step);
  const dispatch = useDispatch();
  const apiRepository = new ApiRepository();
  const [isLoading, setIsLoading] = useState(true);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // Fetch customer data only once when user changes
  useEffect(() => {
    console.log(user);
    const fetchCustomerData = async () => {
      if (!user?.userId) return;

      try {
        setIsLoading(true);
        await apiRepository.getAll(
          EndPoints.maincustomergetdata(user.userId), 
          SetCustomerData
        );
      } catch (error) {
        console.error(t('registration.error_fetching_customer_data'), error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, [user?.userId, t]); // apiRepository removed to prevent re-renders

  // Check if a specific step is completed
  const isStepCompleted = (stepNumber: number): boolean => {
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
        // Step 2: Commercial Registration (for non-freelancers)
        return customerData.isFreelancer === true || !!customerData.commercialRegistration;
      case 3:
        // Step 3: Freelancer License (for freelancers)
        return customerData.isFreelancer === false || !!customerData.freelancerLicense;
      case 4:
        // Step 4: Bank Account
        return !!customerData.bankAccount;
      case 5:
        // Step 5: Tax Details
        return !!customerData.taxDetails;
      case 6:
        // Step 6: Manager Details
        return !!customerData.managerDetails;
      default:
        return false;
    }
  };

  // Find the first incomplete step
  const findFirstIncompleteStep = (): number => {
    for (let i = 1; i <= 6; i++) {
      if (!isStepCompleted(i)) {
        return i;
      }
    }
    return 1; // Default to first step if all complete
  };

  // Determine registration step when customerData changes
  useEffect(() => {
    if (isLoading) return;

    if (!customerData) {
      // If no customer data, default to step 1
      if (step !== 1) {
        dispatch(SetStep(1));
      }
      setRegistrationComplete(false);
      return;
    }

    const isComplete = checkRegistrationComplete();
    if (isComplete) {
      setRegistrationComplete(true);
      return;
    }

    setRegistrationComplete(false);
    
    // Find the first step that needs to be completed
    const nextStep = findFirstIncompleteStep();
    
    // Only dispatch if step has changed
    if (step !== nextStep) {
      dispatch(SetStep(nextStep));
    }
  }, [customerData, isLoading, step, dispatch]);

  // Check if all required fields are filled
  const checkRegistrationComplete = () => {
    if (isLoading || !customerData) return false;

    // Check basic information
    const hasBasicInfo = !!(
      customerData.location &&
      (customerData.nationality !== null && customerData.nationality !== undefined) &&
      (customerData.documentType !== null && customerData.documentType !== undefined) &&
      customerData.nationalAddress &&
      customerData.isFreelancer !== null &&
      customerData.birthDate &&
      customerData.idIssueDate &&
      customerData.idExpiryDate
    );

    if (!hasBasicInfo) return false;

    // Check for document based on user type
    const hasDocument = customerData.isFreelancer === true ? 
      !!customerData.freelancerLicense : 
      !!customerData.commercialRegistration;

    if (!hasDocument) return false;

    // Check for bank account, tax details, and manager details
    return !!customerData.bankAccount && !!customerData.taxDetails && !!customerData.managerDetails;
  };

  // If loading, show loading state
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      <span className="ml-4 text-gray-600">{t('registration.loading')}</span>
    </div>;
  }

  // If registration is not complete, show the registration form
  if (!registrationComplete) {
    return <RegistrationForm step={step} />;
  }

  // Registration is complete, show children
  return <>{children}</>;
};

export default IsCompletedRoute;