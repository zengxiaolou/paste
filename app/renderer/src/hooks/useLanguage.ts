import { useEffect, useState } from 'react';
import i18n from '../i18n';

// 自定义 Hook
function useLanguage() {
  const [lng, setLng] = useState<string>(''); // 初始化语言状态
  useEffect(() => {
    const getLanguage = async () => {
      const lng = await window.ipc.getStoreValue('language');
      if (lng) {
        i18n.changeLanguage(lng);
      }
      setLng(lng);
    };
    getLanguage();
  }, []);
  return lng;
}

export default useLanguage;
