import React from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
      <div className="text-red-600 font-semibold">{message}</div>
    </div>
  );
};

export default ErrorMessage; 