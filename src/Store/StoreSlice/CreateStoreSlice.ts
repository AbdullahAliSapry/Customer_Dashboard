import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BusinessType } from "../../interfaces/TemplateDataInterface";
import { ICreateStore, ICreateSocialMediaLink } from "../../interfaces/CreateStoreInterface";
import { BusinessTypeMarchent } from "../../interfaces/StoreInterface";

interface CreateStoreState {
    storeData: ICreateStore;
    currentStep: number;
    loading: boolean;
    success: boolean;
}

const initialState: CreateStoreState = {
    storeData: {
        dominName: "",
        phoneContact: "",
        emailContact: "",
        businessType: BusinessType.ecommerce,
        primaryColor: "#3B82F6",
        secondaryColor: "#1E40AF",
        accentColor: "#DBEAFE",
        font: "Inter",
        templateId: 0,
        ownerId: 0,
        logo: null,
        socialMediaLinks: [],
        typeStore: BusinessTypeMarchent.products // إضافة typeStore بقيمة منتجات كقيمة افتراضية
    },
    currentStep: 0,
    loading: false,
    success: false
};

export interface StoreResponseData {
    id: number;
    dominName: string;
    phoneContact: string;
    emailContact: string;
    businessType: number;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    font: string;
    templateId: number;
    ownerId: number;
    socialMediaLinks: ICreateSocialMediaLink[];
    typeStore: BusinessTypeMarchent;
}

const CreateStoreSlice = createSlice({
    name: "createStore",
    initialState,
    reducers: {
        setStoreBasicInfo: (state, action: PayloadAction<Partial<ICreateStore>>) => {
            state.storeData = { ...state.storeData, ...action.payload };
        },
        setTemplate: (state, action: PayloadAction<number>) => {
            state.storeData.templateId = action.payload;
        },
        setColors: (state, action: PayloadAction<{
            primaryColor: string;
            secondaryColor: string;
            accentColor: string;
        }>) => {
            state.storeData.primaryColor = action.payload.primaryColor;
            state.storeData.secondaryColor = action.payload.secondaryColor;
            state.storeData.accentColor = action.payload.accentColor;
        },
        setFont: (state, action: PayloadAction<string>) => {
            state.storeData.font = action.payload;
        },
        setLogo: (state, action: PayloadAction<File | null>) => {
            state.storeData.logo = action.payload;
        },
        setTypeStore: (state, action: PayloadAction<BusinessTypeMarchent>) => {
            state.storeData.typeStore = action.payload;
        },
        addSocialMediaLink: (state, action: PayloadAction<ICreateSocialMediaLink>) => {
            state.storeData.socialMediaLinks.push(action.payload);
        },
        updateSocialMediaLink: (state, action: PayloadAction<{
            index: number;
            link: ICreateSocialMediaLink;
        }>) => {
            state.storeData.socialMediaLinks[action.payload.index] = action.payload.link;
        },
        removeSocialMediaLink: (state, action: PayloadAction<number>) => {
            state.storeData.socialMediaLinks = state.storeData.socialMediaLinks.filter(
                (_, index) => index !== action.payload
            );
        },
        setCurrentStep: (state, action: PayloadAction<number>) => {
            state.currentStep = action.payload;
        },
        nextStep: (state) => {
            state.currentStep += 1;
        },
        prevStep: (state) => {
            if (state.currentStep > 0) {
                state.currentStep -= 1;
            }
        },
        createStoreStart: (state) => {
            state.loading = true;
            state.success = false;
        },
        createStoreSuccess: (state, action: PayloadAction<StoreResponseData>) => {
            state.loading = false;
            state.success = true;
            // تحويل StoreResponseData إلى ICreateStore
            state.storeData = {
                id: action.payload.id,
                dominName: action.payload.dominName,
                phoneContact: action.payload.phoneContact,
                emailContact: action.payload.emailContact,
                businessType: action.payload.businessType as BusinessType,
                primaryColor: action.payload.primaryColor,
                secondaryColor: action.payload.secondaryColor,
                accentColor: action.payload.accentColor,
                font: action.payload.font,
                templateId: action.payload.templateId,
                ownerId: action.payload.ownerId,
                logo: state.storeData.logo, // Preserve the existing logo
                socialMediaLinks: action.payload.socialMediaLinks || [],
                typeStore: action.payload.typeStore
            };
        },
        createStoreFailure: (state) => {
            state.loading = false;
            state.success = false;
        },
        resetStoreCreation: () => initialState
    }
});

export const {
    setStoreBasicInfo,
    setTemplate,
    setColors,
    setFont,
    setLogo,
    setTypeStore,
    addSocialMediaLink,
    updateSocialMediaLink,
    removeSocialMediaLink,
    setCurrentStep,
    nextStep,
    prevStep,
    createStoreStart,
    createStoreSuccess,
    createStoreFailure,
    resetStoreCreation
} = CreateStoreSlice.actions;

export default CreateStoreSlice.reducer; 