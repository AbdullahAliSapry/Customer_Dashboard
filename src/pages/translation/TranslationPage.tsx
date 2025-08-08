import React, { useState, useEffect } from "react";
import SubscriptionModal from "./components/SubscriptionModal";
import {
  TranslationHeader,
  ServiceStatusCard,
  LanguagesSection,
  AddLanguageModal,
} from "./components";
import {
  StoreLanguageDto,
  LanguageCode,
} from "../../interfaces/Languageinterface";
import { useAppDispatch, useAppSelector } from "../../Store/Store";
import {
  addLanguage,
  deleteLanguage,
  getAll,
  setError,
  loading,
} from "../../Store/StoreSlice/StoreLanguageSlice";
import { useParams } from "react-router-dom";
import { ApiRepository } from "../../Api/ApiRepository";
import { EndPoints } from "../../Api/EndPoints";

export interface StoreLanguage {
  id: number;
  code: string;
  name: string;
  flag: string;
  isActive: boolean;
  automaticTranslationCount: number;
  manualTranslationCount: number;
  totalProducts: number;
  lastUpdated: string;
}

// Mapping for language codes to display info
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

const TranslationPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { storeLanguages: reduxLanguages } = useAppSelector(
    (state) => state.storeLanguages
  );

  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isServiceActive, setIsServiceActive] = useState(false);
  const [isAddLanguageModalOpen, setIsAddLanguageModalOpen] = useState(false);
  const [selectedLanguageCode, setSelectedLanguageCode] =
    useState<LanguageCode | null>(null);
  const [isDefaultLanguage, setIsDefaultLanguage] = useState(false);

  const { storeId } = useParams();

  const api = new ApiRepository();

  const storeLanguages: StoreLanguage[] = reduxLanguages.map((lang) => {
    const displayInfo = languageDisplayMap[lang.languageCode];
    return {
      id: lang.id,
      code: LanguageCode[lang.languageCode],
      name: displayInfo?.name || lang.languageName,
      flag: displayInfo?.flag || "🌍",
      isActive: !lang.isDefault,
      automaticTranslationCount: 0,
      manualTranslationCount: 0,
      totalProducts: 15,
      lastUpdated: new Date(lang.dateAdded).toISOString().split("T")[0],
    };
  });

  const availableLanguages = Object.entries(languageDisplayMap)
    .filter(
      ([code]) =>
        !reduxLanguages.some((lang) => lang.languageCode === parseInt(code))
    )
    .map(([code, info]) => ({
      code: parseInt(code) as LanguageCode,
      name: info.name,
      flag: info.flag,
    }));

  useEffect(() => {
    checkTranslationServiceStatus();
    if (storeId) {
      fetchStoreLanguages();
    }
  }, [storeId]);

  const fetchStoreLanguages = async () => {
    if (!storeId) return;
    
    try {
      dispatch(loading(true));
      await api.getAll(
        EndPoints.getLanguagesByStore(storeId),
        getAll,
        setError
      );
    } catch (error) {
      console.error("Error fetching store languages:", error);
    }
  };

  const checkTranslationServiceStatus = () => {
    setIsServiceActive(false);
  };

  const handleSubscribe = () => {
    setIsServiceActive(true);
    setIsSubscriptionModalOpen(false);
  };

  const handleLanguageSelect = (languageCode: LanguageCode) => {
    console.log("Selected language code:", languageCode);
    setSelectedLanguageCode(languageCode);
  };

  const handleAddLanguage = async () => {
    if (selectedLanguageCode !== null) {
      const displayInfo = languageDisplayMap[selectedLanguageCode];
      if (displayInfo) {
        const newLanguage: Omit<StoreLanguageDto, "id" | "dateAdded"> = {
          languageCode: selectedLanguageCode,
          languageName: displayInfo.name,
          isDefault: isDefaultLanguage,
          storeId: Number(storeId) || 0,
        };

        try {
          await api.create(EndPoints.addLanguage, newLanguage, addLanguage, setError);
          // إعادة جلب اللغات بعد الإضافة
          await fetchStoreLanguages();
        } catch (error) {
          console.error("Error adding language:", error);
        }
      }
    }
    setSelectedLanguageCode(null);
    setIsDefaultLanguage(false);
    setIsAddLanguageModalOpen(false);
  };

  const handleCancelAdd = () => {
    setSelectedLanguageCode(null);
    setIsDefaultLanguage(false);
    setIsAddLanguageModalOpen(false);
  };

  const handleRemoveLanguage = async (languageCode: string) => {
    const languageToRemove = reduxLanguages.find(
      (lang) => LanguageCode[lang.languageCode] === languageCode
    );
    if (languageToRemove) {
      try {
        await api.delete(
          EndPoints.deleteLanguage(languageToRemove.id.toString()),
          languageToRemove.id.toString(),
          deleteLanguage,
          setError
        );
        // إعادة جلب اللغات بعد الحذف
        await fetchStoreLanguages();
      } catch (error) {
        console.error("Error deleting language:", error);
      }
    }
  };

  const handleDefaultLanguageChange = (isDefault: boolean) => {
    setIsDefaultLanguage(isDefault);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <TranslationHeader isServiceActive={isServiceActive} />

        <ServiceStatusCard
          isServiceActive={isServiceActive}
          onActivate={() => setIsSubscriptionModalOpen(true)}
        />

        <LanguagesSection
          storeLanguages={storeLanguages}
          onAddLanguage={() => setIsAddLanguageModalOpen(true)}
          onRemoveLanguage={handleRemoveLanguage}
        />

        <AddLanguageModal
          isOpen={isAddLanguageModalOpen}
          onClose={() => setIsAddLanguageModalOpen(false)}
          selectedLanguageCode={selectedLanguageCode}
          isDefaultLanguage={isDefaultLanguage}
          availableLanguages={availableLanguages}
          storeLanguages={storeLanguages}
          onLanguageSelect={handleLanguageSelect}
          onAddLanguage={handleAddLanguage}
          onCancelAdd={handleCancelAdd}
          onDefaultLanguageChange={handleDefaultLanguageChange}
          languageDisplayMap={languageDisplayMap}
        />

        <SubscriptionModal
          isOpen={isSubscriptionModalOpen}
          onClose={() => setIsSubscriptionModalOpen(false)}
          onSubscribe={handleSubscribe}
        />
      </div>
    </div>
  );
};

export default TranslationPage;
