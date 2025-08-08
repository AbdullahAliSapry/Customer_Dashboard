/* eslint-disable @typescript-eslint/no-explicit-any */
import { BusinessTypeMarchent } from "./StoreInterface";
import { BusinessType } from "./TemplateDataInterface";

export interface ICreateStore {
  id?: number;
  dominName: string;
  phoneContact: string;
  emailContact: string;
  businessType: BusinessType;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  font: string;
  templateId: number;
  ownerId: number;
  logo: File | string | null;
  socialMediaLinks: ICreateSocialMediaLink[];
  typeStore: BusinessTypeMarchent;
}

export interface ICreateSocialMediaLink {
  id?: number;
  platform: string;
  url: string;
  storeId?: number;
}

export interface ICreateTemplateData {
  id?: number;
  storeId?: number;
  templateId: number;
  customizations?: Record<string, any>;
}
