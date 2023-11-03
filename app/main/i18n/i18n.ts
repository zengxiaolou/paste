import i18n from 'i18next';
import I18NexFsBackend from 'i18next-fs-backend';
import { en } from './en';
import { zh } from './zh';

i18n.use(I18NexFsBackend).init({
  resources: {
    en: {
      translation: en,
    },
    zh: {
      translation: zh,
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export { default } from 'i18next';
