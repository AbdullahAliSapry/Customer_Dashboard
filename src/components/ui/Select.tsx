import React from 'react';
import { cn } from '../../utils/cn';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: Option[];
  label?: string;
  error?: string;
  helper?: string;
  containerClassName?: string;
  onChange?: (value: string | number) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className, 
    options, 
    label, 
    error, 
    helper, 
    containerClassName, 
    onChange,
    ...props 
  }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        // If the value can be parsed as a number, convert it
        const value = e.target.value;
        const numValue = Number(value);
        if (!isNaN(numValue) && value !== '') {
          onChange(numValue);
        } else {
          onChange(value);
        }
      }
    };

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label 
            htmlFor={props.id} 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <select
          className={cn(
            "block w-full rounded-md shadow-sm sm:text-sm",
            "border border-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-500",
            "focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-500",
            "dark:bg-gray-800 dark:text-white",
            error && "border-error-500 focus:border-error-500 focus:ring-error-500",
            className
          )}
          ref={ref}
          onChange={handleChange}
          {...props}
        >
          {options.map((option) => (
            <option key={String(option.value)} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {helper && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{helper}</p>
        )}
        {error && (
          <p className="text-sm text-error-600">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;