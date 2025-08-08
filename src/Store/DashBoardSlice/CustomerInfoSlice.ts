import { createSlice } from "@reduxjs/toolkit"
import { ICheckCustomerStepsCustomerData, ICustomerData } from "../../interfaces/CustomerInterface";

interface CustomerState {
  customerData: ICustomerData | null;
  step: number;
  loading: boolean;
  checkCustomerSteps: ICheckCustomerStepsCustomerData | null;
  error: string | null;
}

const initialState: CustomerState = {
  customerData: null,
  step: 0,
  loading: false,
  checkCustomerSteps: null,
  error: null,
};

const CustomerInfoSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    SetCustomerData(state, action) {
      state.customerData = action.payload;
      state.loading = false;
      
      // Update checkCustomerSteps based on customerData
      if (action.payload) {
        state.checkCustomerSteps = {
          basicData: !!(
            action.payload.location &&
            (action.payload.nationality !== null && action.payload.nationality !== undefined) &&
            (action.payload.documentType !== null && action.payload.documentType !== undefined) &&
            action.payload.nationalAddress &&
            action.payload.isFreelancer !== null &&
            action.payload.birthDate &&
            action.payload.idIssueDate &&
            action.payload.idExpiryDate
          ),
          commercialRegistration: !!action.payload.commercialRegistration,
          freelancerLicense: !!action.payload.freelancerLicense,
          bankAccount: !!action.payload.bankAccount,
          taxDetails: !!action.payload.taxDetails,
          managerDetails: !!action.payload.managerDetails,
        };
      }
    },
    SetCommercialRegistration(state, action) {
      if (state.customerData) {
        state.customerData.commercialRegistration = action.payload;
      }
      // Update checkCustomerSteps to mark commercialRegistration as completed
      if (state.checkCustomerSteps) {
        state.checkCustomerSteps.commercialRegistration = true;
      }
    },
    SetFreelancerLicense(state, action) {
      if (state.customerData) {
        state.customerData.freelancerLicense = action.payload;
      }
      // Update checkCustomerSteps to mark freelancerLicense as completed
      if (state.checkCustomerSteps) {
        state.checkCustomerSteps.freelancerLicense = true;
      }
    },
    SetBankAccount(state, action) {
      if (state.customerData) {
        state.customerData.bankAccount = action.payload;
      }
      // Update checkCustomerSteps to mark bankAccount as completed
      if (state.checkCustomerSteps) {
        state.checkCustomerSteps.bankAccount = true;
      }
    },
    SetTaxDetails(state, action) {
      if (state.customerData) {
        state.customerData.taxDetails = action.payload;
      }
      // Update checkCustomerSteps to mark taxDetails as completed
      if (state.checkCustomerSteps) {
        state.checkCustomerSteps.taxDetails = true;
      }
    },
    SetManagerDetails(state, action) {
      if (state.customerData) {
        state.customerData.managerDetails = action.payload;
      }
      // Update checkCustomerSteps to mark managerDetails as completed
      if (state.checkCustomerSteps) {
        state.checkCustomerSteps.managerDetails = true;
      }
    },
    SetStep(state, action) {
      state.step = action.payload;
    },
    SetCheckCustomerSteps(state, action) {
      state.checkCustomerSteps = action.payload;
    },
    SetError(state, action) {
      state.error = action.payload;
    }
  }
});

export const {
  SetCustomerData,
  SetCommercialRegistration,
  SetFreelancerLicense,
  SetBankAccount,
  SetTaxDetails,
  SetManagerDetails,
  SetStep,
  SetCheckCustomerSteps,
  SetError
} = CustomerInfoSlice.actions;

export default CustomerInfoSlice.reducer;

