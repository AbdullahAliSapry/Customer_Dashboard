import { ApiClient } from "./ApiClient";
import { EndPoints } from "./EndPoints";
import { ICreateStore } from "../interfaces/CreateStoreInterface";
import { IResponseData } from "../interfaces/ResponseInterface";
import { store } from "../Store/Store";
import { 
    createStoreStart, 
    createStoreSuccess,
    createStoreFailure 
} from "../Store/StoreSlice/CreateStoreSlice";
import toast from "react-hot-toast";

// Define the store response type
interface StoreResponseData {
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
    [key: string]: any; // For other potential properties
}

export class StoreService {
    static async createStore(storeData: ICreateStore): Promise<{ success: boolean, storeData?: StoreResponseData }> {
        store.dispatch(createStoreStart());
        
        try {
            // Format data according to the DTO structure
            const createStoreDTO = {
                dominName: storeData.dominName,
                phoneContact: storeData.phoneContact,
                emailContact: storeData.emailContact,
                businessType: storeData.businessType,
                primaryColor: storeData.primaryColor,
                secondaryColor: storeData.secondaryColor,
                accentColor: storeData.accentColor,
                font: storeData.font,
                templateId: storeData.templateId,
                ownerId: storeData.ownerId,
                socialMediaLinks: storeData.socialMediaLinks.map(link => ({
                    platform: link.platform,
                    url: link.url
                }))
            };
            
            const response = await ApiClient.post<IResponseData<StoreResponseData>>(
                EndPoints.createStore, 
                createStoreDTO
            );
            
            if (response.data.isSuccess && response.data.data) {
                store.dispatch(createStoreSuccess());
                toast.success(response.data.message || "Store created successfully");
                return { success: true, storeData: response.data.data };
            } else {
                const errorMessage = response.data.message || "Failed to create store";
                store.dispatch(createStoreFailure());
                toast.error(errorMessage);
                return { success: false };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred while creating the store";
            store.dispatch(createStoreFailure());
            toast.error(errorMessage);
            return { success: false };
        }
    }
} 