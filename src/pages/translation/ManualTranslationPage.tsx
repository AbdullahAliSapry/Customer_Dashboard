import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  Package,
  Globe,
  CheckCircle,
  X,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useAppSelector } from "../../Store/Store";
import {
  addTranslation,
  updateTranslation,
  deleteTranslation,
  setError,
  getAllProductsWithTranslations,
} from "../../Store/StoreSlice/ManualTranslationSlice";
import { ApiRepository } from "../../Api/ApiRepository";
import { EndPoints } from "../../Api/EndPoints";
import { ProductWithTranslation } from "../../interfaces/TranslationInterface";
import { LanguageCode } from "../../interfaces/Languageinterface";

const ManualTranslationPage: React.FC = () => {
  const { t } = useTranslation();
  const { storeId } = useParams();
  const [searchParams] = useSearchParams();
  const langId = searchParams.get("langId");
  const lang = searchParams.get("lang");
  const langName = searchParams.get("langName");

  const { productsWithTranslations } = useAppSelector(
    (state) => state.manualTranslation
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithTranslation | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTranslation, setEditingTranslation] =
    useState<ProductWithTranslation | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "translated" | "not-translated">("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const api = new ApiRepository();

  useEffect(() => {
    if (langId && storeId) {
      fetchProductsWithTranslations();
    }
  }, [langId, storeId]);



  const fetchProductsWithTranslations = async () => {
    if (!langId || !storeId) return;

    try {
      // api
      await api.getAll(
        EndPoints.getProductsWithTranslation(storeId, langId),
        getAllProductsWithTranslations,
        setError
      );
    } catch (error) {
      console.error("Error fetching products with translations:", error);
    }
  };

  const handleAddTranslation = async () => {
    if (!selectedProduct || !langId || !storeId) return;

    const newTranslation = {
      name: formData.name,
      description: formData.description,
      languageCode: parseInt(langId) as LanguageCode,
      productId: selectedProduct.product.id,
      storeLanguageId: 1, // سيتم استبداله بـ storeLanguageId الحقيقي
    };

    try {
      await api.create(
        EndPoints.addProductTranslation,
        newTranslation,
        addTranslation,
        setError
      );
      setIsAddModalOpen(false);
      setFormData({ name: "", description: "" });
      setSelectedProduct(null);
      
      // إعادة تحميل البيانات لتحديث حالة الترجمة
      await fetchProductsWithTranslations();
    } catch (error) {
      console.error("Error adding translation:", error);
    }
  };

  const handleUpdateTranslation = async () => {
    if (!editingTranslation || !editingTranslation.translation) return;

    const updatedTranslation = {
      ...editingTranslation.translation,
      name: formData.name,
      description: formData.description,
    };

    try {
      await api.update(
        EndPoints.updateProductTranslation(
          editingTranslation.translation.id.toString()
        ),
        editingTranslation.translation.id.toString(),
        updatedTranslation,
        updateTranslation,
        setError
      );
      setIsEditModalOpen(false);
      setFormData({ name: "", description: "" });
      setEditingTranslation(null);
      
      // إعادة تحميل البيانات لتحديث حالة الترجمة
      await fetchProductsWithTranslations();
    } catch (error) {
      console.error("Error updating translation:", error);
    }
  };

  const handleDeleteTranslation = async (translationId: number) => {
    try {
      await api.delete(
        EndPoints.deleteProductTranslation(translationId.toString()),
        translationId.toString(),
        deleteTranslation,
        setError
      );
      
      // إعادة تحميل البيانات لتحديث حالة الترجمة
      await fetchProductsWithTranslations();
    } catch (error) {
      console.error("Error deleting translation:", error);
    }
  };

  const openAddModal = (productWithTranslation: ProductWithTranslation) => {
    setSelectedProduct(productWithTranslation);
    setFormData({
      name: "",
      description: "",
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (productWithTranslation: ProductWithTranslation) => {
    if (!productWithTranslation.translation) return;

    setEditingTranslation(productWithTranslation);
    setFormData({
      name: productWithTranslation.translation.name,
      description: productWithTranslation.translation.description,
    });
    setIsEditModalOpen(true);
  };

  // إحصائيات
  const totalProducts = productsWithTranslations.length;
  const translatedProducts = productsWithTranslations.filter(p => 
    p.translation && 
    p.translation !== null && 
    p.translation !== undefined && 
    typeof p.translation === 'object' &&
    p.translation.id !== undefined &&
    p.translation.id !== null
  ).length;
  const notTranslatedProducts = totalProducts - translatedProducts;
  const translationProgress = totalProducts > 0 ? Math.round((translatedProducts / totalProducts) * 100) : 0;

  // فلترة المنتجات
  const filteredProducts = productsWithTranslations.filter(
    (productWithTranslation) => {
      const matchesSearch = 
        productWithTranslation.product.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        productWithTranslation.product.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      
      const hasValidTranslation = productWithTranslation.translation && 
                                 productWithTranslation.translation !== null && 
                                 productWithTranslation.translation !== undefined && 
                                 typeof productWithTranslation.translation === 'object' &&
                                 productWithTranslation.translation.id !== undefined &&
                                 productWithTranslation.translation.id !== null;
      
      const matchesFilter = 
        filterStatus === "all" ||
        (filterStatus === "translated" && hasValidTranslation) ||
        (filterStatus === "not-translated" && !hasValidTranslation);
      
      return matchesSearch && matchesFilter;
    }
  );

  const languageDisplayMap = {
    [LanguageCode.ar]: { name: "العربية", flag: "🇸🇦" },
    [LanguageCode.en]: { name: "English", flag: "🇺🇸" },
    [LanguageCode.fr]: { name: "Français", flag: "🇫🇷" },
    [LanguageCode.es]: { name: "Español", flag: "🇪🇸" },
    [LanguageCode.de]: { name: "Deutsch", flag: "🇩🇪" },
    [LanguageCode.it]: { name: "Italiano", flag: "🇮🇹" },
    [LanguageCode.ru]: { name: "Русский", flag: "🇷🇺" },
    [LanguageCode.zh]: { name: "中文", flag: "🇨🇳" },
    [LanguageCode.ja]: { name: "日本語", flag: "🇯🇵" },
    [LanguageCode.tr]: { name: "Türkçe", flag: "🇹🇷" },
    [LanguageCode.hi]: { name: "हिन्दी", flag: "🇮🇳" },
    [LanguageCode.ur]: { name: "اردو", flag: "🇵🇰" },
    [LanguageCode.pt]: { name: "Português", flag: "🇵🇹" },
  };

  // Use lang and langName from URL if available, otherwise fall back to langId
  const currentLanguage = lang && langName 
    ? { name: langName, flag: languageDisplayMap[parseInt(lang) as LanguageCode]?.flag || "🌐" }
    : langId
    ? languageDisplayMap[parseInt(langId) as LanguageCode]
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to={`/store/${storeId}/translation`}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="text-gray-600" size={20} />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-lg">
                  <Edit3 className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {t("translation.manual.title")}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {t("translation.manual.subtitle")}
                  </p>
                </div>
              </div>
            </div>
            {currentLanguage && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <Globe className="text-blue-600" size={16} />
                <span className="text-blue-800 text-sm font-medium">
                  {currentLanguage.flag} {currentLanguage.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t("translation.total_products")}</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t("translation.translated_products")}</p>
                <p className="text-2xl font-bold text-green-600">{translatedProducts}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t("translation.not_translated")}</p>
                <p className="text-2xl font-bold text-orange-600">{notTranslatedProducts}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertCircle className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t("translation.progress")}</p>
                <p className="text-2xl font-bold text-purple-600">{translationProgress}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t("translation.translation_progress")}</h3>
            <span className="text-sm font-medium text-gray-600">{translationProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${translationProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
            <span>{t("translation.translated")}: {translatedProducts}</span>
            <span>{t("translation.remaining")}: {notTranslatedProducts}</span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder={t("translation.search_products")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Filter className="text-gray-600" size={20} />
                <span className="text-sm font-medium text-gray-700">{t("translation.filter")}</span>
              </button>
              
              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setFilterStatus("all");
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        filterStatus === "all" 
                          ? "bg-primary-100 text-primary-700" 
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {t("translation.all_products")}
                    </button>
                    <button
                      onClick={() => {
                        setFilterStatus("translated");
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        filterStatus === "translated" 
                          ? "bg-green-100 text-green-700" 
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {t("translation.translated_only")}
                    </button>
                    <button
                      onClick={() => {
                        setFilterStatus("not-translated");
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        filterStatus === "not-translated" 
                          ? "bg-orange-100 text-orange-700" 
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {t("translation.not_translated_only")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {t("translation.showing")} <span className="font-medium">{filteredProducts.length}</span> {t("translation.of")} <span className="font-medium">{totalProducts}</span> {t("translation.products")}
            </p>
            {filterStatus !== "all" && (
              <button
                onClick={() => setFilterStatus("all")}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {t("translation.clear_filter")}
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((productWithTranslation) => {
              const { product, translation } = productWithTranslation;
              // تحسين التحقق من وجود الترجمة
              const hasTranslation = translation && 
                                   translation !== null && 
                                   translation !== undefined && 
                                   typeof translation === 'object' &&
                                   translation.id !== undefined &&
                                   translation.id !== null;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* Product Header */}
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-100 via-primary-200 to-secondary-100 rounded-xl flex items-center justify-center shadow-md">
                          <Package className="text-primary-600" size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 font-medium">
                            ${product.price}
                          </p>
                        </div>
                      </div>
                      {hasTranslation && (
                        <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 rounded-full shadow-sm">
                          <CheckCircle className="text-emerald-600" size={16} />
                          <span className="text-emerald-800 text-xs font-semibold">
                            {t("translation.translated")}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-4 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Translation Status */}
                  <div className="p-6">
                    {hasTranslation ? (
                      <div className="space-y-4">
                        {/* Translation Content */}
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
                          <div className="flex items-center space-x-2 mb-4">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                              <CheckCircle className="text-emerald-600" size={16} />
                            </div>
                            <h4 className="font-semibold text-emerald-900">
                              {t("translation.translated_name")}
                            </h4>
                          </div>
                          <p className="text-sm text-emerald-800 bg-white/60 px-3 py-2 rounded-lg border border-emerald-100">
                            {translation?.name || ''}
                          </p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
                          <div className="flex items-center space-x-2 mb-4">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                              <CheckCircle className="text-emerald-600" size={16} />
                            </div>
                            <h4 className="font-semibold text-emerald-900">
                              {t("translation.translated_description")}
                            </h4>
                          </div>
                          <p className="text-sm text-emerald-800 bg-white/60 px-3 py-2 rounded-lg border border-emerald-100 min-h-[60px]">
                            {translation?.description || ''}
                          </p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center space-x-3 pt-2">
                          <button
                            onClick={() => openEditModal(productWithTranslation)}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-700 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            <Edit3 size={18} />
                            <span>{t("translation.edit_translation")}</span>
                          </button>
                          <button
                            onClick={() =>
                              translation?.id && handleDeleteTranslation(translation.id)
                            }
                            className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => openAddModal(productWithTranslation)}
                        className="w-full px-6 py-4 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:via-secondary-600 hover:to-primary-700 transition-all duration-300 font-semibold flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        <Plus size={20} />
                        <span>{t("translation.add_translation")}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || filterStatus !== "all" 
                ? t("translation.no_products_found") 
                : t("translation.no_products")}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || filterStatus !== "all"
                ? t("translation.no_products_found_description")
                : t("translation.no_products_description")}
            </p>
            {(searchTerm || filterStatus !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                }}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                {t("translation.clear_filters")}
              </button>
            )}
          </div>
        )}

                 {/* Add Translation Modal */}
         {isAddModalOpen && selectedProduct && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
             <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
               <div className="p-6 border-b border-gray-200">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                     <div className="p-2 bg-primary-100 rounded-lg">
                       <Plus className="text-primary-600" size={20} />
                     </div>
                     <div>
                       <h2 className="text-2xl font-bold text-gray-900">
                         {t("translation.add_translation")}
                       </h2>
                       <p className="text-gray-600 mt-1">
                         {currentLanguage?.flag} {currentLanguage?.name}
                       </p>
                     </div>
                   </div>
                   <button
                     onClick={() => setIsAddModalOpen(false)}
                     className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                     <X className="text-gray-500" size={20} />
                   </button>
                 </div>
               </div>

               <div className="p-6">
                 {/* Translation Form */}
                 <div className="bg-primary-50 rounded-lg p-4 mb-6">
                   <h3 className="text-lg font-semibold text-primary-900 mb-3 flex items-center">
                     <Globe className="text-primary-600 mr-2" size={18} />
                     {t("translation.translation_form")}
                   </h3>
                   
                   {/* Product Info */}
                   <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                     <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                       <Package className="text-gray-600 mr-2" size={16} />
                       {t("translation.original_product")}
                     </h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           {t("translation.original_name")}
                         </label>
                         <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                           {selectedProduct.product.name}
                         </p>
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           {t("translation.original_description")}
                         </label>
                         <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border min-h-[60px]">
                           {selectedProduct.product.description}
                         </p>
                       </div>
                     </div>
                     
                     {/* Language Info */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           {t("translation.target_language")}
                         </label>
                         <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                           {currentLanguage?.flag} {currentLanguage?.name}
                         </p>
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           {t("translation.product_id")}
                         </label>
                         <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                           #{selectedProduct.product.id}
                         </p>
                       </div>
                     </div>
                   </div>
                   
                   {/* Translation Fields */}
                   <div className="space-y-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         {t("translation.translated_name")} *
                       </label>
                       <input
                         type="text"
                         value={formData.name}
                         onChange={(e) =>
                           setFormData({ ...formData, name: e.target.value })
                         }
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                         placeholder={t("translation.enter_translated_name")}
                         required
                       />
                       {formData.name && (
                         <p className="text-xs text-gray-500 mt-1">
                           {t("translation.character_count")}: {formData.name.length}
                         </p>
                       )}
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         {t("translation.translated_description")} *
                       </label>
                       <textarea
                         value={formData.description}
                         onChange={(e) =>
                           setFormData({
                             ...formData,
                             description: e.target.value,
                           })
                         }
                         rows={4}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                         placeholder={t("translation.enter_translated_description")}
                         required
                       />
                       {formData.description && (
                         <p className="text-xs text-gray-500 mt-1">
                           {t("translation.character_count")}: {formData.description.length}
                         </p>
                       )}
                     </div>
                   </div>
                 </div>

                 <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                   <button
                     onClick={() => setIsAddModalOpen(false)}
                     className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                     {t("common.cancel")}
                   </button>
                   <button
                     onClick={handleAddTranslation}
                     disabled={!formData.name.trim() || !formData.description.trim()}
                     className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2">
                     <Plus size={16} />
                     <span>{t("translation.add_translation")}</span>
                   </button>
                 </div>
               </div>
             </div>
           </div>
         )}

                 {/* Edit Translation Modal */}
         {isEditModalOpen &&
           editingTranslation &&
           editingTranslation.translation && (
             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                 <div className="p-6 border-b border-gray-200">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-3">
                       <div className="p-2 bg-blue-100 rounded-lg">
                         <Edit3 className="text-blue-600" size={20} />
                       </div>
                       <div>
                         <h2 className="text-2xl font-bold text-gray-900">
                           {t("translation.edit_translation")}
                         </h2>
                         <p className="text-gray-600 mt-1">
                           {currentLanguage?.flag} {currentLanguage?.name}
                         </p>
                       </div>
                     </div>
                     <button
                       onClick={() => setIsEditModalOpen(false)}
                       className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                       <X className="text-gray-500" size={20} />
                     </button>
                   </div>
                 </div>

                 <div className="p-6">
                   {/* Edit Translation Form */}
                   <div className="bg-blue-50 rounded-lg p-4 mb-6">
                     <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                       <Edit3 className="text-blue-600 mr-2" size={18} />
                       {t("translation.edit_translation_form")}
                     </h3>
                     
                     {/* Product and Translation Info */}
                     <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                       <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                         <Package className="text-gray-600 mr-2" size={16} />
                         {t("translation.original_product")}
                       </h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">
                             {t("translation.original_name")}
                           </label>
                           <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                             {editingTranslation.product.name}
                           </p>
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">
                             {t("translation.original_description")}
                           </label>
                           <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border min-h-[60px]">
                             {editingTranslation.product.description}
                           </p>
                         </div>
                       </div>
                       
                       <h4 className="font-medium text-green-900 mb-3 flex items-center">
                         <CheckCircle className="text-green-600 mr-2" size={16} />
                         {t("translation.current_translation")}
                       </h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">
                             {t("translation.current_name")}
                           </label>
                                                       <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                              {editingTranslation.translation.name}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t("translation.current_description")}
                            </label>
                            <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border min-h-[60px]">
                              {editingTranslation.translation.description}
                            </p>
                          </div>
                       </div>
                       
                       {/* Language and Translation Info */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">
                             {t("translation.target_language")}
                           </label>
                           <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                             {currentLanguage?.flag} {currentLanguage?.name}
                           </p>
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">
                             {t("translation.translation_id")}
                           </label>
                                                       <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                              #{editingTranslation.translation.id}
                            </p>
                         </div>
                       </div>
                     </div>
                     
                     {/* Translation Fields */}
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           {t("translation.translated_name")} *
                         </label>
                         <input
                           type="text"
                           value={formData.name}
                           onChange={(e) =>
                             setFormData({ ...formData, name: e.target.value })
                           }
                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                           placeholder={t("translation.enter_translated_name")}
                           required
                         />
                         {formData.name && (
                           <p className="text-xs text-gray-500 mt-1">
                             {t("translation.character_count")}: {formData.name.length}
                           </p>
                         )}
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           {t("translation.translated_description")} *
                         </label>
                         <textarea
                           value={formData.description}
                           onChange={(e) =>
                             setFormData({
                               ...formData,
                               description: e.target.value,
                             })
                           }
                           rows={4}
                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                           placeholder={t("translation.enter_translated_description")}
                           required
                         />
                         {formData.description && (
                           <p className="text-xs text-gray-500 mt-1">
                             {t("translation.character_count")}: {formData.description.length}
                           </p>
                         )}
                       </div>
                     </div>
                   </div>

                   <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                     <button
                       onClick={() => setIsEditModalOpen(false)}
                       className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                       {t("common.cancel")}
                     </button>
                     <button
                       onClick={handleUpdateTranslation}
                       disabled={!formData.name.trim() || !formData.description.trim()}
                       className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2">
                       <Edit3 size={16} />
                       <span>{t("translation.update_translation")}</span>
                     </button>
                   </div>
                 </div>
               </div>
             </div>
           )}
      </div>
    </div>
  );
};

export default ManualTranslationPage;
