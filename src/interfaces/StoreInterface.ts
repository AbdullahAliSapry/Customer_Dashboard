export interface IComponentContent {
  id: number;
  storeId: number | null;
  title: string | null;
  subtitle: string | null;
  paragraph: string | null;
  subparagraph: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  link: string | null;
  linkText: string | null;
  buttonText: string[] | null;
  icon: string | null;
  rating: number | null;
  visibleFields?: Record<string, boolean>;
}

export interface IComponent {
  id: number;
  name: string;
  componentContents: IComponentContent[];
}

export interface IPage {
  id: number;
  name: string;
  components: IComponent[];
}

export interface ITemplateData {
  id: number;
  name: string;
  businessType: number;
  path: string;
  folderName: string;
  pages: IPage[];
}

export interface ISocialMediaLink {
  id: number;
  name: string;
  url: string;
}

export interface IStoreData {
  id: number;
  dominName: string;
  phoneContact: string;
  emailContact: string;
  typeStore: BusinessTypeMarchent;
  primaryColor: string;
  businessType: BusinessType;

  secondaryColor: string;
  accentColor: string;
  font: string;
  templateId: number;
  ownerId: number;
  logo: string | null;
  imageLogo?: {
    id: number;
    fileName: string;
    publicId: string;
    url: string;
  };
  socialMediaLinks: ISocialMediaLink[];
  templateDatas: ITemplateData;
}


export enum BusinessTypeMarchent {
  products = 0,
  services=1,
}

export enum BusinessType {
  Restaurant = 0,
  Cafe = 1,
  ECommerce = 2,
  Events = 3,
  Consulting = 4,
  Service = 5,
  Other = 6,
}