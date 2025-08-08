

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FolderTree, Plus, Edit, Trash2, Filter, BarChart2, Search, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const categories = useSelector((state: RootState) => state.currentStore.category.categories);
  const { storeId } = useParams();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const apiRepository = new ApiRepository();
        await apiRepository.getAll<ICategory>(
          EndPoints.categories(storeId as string), 
          (payload) => setCategories(payload)
        );
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [storeId]);

  const handleEdit = (category: ICategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId: number) => {
    if (window.confirm(t('categories.delete_confirmation'))) {
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
    }
  };

  const handleAddNew = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  const searchVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  };

  const EmptyState: React.FC = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm border border-gray-100"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
        className="flex items-center justify-center w-20 h-20 bg-primary-50 rounded-full mb-6"
      >
        <FolderTree className="text-primary-600" size={32} />
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-xl font-semibold text-gray-900 mb-3"
      >
        {t('categories.no_categories_title')}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-gray-600 mb-8 text-center max-w-md leading-relaxed"
      >
        {t('categories.no_categories_description')}
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <Button onClick={handleAddNew} leftIcon={<Plus size={18} />} className="min-w-[160px]">
          {t('categories.add_first_category')}
        </Button>
        <div className="text-xs text-gray-500 text-center">
          {t('categories.quick_setup_hint')}
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center"
      >
        {[1, 2, 3].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2"
            >
              <span className="text-blue-600 text-sm font-semibold">{index}</span>
            </motion.div>
            <span className="text-sm text-gray-600">
              {t(`categories.tip_${index}`)}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6"
      >
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 max-w-7xl mx-auto"
    >
      {/* Header Section */}
      <motion.div variants={headerVariants} className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              {t('categories.categories')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-600"
            >
              {t('categories.description')}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button
              leftIcon={<Filter size={18} />}
              variant="outline"
              className="order-2 sm:order-1"
            >
              {t('categories.filter')}
            </Button>
            <Button
              leftIcon={<BarChart2 size={18} />}
              variant="outline"
              className="order-3 sm:order-2"
            >
              {t('categories.analytics')}
            </Button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                leftIcon={<Plus size={18} />}
                onClick={handleAddNew}
                className="order-1 sm:order-3"
              >
                {t('categories.add_category')}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Search and Stats Section */}
      <AnimatePresence>
        {categories.length > 0 && (
          <motion.div
            variants={searchVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  placeholder={t('categories.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 text-sm text-gray-600"
              >
                <span>{t('categories.total_categories', { count: categories.length })}</span>
                <AnimatePresence>
                  {searchTerm && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-primary-600"
                    >
                      {t('categories.filtered_results', { count: filteredCategories.length })}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Section */}
      <AnimatePresence mode="wait">
        {categories.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EmptyState />
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {t('categories.category')}
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {t('categories.description')}
                    </th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {t('categories.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  <AnimatePresence>
                    {filteredCategories.length === 0 ? (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan={3} className="px-6 py-12 text-center">
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="flex flex-col items-center"
                          >
                            <Search className="text-gray-400 mb-2" size={24} />
                            <p className="text-gray-500">{t('categories.no_matching_categories')}</p>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSearchTerm('')}
                              className="text-primary-600 hover:text-primary-700 text-sm mt-1"
                            >
                              {t('categories.clear_search')}
                            </motion.button>
                          </motion.div>
                        </td>
                      </motion.tr>
                    ) : (
                      filteredCategories.map((category, index) => (
                        <motion.tr
                          key={category.id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 transition-colors"
                          whileHover={{ 
                            backgroundColor: "#f9fafb",
                            transition: { duration: 0.2 }
                          }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center"
                              >
                                <FolderTree size={20} className="text-primary-600" />
                              </motion.div>
                              <div className="ml-4">
                                <div className="text-sm font-semibold text-gray-900">{category.name}</div>
                                <div className="text-xs text-gray-500">ID: {category.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {category.description || t('categories.no_description')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEdit(category)}
                                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                title={t('common.edit')}
                              >
                                <Edit size={16} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1, backgroundColor: "#fef2f2" }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(category.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title={t('common.delete')}
                              >
                                <Trash2 size={16} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                <MoreVertical size={16} />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <CategoryModal
            setIsOpen={setIsModalOpen}
            initialCategory={selectedCategory}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CategoryPage;