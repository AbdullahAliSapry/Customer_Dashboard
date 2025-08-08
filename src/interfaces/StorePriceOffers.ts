

export enum PriceOfferStatus {
  Pending,
  Accepted,
  Rejected,
}

export interface StorePriceOffer {
  id: string;
  storeId: number;
  createdAt: Date;
  expiryDate: Date;
  status: PriceOfferStatus;
  notes: string;
  customerFeedback: string;
  items: PriceOfferItem[];
}

export interface PriceOfferItem {
  id: number;
  quantity: number;
  unitPrice: number;
  discount: number;
  productId: number;
}
