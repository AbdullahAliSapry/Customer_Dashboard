import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconDisplayProps {
  iconName: string | null;
  size?: number;
  color?: string;
  className?: string;
  fallbackText?: boolean;
}

// Define a list of known icons to check against
const KNOWN_ICONS = new Set(
  Object.keys(LucideIcons).filter(
    key => typeof LucideIcons[key as keyof typeof LucideIcons] === 'function' && 
           key !== 'createLucideIcon' &&
           !key.startsWith('Lucide')
  )
);

const IconDisplay: React.FC<IconDisplayProps> = ({ 
  iconName, 
  size = 24, 
  color = 'currentColor',
  className = '',
  fallbackText = true
}) => {
  if (!iconName) return null;

  // Check if it's a valid icon name
  if (!KNOWN_ICONS.has(iconName)) {
    // Return fallback if icon not found
    if (fallbackText) {
      return (
        <div className={`flex items-center justify-center ${className}`} title="Icon not found">
          <span className="text-gray-500 text-xs">
            {iconName.length > 10 ? `${iconName.substring(0, 10)}...` : iconName}
          </span>
        </div>
      );
    }
    // Return a generic icon as fallback
    const FallbackIcon = LucideIcons.HelpCircle;
    return <FallbackIcon size={size} color="gray" className={className} title={`Unknown icon: ${iconName}`} />;
  }

  // Safely render the icon
  try {
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.FC<{
      size?: number;
      color?: string;
      className?: string;
    }>;
    
    return <IconComponent size={size} color={color} className={className} />;
  } catch (error) {
    console.error(`Error rendering icon: ${iconName}`, error);
    // Return a generic icon as fallback
    const FallbackIcon = LucideIcons.AlertTriangle;
    return <FallbackIcon size={size} color="red" className={className} title="Error rendering icon" />;
  }
};

export default IconDisplay; 