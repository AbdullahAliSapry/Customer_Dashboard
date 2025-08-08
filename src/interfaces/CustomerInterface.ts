export interface ICustomerData {
  id: number;
  location: string;
  dataIsComplete: boolean;
  nationality: Nationality | number;
  documentType: DocumentType | number;
  nationalAddress: string;
  isFreelancer: boolean;
  birthDate: Date | string;
  idIssueDate: Date | string;
  idExpiryDate: Date | string;
  imageIdentity?: IImage;
  identityImageId?: number;
  imageNationalAddress?: IImage;
  nationalAddressImageId?: number;
  user?: IUser;
  userId?: string;
  managerDetails?: IManagerDetailsMainCustomer;
  bankAccount?: IBankAccount;
  bankAccountId?: number | null;
  commercialRegistration?: ICommercialRegistration;
  freelancerLicense?: IFreelancerLicense;
  taxDetails?: ITaxDetails;
}

export interface IImage {
  id: number;
  fileName: string;
  publicId: string;
  url: string;
}

export interface IUser {
  email: string;
  fullName: string;
  phoneNumber: string;
  isStoreCustomer: boolean;
  isMainCustomer: boolean;
  password: string | null;
  confirmPassword: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IBankAccount {
  id?: number;
  businessName: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  country: string;
  bankName: string;
  mainCustomerId?: number;
  bankCertificate: string | IImage | null;
  bankCertificateCom?: IImage;
}

export interface ICommercialRegistration {
  id?: number;
  registerNumber: string;
  issueDate: string;
  expiryDate: string;
  image: string | IImage;
}

export interface IFreelancerLicense {
  id?: number;
  numberIdentity: string;
  licenseNumber: string;
  licensedActivity: string;
  issueDate: string;
  expiryDate: string;
  document: null | Record<string, unknown>;
  mainCustomerId: number;
  documentCom: IImage;
}

export interface ITaxDetails {
  id?: number;
  hasTaxDeclaration: boolean;
  taxNumber: string | null;
  sendingExemptionReasonDocumentUrl?: string | null;
  imageTax: string | IImage | null;
  mainCustomerId: number;
  exemptionReasonDocument: string | IImage | null;
  imageTaxCom: IImage | null;
  reasonDocument: IImage;
}

export enum Nationality {
  Saudi = 0,
  NonSaudi = 1,
}

export enum DocumentType {
  CommercialRegistration = 0,
  FreelancerLicense = 1,
}

export interface ICheckCustomerStepsCustomerData {
  basicData: boolean;
  commercialRegistration: boolean;
  freelancerLicense: boolean;
  managerDetails: boolean;
  bankAccount: boolean;
  taxDetails: boolean;
}
  

export interface IManagerDetailsMainCustomer {
  id?: number;
  name: string;
  contactNumber: string;
  birthDate: Date;
  idIssueDate: Date;
  idExpiryDate: Date;
  imageIdentity: File | null;
  mainCustomerId: number;
  imageIdentityCom: IImage | null;
}