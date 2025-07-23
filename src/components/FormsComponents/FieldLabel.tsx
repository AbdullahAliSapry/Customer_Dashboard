import React from 'react';
import { FieldLabelProps } from '../../interfaces/formtypes';

const FieldLabel: React.FC<FieldLabelProps> = ({ icon, children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
    {icon && React.cloneElement(icon, { size: 14, className: "mr-1 text-indigo-500" })}
    {children}
  </label>
);

export default FieldLabel;