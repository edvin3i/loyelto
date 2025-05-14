import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { businessSlogans_en, businessSlogans_fr } from './landing/slogans';


const resources = {
  en: {
    translation: {
      mainHeading: 'Loyalty Points Without Limits',
      joinLoyeltoButton: 'Join LoyelTo',
      businessSloganTitle: 'For BUSINESSES',
      businessSlogans: {businessSlogans_en},
      consumerSloganTitle: 'For CUSTOMERS',
      waitListFormHeading: 'Join Waitlist',
      waitListFormCompany: 'Company Name',
      waitListFormPhone: 'Phone Number',
      waitListFormEmail: 'E-mail',
      waitListFormButton: 'Submit'
    },
  },
  fr: {
    translation: {
      mainHeading: 'La Fidélité Nouvelle Génération',
      joinLoyeltoButton: 'Rejoindre LoyelTo',
      businessSloganTitle: 'Pour les ENTREPRISES',
      businessSlogans: {businessSlogans_fr},
      consumerSloganTitle: 'Pour les CLIENTS',
      waitListFormHeading: "Rejoindre la liste d'attente",
      waitListFormCompany: "Nom de l'entreprise",
      waitListFormPhone: 'Numéro de téléphone',
      waitListFormEmail: 'E-mail',
      waitListFormButton: 'Envoyer le formulaire'
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
