import React from 'react';
import { ProfileField } from './ProfileField';

interface ProfileSectionProps {
  fields: Array<{
    label: string;
    value: string | React.ReactNode;
    isImage?: boolean;
    imageUrl?: string;
    fieldKey?: string;
  }>;
  onFieldUpdate?: (fieldKey: string, newValue: string) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ fields, onFieldUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {fields.map((field, index) => (
          <ProfileField
            key={index}
            label={field.label}
            value={field.value}
            isImage={field.isImage}
            imageUrl={field.imageUrl}
            fieldKey={field.fieldKey}
            onSave={onFieldUpdate}
          />
        ))}
      </div>
    </div>
  );
}; 