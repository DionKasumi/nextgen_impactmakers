import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationAL from './locales/al/translation.json';

const resources = {
    en: { translation: translationEN },
    al: { translation: translationAL },
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language
    interpolation: {
        escapeValue: false, // React already does escaping
    },
});

export default i18n;
