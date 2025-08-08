export enum LanguageCode {
  ar, // Arabic
  en, // English
  fr, // French
  es, // Spanish
  de, // German
  it, // Italian
  ru, // Russian
  zh, // Chinese (Simplified)
  ja, // Japanese
  tr, // Turkish
  hi, // Hindi
  ur, // Urdu
  pt, // Portuguese
}

export interface StoreLanguageDto {
  id: number;
  languageCode: LanguageCode;
  languageName: string;
  isDefault: boolean;
  dateAdded: Date;
  storeId: number;
}
