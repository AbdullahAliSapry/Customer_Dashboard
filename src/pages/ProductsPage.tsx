

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, BarChart2, Filter, Plus, Edit, Trash2 } from 'lucide-react';
import { ApiRepository } from '../Api/ApiRepository';
import Button from '../components/ui/Button';
import { IProduct } from '../interfaces/ProductInterface';
import { setProducts, deleteProduct } from '../Store/StoreSlice/ProductSlice';
import { useSelector} from 'react-redux';
import { RootState } from '../Store/Store';
import { EndPoints } from '../Api/EndPoints';
import { useParams } from 'react-router-dom';
import ProductModal from '../components/forms/modals/ProductModal';

const ProductsPage: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  const products = useSelector((state: RootState) => state.currentStore.products.products);
  const { storeId } = useParams();

  useEffect(() => {
    const apiRepository = new ApiRepository();
    apiRepository.getAll<IProduct>(EndPoints.products(storeId as string), setProducts);
  }, [storeId]);

  const handleEdit = (product: IProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: number) => {
      const apiRepository = new ApiRepository();
      try {
        await apiRepository.delete(EndPoints.product,productId.toString(),deleteProduct);
      } catch (error) {
        console.error('Error deleting product:', error);
    }
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('products.products')}</h1>
        <div className="flex space-x-4">
          <Button
            leftIcon={<Filter size={18} />}
            variant="outline"
          >
            {t('products.filter')}
          </Button>
          <Button
            leftIcon={<BarChart2 size={18} />}
            variant="outline"
          >
            {t('products.analytics')}
          </Button>
          <Button
            leftIcon={<Plus size={18} />}
            onClick={handleAddNew}
          >
            {t('products.add_product')}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('products.product')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('products.price')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('products.stock')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('products.discount')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('products.duration')}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('products.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                        <Package size={18} className="text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.discount}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.duration} {t('products.days')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ProductModal
          setIsOpen={setIsModalOpen}
          initialProduct={selectedProduct}
        />
      )}
    </div>
  );
};

export default ProductsPage;