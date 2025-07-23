import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';

interface IconPickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
}

// Define common Lucide icons that are likely to be used
const COMMON_ICONS = [
  // Layout & Navigation
  'Home', 'Menu', 'ChevronDown', 'ChevronUp', 'ChevronLeft', 'ChevronRight', 
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Navigation', 'Map', 'MapPin',
  
  // User Interface
  'Search', 'Settings', 'Filter', 'Sliders', 'MoreHorizontal', 'MoreVertical',
  'X', 'Check', 'Plus', 'Minus', 'Edit', 'Trash', 'Download', 'Upload', 'Copy',
  'Eye', 'EyeOff', 'Lock', 'Unlock', 'LogIn', 'LogOut', 'Save', 'Refresh',
  
  // Communication
  'Mail', 'MessageCircle', 'MessageSquare', 'Send', 'Phone', 'PhoneCall', 
  'Share', 'Bell', 'BellOff', 'AlertCircle', 'AlertTriangle', 'Info',
  
  // Media & Files
  'Image', 'Camera', 'Video', 'Music', 'Play', 'Pause', 'File', 'Folder',
  'FileText', 'Paperclip', 'Link', 'Link2', 'Film', 'Mic', 'MicOff',
  
  // Objects & Symbols
  'Star', 'Heart', 'ThumbsUp', 'ThumbsDown', 'Calendar', 'Clock', 'Award',
  'Gift', 'Coffee', 'ShoppingCart', 'ShoppingBag', 'CreditCard', 'DollarSign',
  
  // User related
  'User', 'Users', 'UserPlus', 'UserMinus', 'UserCheck', 'UserX',
  
  // States
  'Circle', 'CheckCircle', 'XCircle', 'AlertCircle', 'HelpCircle',
  'Square', 'CheckSquare', 'XSquare',
  
  // Weather
  'Sun', 'Moon', 'Cloud', 'CloudRain', 'CloudSnow', 'Wind', 'Umbrella'
];

const IconPicker: React.FC<IconPickerProps> = ({ value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedIcons, setDisplayedIcons] = useState<string[]>([]);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const ICONS_PER_LOAD = 48; // 4 cols * 12 rows
  
  // Get all icons from Lucide - only compute this once
  const iconNames = useMemo(() => {
    return Object.keys(LucideIcons).filter(
      key => typeof LucideIcons[key as keyof typeof LucideIcons] === 'function' && 
             key !== 'createLucideIcon' &&
             !key.startsWith('Lucide')
    );
  }, []);

  // Filter icons based on search - compute filtered list only when search term changes
  const filteredIcons = useMemo(() => {
    return searchTerm === '' 
      ? COMMON_ICONS.length > 0 ? COMMON_ICONS : iconNames.slice(0, 100)
      : iconNames.filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, iconNames]);
  
  // Update displayed icons when filtered icons change
  useEffect(() => {
    setDisplayedIcons(filteredIcons.slice(0, ICONS_PER_LOAD));
    setCanLoadMore(filteredIcons.length > ICONS_PER_LOAD);
  }, [filteredIcons]);

  // Load more icons when scrolling reaches the bottom
  const handleScroll = () => {
    if (!scrollRef.current || !canLoadMore) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      loadMoreIcons();
    }
  };
  
  // Extracted to a separate function to avoid recreating in every render
  const loadMoreIcons = () => {
    setDisplayedIcons(prev => {
      const newIcons = [...prev, ...filteredIcons.slice(prev.length, prev.length + ICONS_PER_LOAD)];
      setCanLoadMore(newIcons.length < filteredIcons.length);
      return newIcons;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderIcon = (iconName: string) => {
    try {
      const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.FC<{size?: number}>;
      return IconComponent ? <IconComponent size={20} /> : null;
    } catch (e) {
      console.error(`Error rendering icon: ${iconName}`, e);
      return null;
    }
  };

  // Safe rendering of the selected icon
  const renderSelectedIcon = () => {
    if (!value) return null;
    
    try {
      const SelectedIcon = LucideIcons[value as keyof typeof LucideIcons] as React.FC<{size?: number}>;
      return SelectedIcon ? <SelectedIcon size={18} /> : null;
    } catch (e) {
      console.error(`Error rendering selected icon: ${value}`, e);
      return null;
    }
  };

  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropdown from toggling

    onChange("Default");
  };
  
  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div 
        className="flex items-center gap-2 w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
        onClick={toggleDropdown}
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        role="combobox"
      >
        {value ? (
          <>
            {renderSelectedIcon()}
            <span>{value}</span>
          </>
        ) : (
          <span className="text-gray-500">Select an icon...</span>
        )}
      </div>

      {value && (
        <button 
          type="button" 
          className="absolute right-10 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
          onClick={handleClearClick}
          aria-label="Clear selection"
        >
          {renderIcon('X')}
        </button>
      )}

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg border border-gray-200 rounded-md overflow-hidden" 
             role="listbox">
          <div className="p-2 border-b sticky top-0 bg-white z-10">
            <input
              type="text"
              placeholder="Search icons..."
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          
          <div 
            className="p-2 grid grid-cols-4 gap-2 max-h-60 overflow-y-auto"
            ref={scrollRef}
            onScroll={handleScroll}
          >
            {displayedIcons.length > 0 ? (
              displayedIcons.map(iconName => (
                <div
                  key={iconName}
                  className={`p-2 flex flex-col items-center justify-center text-center cursor-pointer rounded hover:bg-gray-100 ${
                    value === iconName ? 'bg-primary-100 border border-primary-300' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(iconName);
                  }}
                  role="option"
                  aria-selected={value === iconName}
                  title={iconName}
                >
                  {renderIcon(iconName)}
                  <span className="text-xs mt-1 truncate w-full">{iconName}</span>
                </div>
              ))
            ) : (
              <div className="col-span-4 p-4 text-center text-gray-500">
                No icons found. Try another search term.
              </div>
            )}
            {canLoadMore && (
              <div className="col-span-4 flex justify-center my-2">
                <button 
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    loadMoreIcons();
                  }}
                >
                  Load more icons
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IconPicker; 