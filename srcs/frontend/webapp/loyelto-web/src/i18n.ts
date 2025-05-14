import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      mainHeading: 'Loyalty Points Without Limits',
      joinLoyeltoButton: 'Join LoyelTo',
      businessSloganTitle: 'For BUSINESSES',
      consumerSloganTitle: 'For CUSTOMERS',
      // Add more keys here
    },
  },
  fr: {
    translation: {
      mainHeading: 'La Fidélité Nouvelle Génération',
      joinLoyeltoButton: 'Rejoindre LoyelTo',
      businessSloganTitle: 'Pour les ENTREPRISES',
      consumerSloganTitle: 'Pour les CLIENTS',
      // Add more keys here
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
