import { useEffect, useState } from 'react';
import { StoreKey } from '@/types/enum';
function useLanguage(key: StoreKey) {
  const [value, setValue] = useState<string | number | boolean | undefined>(undefined);

  useEffect(() => {
    const getValue = async () => {
      const res = await window.ipc.getStoreValue(key);
      setValue(res);
    };
    getValue();
  }, [key]);
  return value;
}

export default useLanguage;
