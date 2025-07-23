import React from 'react';
import { cn } from '../../utils/cn';

interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  error?: string;
  helper?: string;
  containerClassName?: string;
  onChange?: (date: string) => void;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ 
    className, 
    label, 
    error, 
    helper, 
    containerClassName, 
    onChange,
    ...props 
  }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value);
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
        <input
          type="date"
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
        />
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

DatePicker.displayName = 'DatePicker';

export default DatePicker;