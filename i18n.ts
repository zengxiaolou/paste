import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        All: 'All',
        Collect: 'Collect',
        Today: 'Today',
        Text: 'Text',
        Image: 'Image',
        Link: 'Link',
        'Type to Search': 'Type to Search',
        'On Top': 'On Top',
        'Remove from top': 'Remove from top',
        'Collect success': 'Collect success',
        'Collect failed': 'Collect failed',
        'Cancel Collect': 'Cancel Collect',
      },
    },
    zh: {
      translation: {
        All: '全部',
        Collect: '收藏',
        Today: '今天',
        Text: '文本',
        Image: '图像',
        Link: '链接',
        'Type to Search': '输入搜索',
        'On Top': '置顶',
        'Remove from top': '取消置顶',
        'Collect success': '收藏成功',
        'Collect failed': '收藏失败',
        'Cancel Collect': '取消收藏',
      },
    },
  },
  lng: 'en', // 默认语言
  fallbackLng: 'en', // 如果当前语言没有可用的翻译，则回退到该语言
  interpolation: {
    escapeValue: false,
  },
});
