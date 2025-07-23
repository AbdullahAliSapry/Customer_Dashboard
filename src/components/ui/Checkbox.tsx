import React from 'react';
import { cn } from '../../utils/cn';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  error?: string;
  helper?: string;
  containerClassName?: string;
  onChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
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
        onChange(e.target.checked);
      }
    };

    return (
      <div className={cn("flex items-start", containerClassName)}>
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            className={cn(
              "h-4 w-4 rounded",
              "text-primary-600 border-gray-300",
              "focus:ring-2 focus:ring-primary-500 focus:ring-offset-1",
              "dark:border-gray-600 dark:bg-gray-800",
              error && "border-error-500",
              className
            )}
            ref={ref}
            onChange={handleChange}
            {...props}
          />
        </div>
        <div className="ml-3 text-sm">
          {label && (
            <label 
              htmlFor={props.id} 
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              {label}
            </label>
          )}
          {helper && !error && (
            <p className="text-gray-500 dark:text-gray-400">{helper}</p>
          )}
          {error && (
            <p className="text-error-600">{error}</p>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;