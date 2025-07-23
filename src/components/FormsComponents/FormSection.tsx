import React from 'react';
import { FormSectionProps } from '../../interfaces/formtypes';

const FormSection: React.FC<FormSectionProps> = ({ icon, title, children }) => (
  <div className="space-y-4 bg-white rounded-xl p-5 shadow-sm border border-slate-200">
    <h3 className="text-md font-semibold flex items-center text-gray-800">
      {icon && React.cloneElement(icon, { size: 16, className: "mr-2 text-primary-600" })}
      {title}
    </h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

export default FormSection;