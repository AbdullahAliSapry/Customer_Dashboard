import React, { useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { DynamicIconProps, IconName } from '../../interfaces/formtypes';

const DynamicIcon: React.FC<DynamicIconProps> = ({ 
  iconName, 
  size = 24, 
  color = 'currentColor', 
  className = '' 
}) => {
  // Using useMemo to avoid recreating icon components on re-renders
  const Icon = useMemo(() => {
    if (!iconName) return AlertCircle;
    return LucideIcons[iconName as keyof typeof LucideIcons] || AlertCircle;
  }, [iconName]);

  return <Icon size={size} color={color} className={className} />;
};

export default DynamicIcon;