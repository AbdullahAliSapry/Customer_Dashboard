export enum OrderStatus {
    Pending = 0,
    Processing = 1,
    Shipped = 2,
    Delivered = 3,
    Cancelled = 4
}

export enum StoreType {
    Regular = 0,
    Premium = 1,
    Enterprise = 2
}

export interface IOrderItem {
    id: number;
    productId: number;
    quantity: number;
    price: number;
    orderId: string;
}

export interface ICustomerStore {
    id: string;
    email: string | null;
    fullName: string | null;
    phoneNumber: string | null;
    isStoreCustomer: boolean;
    isMainCustomer: boolean;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export interface IStore {
    id: number;
    dominName: string;
    phoneContact: string;
    emailContact: string;
    shippingIsActive: boolean;
    typeStore: StoreType;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    font: string;
    imageLogo: string | null;
    imageLogoId: number;
    ownerId: number;
    orders: IOrder[];
}

export interface IOrder {
    id: string;
    totalBalance: number;
    quntity: number;
    createdAt: string;
    updatedAt: string;
    isPaid: boolean;
    orderStatus: OrderStatus;
    customersStoreId: number;
    storeId: number;
    store: IStore;
    orderItems: IOrderItem[];
    customersStore: ICustomerStore;
} 