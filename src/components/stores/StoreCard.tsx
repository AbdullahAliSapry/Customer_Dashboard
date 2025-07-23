import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, MapPin, ShoppingBag } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StoreCardProps {
  id: string;
  name: string;
  location: string;
  productsCount: number;
  status: 'active' | 'inactive';
  primaryColor?: string;
  storeType?: string; // NEW
}

export const StoreCard: React.FC<StoreCardProps> = ({
  id,
  name,
  location,
  productsCount,
  status,
  primaryColor = '#3B82F6',
  storeType, // NEW
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/store/${id}`)}
      className={cn(
        "bg-white rounded-lg shadow-sm p-6 cursor-pointer",
        "transition-all duration-200 hover:shadow-md",
        "border border-gray-100"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <Store style={{ color: primaryColor }} className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            {storeType && (
              <div className="text-xs text-gray-400 mt-0.5">{storeType}</div>
            )}
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">{location}</span>
            </div>
          </div>
        </div>
        <span
          className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            status === 'active'
              ? "bg-green-50 text-green-700"
              : "bg-gray-50 text-gray-700"
          )}
        >
          {status}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">
            {productsCount} Products
          </span>
        </div>
      </div>
    </div>
  );
}; 