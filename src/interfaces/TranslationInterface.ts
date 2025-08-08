import { LanguageCode } from "./Languageinterface";
import { IProduct } from "./ProductInterface";

export interface ProductTranslation {
  id: number;
  name: string;
  description: string;
  languageCode: LanguageCode;
  dateAdded: Date;
  productId: number;
  storeLanguageId: number;
}

export interface ProductWithTranslation {
  product: IProduct;
  translation: ProductTranslation | null;
}
