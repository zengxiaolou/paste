import { useEffect, useState } from 'react';

export const useStorePrefix = (prefix: string) => {
  const [values, setValues] = useState<Record<string, any>>({});

  useEffect(() => {
    const getValues = async () => {
      const res = await window.ipc.getStoreValues(prefix);
      setValues(res);
    };
    getValues();
  }, [prefix]);

  return values;
};
