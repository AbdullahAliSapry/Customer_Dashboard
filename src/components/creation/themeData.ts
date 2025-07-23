export interface ColorTheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

export interface FontOption {
  name: string;
  value: string;
}

// Predefined color themes
export const colorThemes: ColorTheme[] = [
  {
    name: 'Ocean Blue',
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#DBEAFE',
  },
  {
    name: 'Forest Green',
    primary: '#10B981',
    secondary: '#065F46',
    accent: '#D1FAE5',
  },
  {
    name: 'Sunset Orange',
    primary: '#F97316',
    secondary: '#C2410C',
    accent: '#FFEDD5',
  },
  {
    name: 'Royal Purple',
    primary: '#8B5CF6',
    secondary: '#6D28D9',
    accent: '#EDE9FE',
  },
  {
    name: 'Ruby Red',
    primary: '#EF4444',
    secondary: '#B91C1C',
    accent: '#FEE2E2',
  },
  {
    name: 'Midnight Black',
    primary: '#1F2937',
    secondary: '#111827',
    accent: '#F3F4F6',
  },
];

// Font options
export const fontOptions: FontOption[] = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Poppins', value: 'Poppins' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Montserrat', value: 'Montserrat' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' },
]; 