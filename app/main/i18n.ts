import i18n from 'i18next';
import I18NexFsBackend from 'i18next-fs-backend';

i18n.use(I18NexFsBackend).init({
  resources: {
    en: {
      translation: {
        quit: 'quit',
        'Stop Monitoring Clipboard': 'Stop Monitoring Clipboard',
        'Resume Monitoring Clipboard': 'Resume Monitoring Clipboard',
        Preferences: 'Preferences...',
      },
    },
    zh: {
      translation: {
        quit: '退出',
        'Stop Monitoring Clipboard': '停止监控剪贴板',
        'Resume Monitoring Clipboard': '继续监控剪贴板',
        Preferences: '偏好设置',
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export { default } from 'i18next';
