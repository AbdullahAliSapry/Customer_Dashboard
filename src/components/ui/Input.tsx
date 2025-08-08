import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text', 
    label, 
    error, 
    helper, 
    leftIcon, 
    rightIcon, 
    containerClassName, 
    ...props 
  }, ref) => {
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
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "block w-full px-4 py-3 rounded-xl shadow-sm text-sm transition-all duration-200",
              "border border-gray-300 dark:border-gray-600",
              "focus:border-primary-500 dark:focus:border-primary-500",
              "focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-500/20",
              "dark:bg-gray-800 dark:text-white",
              "hover:border-primary-400 dark:hover:border-primary-400",
              "placeholder:text-gray-400 dark:placeholder:text-gray-500",
              leftIcon && "pl-12",
              rightIcon && "pr-12",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
              {rightIcon}
            </div>
          )}
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

Input.displayName = 'Input';

export default Input;