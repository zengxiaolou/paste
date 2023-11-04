import { useEffect, useState } from 'react';
import i18n from '../i18n/index';
function useLanguage() {
  const [lng, setLng] = useState<string>('');
  const getLanguage = async () => {
    const lng = (await window.ipc.getStoreValue('language')) as string;
    if (lng) {
      i18n.changeLanguage(lng);
    }
    setLng(lng);
  };

  useEffect(() => {
    getLanguage();
  }, []);
  return lng;
}

export default useLanguage;
