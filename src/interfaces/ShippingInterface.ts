export interface IShippingData {
    address: {
        streetInfo: string;
        city: string;
        district: string;
        flatFloor: string;
        splInstructions?: string;
    };
    location: {
        latitude: number;
        longitude: number;
    };
    contact: {
        email: string;
        phoneNumber: string;
    };
}