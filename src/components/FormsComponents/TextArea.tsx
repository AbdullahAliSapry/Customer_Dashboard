import React from 'react';
import { TextAreaProps } from '../../interfaces/formtypes';

const TextArea: React.FC<TextAreaProps> = ({ 
  id, 
  value, 
  onChange, 
  placeholder, 
  rows = 3, 
  ariaLabel 
}) => (
  <textarea
    id={id}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    aria-label={ariaLabel || placeholder}
    className="w-full p-2.5 border border-slate-300 rounded-md text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-y"
  />
);

export default TextArea;