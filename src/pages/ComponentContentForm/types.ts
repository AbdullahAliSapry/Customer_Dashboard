import { IComponentContent } from '../../interfaces/StoreInterface';

export interface ContentPatchPayload {
  storeId: number;
  title?: string | null;
  subtitle?: string | null;
  paragraph?: string | null;
  subparagraph?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  link?: string | null;
  linkText?: string | null;
  buttonText?: string[] | null;
  icon?: string | null;
  originalContentId?: number | null;
  rating?: number | null;
  visibleFields?: Record<string, boolean> | null;
}

export interface FormField {
  name: keyof IComponentContent;
  type: 'text' | 'textarea' | 'number';
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
}