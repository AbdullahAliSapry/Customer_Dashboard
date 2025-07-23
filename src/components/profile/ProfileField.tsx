import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';

interface ProfileFieldProps {
  label: string;
  value: string | React.ReactNode;
  isImage?: boolean;
  imageUrl?: string;
  onSave?: (newValue: string) => void;
  fieldKey?: string;
}

export const ProfileField: React.FC<ProfileFieldProps> = ({ 
  label, 
  value, 
  isImage, 
  imageUrl, 
  onSave,
  fieldKey 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(typeof value === 'string' ? value : '');

  // Fallback image for when the image fails to load
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(true);
    // Set a data URI as fallback
    e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23eee%22%2F%3E%3Ctext%20x%3D%22200%22%20y%3D%22150%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20alignment-baseline%3D%22middle%22%20fill%3D%22%23999%22%3EImage%20Not%20Available%3C%2Ftext%3E%3C%2Fsvg%3E';
    // Prevent further onError events
    e.currentTarget.onerror = null;
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(typeof value === 'string' ? value : '');
  };

  const handleSave = () => {
    if (onSave && fieldKey) {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(typeof value === 'string' ? value : '');
  };

  // Don't allow editing for images
  if (isImage) {
    return (
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {imageUrl ? (
          <div className="h-40 w-full overflow-hidden rounded-md border border-gray-200">
            <img 
              src={imageUrl} 
              alt={`${label}`} 
              className="h-full w-full object-cover"
              onError={handleImageError}
            />
          </div>
        ) : (
          <p className="font-medium text-gray-400">لا توجد صورة</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {!isEditing && onSave && (
          <button
            onClick={handleEdit}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200"
            title="تعديل"
          >
            <Edit2 size={16} />
          </button>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            autoFocus
          />
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
            >
              <Check size={16} />
              <span>حفظ</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
            >
              <X size={16} />
              <span>إلغاء</span>
            </button>
          </div>
        </div>
      ) : (
        <p className="font-medium text-gray-900 text-sm">{value}</p>
      )}
    </div>
  );
}; 