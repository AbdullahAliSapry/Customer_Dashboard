import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { Upload } from 'lucide-react';

interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  error?: string;
  helper?: string;
  containerClassName?: string;
  onChange?: (file: File | null) => void;
  accept?: string;
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ 
    className, 
    label, 
    error, 
    helper, 
    containerClassName, 
    onChange,
    accept = 'image/*',
    ...props 
  }, ref) => {
    const [fileName, setFileName] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      if (file) {
        setFileName(file.name);
      } else {
        setFileName('');
      }
      
      if (onChange) {
        onChange(file);
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
        <div className="relative">
          <label 
            htmlFor={props.id || 'file-upload'} 
            className={cn(
              "flex items-center justify-center space-x-2 px-4 py-2",
              "border border-dashed border-gray-300 dark:border-gray-600",
              "rounded-md cursor-pointer",
              "hover:bg-gray-50 dark:hover:bg-gray-700",
              "transition-colors duration-200",
              error && "border-error-500",
              className
            )}
          >
            <Upload size={20} className="text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {fileName || 'Click to upload file'}
            </span>
          </label>
          <input
            id={props.id || 'file-upload'}
            type="file"
            className="sr-only"
            ref={ref}
            onChange={handleChange}
            accept={accept}
            {...props}
          />
        </div>
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

FileUpload.displayName = 'FileUpload';

export default FileUpload;