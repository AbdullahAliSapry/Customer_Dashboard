import { createSlice } from "@reduxjs/toolkit"
import { ICustomerData } from "../../interfaces/CustomerInterface";

interface CustomerState {
  customerData: ICustomerData | null;
  step: number;
  loading: boolean;
}

const initialState: CustomerState = {
  customerData: null,
  step: 0,
  loading: false,
};

const CustomerInfoSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    SetCustomerData(state, action) {
      state.customerData = action.payload;
      state.loading = false;
    },
    SetCommercialRegistration(state, action) {
      if (state.customerData) {
        state.customerData.commercialRegistration = action.payload;
      }
    },
    SetFreelancerLicense(state, action) {
      if (state.customerData) {
        state.customerData.freelancerLicense = action.payload;
      }
    },
    SetBankAccount(state, action) {
      if (state.customerData) {
        state.customerData.bankAccount = action.payload;
      }
    },
    SetTaxDetails(state, action) {
      if (state.customerData) {
        state.customerData.taxDetails = action.payload;
      }
    },
    SetStep(state, action) {
      state.step = action.payload;
    }
  }
});

export const {
  SetCustomerData,
  SetCommercialRegistration,
  SetFreelancerLicense,
  SetBankAccount,
  SetTaxDetails,
  SetStep
} = CustomerInfoSlice.actions;

export default CustomerInfoSlice.reducer;

