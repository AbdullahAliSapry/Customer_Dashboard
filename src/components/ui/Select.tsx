import React from 'react';
import { cn } from '../../utils/cn';

interface Option {
  value: string | number;
  label: string;
  icon?: string | React.ReactElement;
  description?: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: Option[];
  label?: string;
  error?: string;
  helper?: string;
  containerClassName?: string;
  placeholder?: string;
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
    placeholder,
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
            "block w-full px-4 py-3 rounded-xl shadow-sm text-sm transition-all duration-200",
            "border border-gray-300 dark:border-gray-600",
            "focus:border-primary-500 dark:focus:border-primary-500",
            "focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-500/20",
            "dark:bg-gray-800 dark:text-white",
            "hover:border-primary-400 dark:hover:border-primary-400",
            "bg-white dark:bg-gray-800",
            "appearance-none cursor-pointer",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          ref={ref}
          onChange={handleChange}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-gray-400">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={String(option.value)} 
              value={option.value}
              disabled={option.disabled}
              className="py-2"
            >
              {option.icon && typeof option.icon === 'string' ? `${option.icon} ${option.label}` : option.label}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {helper && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{helper}</p>
        )}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
            <span className="mr-1">⚠</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;