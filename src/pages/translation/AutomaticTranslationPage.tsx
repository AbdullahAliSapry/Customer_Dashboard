import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, Link } from "react-router-dom";
import {
  Globe,
  Languages,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Package,
  ShoppingCart,
  FileText,
  Zap,
  Crown,
  ArrowLeft,
} from "lucide-react";
import SubscriptionModal from "./components/SubscriptionModal";
import LanguageSelector from "./components/LanguageSelector";
import ProductSelector from "./components/ProductSelector";
import TranslationProgress from "./components/TranslationProgress";
import TranslationHistory from "./components/TranslationHistory";

interface Language {
  code: string;
  name: string;
  flag: string;
  isSelected: boolean;
}

interface Product {
  id: string;
  name: string;
  type: "product" | "service";
  description: string;
  isSelected: boolean;
}

const AutomaticTranslationPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isServiceActive, setIsServiceActive] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);

  const availableLanguages: Language[] = [
    { code: "en", name: "English", flag: "🇺🇸", isSelected: false },
    { code: "ar", name: "العربية", flag: "🇸🇦", isSelected: false },
    { code: "fr", name: "Français", flag: "🇫🇷", isSelected: false },
    { code: "es", name: "Español", flag: "🇪🇸", isSelected: false },
    { code: "de", name: "Deutsch", flag: "🇩🇪", isSelected: false },
    { code: "it", name: "Italiano", flag: "🇮🇹", isSelected: false },
    { code: "pt", name: "Português", flag: "🇵🇹", isSelected: false },
    { code: "ru", name: "Русский", flag: "🇷🇺", isSelected: false },
    { code: "zh", name: "中文", flag: "🇨🇳", isSelected: false },
    { code: "ja", name: "日本語", flag: "🇯🇵", isSelected: false },
  ];

  const mockProducts: Product[] = [
    {
      id: "1",
      name: "منتج تجريبي 1",
      type: "product",
      description: "وصف المنتج الأول",
      isSelected: false,
    },
    {
      id: "2",
      name: "منتج تجريبي 2",
      type: "product",
      description: "وصف المنتج الثاني",
      isSelected: false,
    },
    {
      id: "3",
      name: "خدمة تجريبية 1",
      type: "service",
      description: "وصف الخدمة الأولى",
      isSelected: false,
    },
    {
      id: "4",
      name: "خدمة تجريبية 2",
      type: "service",
      description: "وصف الخدمة الثانية",
      isSelected: false,
    },
  ];

  useEffect(() => {
    checkTranslationServiceStatus();
    
    // Set language from URL params
    const langParam = searchParams.get('lang');
    if (langParam) {
      const language = availableLanguages.find(lang => lang.code === langParam);
      if (language) {
        setSelectedLanguage(language);
      }
    }
  }, [searchParams]);

  const checkTranslationServiceStatus = () => {
    setIsServiceActive(false); // افتراضي غير مفعل
  };

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts((prev) => {
      const existingProduct = prev.find((p) => p.id === productId);
      if (existingProduct) {
        return prev.map((product) =>
          product.id === productId
            ? { ...product, isSelected: !product.isSelected }
            : product
        );
      } else {
        const productToAdd = mockProducts.find((p) => p.id === productId);
        if (productToAdd) {
          return [...prev, { ...productToAdd, isSelected: true }];
        }
      }
      return prev;
    });
  };

  const handleStartTranslation = async () => {
    if (!isServiceActive) {
      setIsSubscriptionModalOpen(true);
      return;
    }

    if (!selectedLanguage) {
      alert(t("translation.select_language"));
      return;
    }

    if (selectedProducts.filter((p) => p.isSelected).length === 0) {
      alert(t("translation.select_products"));
      return;
    }

    setIsTranslating(true);
    setTranslationProgress(0);

    // محاكاة عملية الترجمة
    const interval = setInterval(() => {
      setTranslationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTranslating(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleSubscribe = () => {
    setIsServiceActive(true);
    setIsSubscriptionModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="../translation"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="text-gray-600" size={20} />
              </Link>
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg animate-pulse">
                <Zap className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {t("translation.automatic.title")}
                </h1>
                <p className="text-gray-600 mt-1">
                  {t("translation.automatic.subtitle")}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {!isServiceActive && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="text-yellow-600" size={16} />
                  <span className="text-yellow-800 text-sm font-medium">
                    {t("translation.additional_service")}
                  </span>
                </div>
              )}
              {isServiceActive && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="text-green-600" size={16} />
                  <span className="text-green-800 text-sm font-medium">
                    {t("translation.active")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Service Status Card */}
        {!isServiceActive && (
          <div className="mb-8 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slide-down">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg animate-bounce-slow">
                  <Crown className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t("translation.activate_service")}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t("translation.activate_description")}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="text-green-500" size={16} />
                      <span className="text-sm text-gray-700">
                        {t("translation.instant_translation")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="text-green-500" size={16} />
                      <span className="text-sm text-gray-700">
                        {t("translation.support_languages")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="text-green-500" size={16} />
                      <span className="text-sm text-gray-700">
                        {t("translation.high_quality")}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsSubscriptionModalOpen(true)}
                    className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 animate-bounce-slow"
                  >
                    {t("translation.activate_now")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {isServiceActive && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Left Column - Language & Product Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Language Selection */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Languages className="text-primary-600" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t("translation.select_language")}
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <LanguageSelector
                    languages={availableLanguages}
                    selectedLanguage={selectedLanguage}
                    onLanguageSelect={handleLanguageSelect}
                  />
                </div>
              </div>

              {/* Product Selection */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Package className="text-primary-600" size={20} />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {t("translation.select_products")}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>
                        {selectedProducts.filter((p) => p.isSelected).length}
                      </span>
                      <span>/</span>
                      <span>{mockProducts.length}</span>
                      <span>{t("translation.selected_count")}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <ProductSelector
                    products={mockProducts}
                    selectedProducts={selectedProducts}
                    onProductToggle={handleProductToggle}
                  />
                </div>
              </div>

              {/* Start Translation Button */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <button
                    onClick={handleStartTranslation}
                    disabled={
                      !selectedLanguage ||
                      selectedProducts.filter((p) => p.isSelected).length ===
                        0 ||
                      isTranslating
                    }
                    className="w-full px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-3"
                  >
                    {isTranslating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>{t("translation.translating")}</span>
                      </>
                    ) : (
                      <>
                        <Zap className="text-white" size={20} />
                        <span>{t("translation.start_translation")}</span>
                        <ArrowRight className="text-white" size={20} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Progress & History */}
            <div className="space-y-6">
              {/* Translation Progress */}
              {isTranslating && (
                <TranslationProgress progress={translationProgress} />
              )}

              {/* Translation History */}
              <TranslationHistory />
            </div>
          </div>
        )}

        {/* Subscription Modal */}
        <SubscriptionModal
          isOpen={isSubscriptionModalOpen}
          onClose={() => setIsSubscriptionModalOpen(false)}
          onSubscribe={handleSubscribe}
        />
      </div>
    </div>
  );
};

export default AutomaticTranslationPage; 