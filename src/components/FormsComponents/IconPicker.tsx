import React, { useState, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import DynamicIcon from './DyynamicIcon';
import { IconPickerProps, iconnames } from '../../interfaces/formtypes';

const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const filteredIcons = useMemo(() => 
    iconnames.filter(icon => 
      icon.toLowerCase().includes(search.toLowerCase())
    ), 
    [search]
  );

  return (
    <div className="relative w-full">
      <div 
        className="flex items-center p-3 border border-slate-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors duration-200 bg-white shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select an icon"
      >
        <div className="bg-indigo-100 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
          <DynamicIcon iconname={value || 'AlertCircle'} size={20} color="text-primary-600" />
        </div>
        <span className="flex-grow text-slate-700 font-medium">{value || 'Select an icon'}</span>
        <ChevronDown size={18} className="text-slate-500" />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-4 w-full max-h-64 overflow-y-auto">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 pl-9 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {filteredIcons.map((icon) => (
              <button
                key={icon}
                onClick={() => {
                  onChange(icon);
                  setIsOpen(false);
                }}
                className={`flex flex-col items-center p-2 rounded-lg hover:bg-indigo-50 transition-colors duration-150 ${
                  value === icon ? 'bg-indigo-100 border border-indigo-300' : ''
                }`}
              >
                <DynamicIcon iconname={icon} size={20} color={value === icon ? "#4F46E5" : "#64748b"} />
                <span className="text-xs mt-1 truncate w-full text-center text-slate-700">{icon}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IconPicker;