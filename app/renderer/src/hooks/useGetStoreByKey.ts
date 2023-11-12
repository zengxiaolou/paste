import { useEffect, useState } from 'react';
import { StoreKey } from '@/types/enum';
function useLanguage(key: StoreKey) {
  const [value, setValue] = useState<string | number | boolean | undefined>(undefined);
  const getValue = async () => {
    const res = await window.ipc.getStoreValue(key);
    setValue(res);
  };

  useEffect(() => {
    getValue();
  }, []);
  return value;
}

export default useLanguage;
