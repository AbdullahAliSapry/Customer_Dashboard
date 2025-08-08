import React from 'react';

interface FormFieldProps {
  label: string;
  value: string | number | null;
  onChange: (value: string | number) => void;
  type?: 'text' | 'textarea' | 'number';
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
}

const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  type = 'text',
  rows = 3,
  min,
  max,
  step
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (type === 'number') {
      onChange(e.target.value === '' ? '' : Number(e.target.value));
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={value || ''}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 hover:border-primary-300"
          rows={rows}
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 hover:border-primary-300"
          min={min}
          max={max}
          step={step}
        />
      )}
    </div>
  );
};

export default FormField;