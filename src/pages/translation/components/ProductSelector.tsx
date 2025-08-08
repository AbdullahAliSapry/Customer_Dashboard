import React from 'react';
import { useTranslation } from 'react-i18next';
import { Package, ShoppingCart, CheckCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  type: 'product' | 'service';
  description: string;
  isSelected: boolean;
}

interface ProductSelectorProps {
  products: Product[];
  selectedProducts: Product[];
  onProductToggle: (productId: string) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProducts,
  onProductToggle
}) => {
  const { t } = useTranslation();
  const selectedCount = selectedProducts.filter(p => p.isSelected).length;
  const totalCount = products.length;

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Package className="text-primary-600" size={16} />
          </div>
          <div>
                         <div className="font-medium text-gray-900">
               {t('translation.products_services')}
             </div>
             <div className="text-sm text-gray-600">
               {selectedCount} من {totalCount} {t('translation.selected_count')}
             </div>
          </div>
        </div>
                 <div className="text-right">
           <div className="text-2xl font-bold text-primary-600">
             {selectedCount}
           </div>
           <div className="text-xs text-gray-500">{t('translation.selected_count')}</div>
         </div>
      </div>

      {/* Products List */}
      <div className="space-y-3">
        {products.map((product) => {
          const isSelected = selectedProducts.find(p => p.id === product.id)?.isSelected || false;
          
          return (
            <div
              key={product.id}
              className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => onProductToggle(product.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    product.type === 'product' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {product.type === 'product' ? (
                      <ShoppingCart size={16} />
                    ) : (
                      <Package size={16} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">
                        {product.name}
                      </h4>
                                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                         product.type === 'product'
                           ? 'bg-blue-100 text-blue-700'
                           : 'bg-green-100 text-green-700'
                       }`}>
                         {product.type === 'product' ? t('translation.product') : t('translation.service')}
                       </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {product.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {isSelected && (
                    <div className="bg-primary-500 text-white rounded-full p-1">
                      <CheckCircle size={16} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            // Select all products
            products.forEach(product => {
              if (!selectedProducts.find(p => p.id === product.id)?.isSelected) {
                onProductToggle(product.id);
              }
            });
          }}
                     className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
         >
           {t('translation.select_all')}
         </button>
         
         <button
           onClick={() => {
             // Deselect all products
             selectedProducts.forEach(product => {
               if (product.isSelected) {
                 onProductToggle(product.id);
               }
             });
           }}
           className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
         >
           {t('translation.deselect_all')}
         </button>
      </div>
    </div>
  );
};

export default ProductSelector; 