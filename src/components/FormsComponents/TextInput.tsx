import React from 'react';
import { TextInputProps } from '../../interfaces/formtypes';

const TextInput: React.FC<TextInputProps> = ({ 
  id, 
  value, 
  onChange, 
  placeholder, 
  required, 
  type = "text", 
  ariaLabel 
}) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    required={required}
    aria-label={ariaLabel || placeholder}
    className="w-full p-2.5 border text-sm border-slate-300 rounded-md text-slate-700 placeholder-slate-400
     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
  />
);

export default TextInput;