export interface IPayment {
    id: number;
    paymentId: string;
    orderId: string;
    amount: number;
    currency: string;
    method: PaymentMethod;
    status: PaymentStatus;
    transactionId: string;
    createdAt: Date;
    updatedAt?: Date;
    customerName: string;
    customerEmail: string;
    storeid: number;
}

export enum PaymentMethod {
    CreditCard = "Credit Card",
    DebitCard = "Debit Card",
    BankTransfer = "Bank Transfer",
    Cash = "Cash",
    PayPal = "PayPal",
    ApplePay = "Apple Pay",
    GooglePay = "Google Pay",
    Other = "Other"
}

export enum PaymentStatus {
    Pending = "Pending",
    Completed = "Completed",
    Failed = "Failed",
    Refunded = "Refunded",
    Cancelled = "Cancelled"
} 