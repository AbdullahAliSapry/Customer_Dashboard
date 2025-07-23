

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FolderTree, Plus, Edit, Trash2, Filter, BarChart2 } from 'lucide-react';
import { ApiRepository } from '../Api/ApiRepository';
import Button from '../components/ui/Button';
import { ICategory } from '../interfaces/CategoryInterface';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/Store';
import { EndPoints } from '../Api/EndPoints';
import { useParams } from 'react-router-dom';
import { setCategories, deleteCategory } from '../Store/StoreSlice/CategorySlice';
import CategoryModal from '../components/forms/modals/CategoryModal';

const CategoryPage: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

  const categories = useSelector((state: RootState) => state.currentStore.category.categories);
  const { storeId } = useParams();

  useEffect(() => {
    const apiRepository = new ApiRepository();
    apiRepository.getAll<ICategory>(
      EndPoints.categories(storeId as string), 
      (payload) => setCategories(payload)
    );
  }, [storeId]);

  const handleEdit = (category: ICategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId: number) => {
  
      const apiRepository = new ApiRepository();
      try {
        await apiRepository.delete(
          EndPoints.category,
          categoryId.toString(),
          deleteCategory
        );
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    
  };

  const handleAddNew = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('categories.categories')}</h1>
        <div className="flex space-x-4">
          <Button
            leftIcon={<Filter size={18} />}
            variant="outline"
          >
            {t('categories.filter')}
          </Button>
          <Button
            leftIcon={<BarChart2 size={18} />}
            variant="outline"
          >
            {t('categories.analytics')}
          </Button>
          <Button
            leftIcon={<Plus size={18} />}
            onClick={handleAddNew}
          >
            {t('categories.add_category')}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('categories.category')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('categories.description')}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('categories.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                        <FolderTree size={18} className="text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
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
        <CategoryModal
          setIsOpen={setIsModalOpen}
          initialCategory={selectedCategory}
        />
      )}
    </div>
  );
};

export default CategoryPage;