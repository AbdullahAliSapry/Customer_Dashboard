import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, MapPin, ShoppingBag } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useTranslation } from 'react-i18next';

interface StoreCardProps {
  id: string;
  name: string;
  location: string;
  productsCount: number;
  status: 'active' | 'inactive';
  primaryColor?: string;
  storeType?: string;
  isActive?: boolean;
}

export const StoreCard: React.FC<StoreCardProps> = ({
  id,
  name,
  location,
  productsCount,
  status,
  primaryColor = '#3B82F6',
  storeType,
  isActive = true,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = () => {
    if (isActive) {
      navigate(`/store/${id}`);
    }
  };

           return (
        <div
          onClick={handleClick}
          className={cn(
            "group relative bg-white rounded-2xl p-6",
            "transition-all duration-300 ease-out",
            "border border-gray-100/50",
            "hover:shadow-xl hover:shadow-gray-200/50",
            "min-h-[280px] flex flex-col",
            isActive 
              ? "cursor-pointer hover:-translate-y-1" 
              : "cursor-not-allowed opacity-60"
          )}
        >
      {/* Background Gradient on Hover */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-blue-50/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
      
             <div className="relative z-10 flex flex-col h-full">
                   {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div 
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                  "transition-all duration-300 group-hover:scale-105",
                  "shadow-lg"
                )}
                style={{ 
                  backgroundColor: isActive ? `${primaryColor}20` : '#f3f4f6',
                  border: `2px solid ${isActive ? `${primaryColor}30` : '#e5e7eb'}`
                }}
              >
                <Store 
                  style={{ color: isActive ? primaryColor : '#9ca3af' }} 
                  className={cn(
                    "w-6 h-6 transition-all duration-300",
                    isActive && "group-hover:scale-105"
                  )} 
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "text-lg font-bold text-gray-900 mb-1 truncate",
                  "transition-colors duration-300",
                  isActive && "group-hover:text-primary-700"
                )}>
                  {name}
                </h3>
                {storeType && (
                  <div className="text-sm text-gray-500 mb-2 font-medium truncate">{storeType}</div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600 truncate">{location}</span>
                </div>
              </div>
            </div>
           
                       {/* Status Badge */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-3">
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap",
                  "transition-all duration-300",
                  status === 'active'
                    ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
                    : "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200"
                )}
              >
                {isActive ? t('stores.active') : t('stores.inactive')}
              </span>
              
              {/* Hover Arrow */}
              {isActive && (
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
         </div>

                   {/* Stats Section */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-900">{productsCount}</span>
                <span className="text-xs text-gray-500 ml-1">Products</span>
              </div>
            </div>
            
            {/* Quick Actions */}
            {isActive && (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center hover:bg-primary-100 transition-colors">
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center hover:bg-primary-100 transition-colors">
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
       </div>
    </div>
  );
}; 