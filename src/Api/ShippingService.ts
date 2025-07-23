import { ApiClient } from "./ApiClient";
import { EndPoints } from "./EndPoints";
import { IShippingData } from "../interfaces/ShippingInterface";
import toast from "react-hot-toast";
import { IResponseData } from "../interfaces/ResponseInterface";

export class ShippingService {
    /**
     * Creates shipping to a store
     * @param storeId - Store ID
     * @param userId - User ID
     * @param data - Shipping data
     * @returns Promise with shipping activation result
     */
    static async createShippingToStore(storeId: string, userId: string, data: IShippingData): Promise<boolean> {
        try {
            const endpoint = EndPoints.createShippingToStore(storeId, userId);
            const response = await ApiClient.post<IResponseData<any>>(endpoint, data);
            
            if (response.data && response.data.isSuccess) {
                toast.success("Shipping activated successfully");
                return true;
            } else {
                toast.error(response.data?.message || "Failed to activate shipping");
                return false;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An error occurred while activating shipping");
            return false;
        }
    }
    
    /**
     * Checks if shipping is active for a store
     * @param storeId - Store ID
     * @returns Promise with shipping status
     */
    static async checkShippingStatus(storeId: string): Promise<boolean> {
        try {
            const response = await ApiClient.get<IResponseData<{isActive: boolean}>>(`Shipping/status/${storeId}`);
            return response.data?.isSuccess && response.data?.data?.isActive;
        } catch (error) {
            console.error("Error checking shipping status:", error);
            return false;
        }
    }
} 