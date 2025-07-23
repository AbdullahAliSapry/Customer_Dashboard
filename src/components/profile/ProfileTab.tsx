import React from 'react';
import { cn } from '../../utils/cn';

interface ProfileTabProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  id,
  label,
  icon,
  isActive,
  onClick,
}) => {
  return (
    <button
      key={id}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all duration-200 relative",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-t-lg",
        "hover:bg-gray-50",
        isActive
          ? "text-primary-600 bg-white shadow-sm"
          : "text-gray-500 hover:text-gray-700"
      )}
    >
      {icon}
      <span className="hidden sm:inline font-medium">{label}</span>
      
      {/* Active indicator */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-t-full"></div>
      )}
    </button>
  );
}; 