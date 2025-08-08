import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './translations/en';
import arTranslation from './translations/ar';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      ar: {
        translation: arTranslation,
      },
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    // Debug settings
    debug: true,
    saveMissing: true,
    missingKeyHandler: (lng, ns, key) => {
      console.warn(`Missing translation key: ${key} for language: ${lng}`);
    },
    appendNamespaceToCIMode: true,
    saveMissingTo: 'current',
  });

export default i18n;