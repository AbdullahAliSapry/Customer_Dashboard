import { ReactElement } from 'react';


export interface ComponentFormProps {
  showsubtitle?: boolean;
  showsubparagraph?: boolean;
  showimagealttext?: boolean;
  showlinktext?: boolean;
  showbuttons?: boolean;
  showrating?: boolean;
  showbasicinfo?: boolean;
  showcontent?: boolean;
  showmedia?: boolean;
  showlinksbuttons?: boolean;
  showstyling?: boolean;
}

export interface FormSectionProps {
  icon?: ReactElement;
  title: string;
  children: React.ReactNode;
}

export interface FieldLabelProps {
  icon?: ReactElement;
  children: React.ReactNode;
  htmlFor: string;
}

export interface TextInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  type?: string;
  arialabel?: string;
}

export interface TextAreaProps extends Omit<TextInputProps, 'type'> {
  rows?: number;
}

export interface DynamicIconProps {
  iconname: string;
  size?: number;
  color?: string;
  classname?: string;
}

export interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export interface RatingInputProps {
  value?: number;
  onChange: (value: number) => void;
}

export const iconnames = [
  'Activity', 'AirVent', 'Airplay', 'AlertCircle', 'AlertOctagon', 'AlignCenter',
  // ... (all your icon names)
  'ZoomOut'
] as const;

export type IconName = typeof iconnames[number];