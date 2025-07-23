export interface IStoreCustomer {
    id: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    isStoreCustomer: boolean;
    isMainCustomer: boolean;
    createdAt: Date;
    updatedAt: Date;
    storeid: number;
    customerId?: string;
    status: CustomerStatus;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
}

export enum CustomerStatus {
    Active = "Active",
    Inactive = "Inactive"
} 