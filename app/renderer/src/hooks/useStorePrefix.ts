import { useEffect, useState } from 'react';

export const useStorePrefix = (prefix: string) => {
  const [values, setValues] = useState<Record<string, any>>({});

  const getValues = async () => {
    const res = await window.ipc.getStoreValues(prefix);
    setValues(res);
  };

  useEffect(() => {
    getValues();
  }, []);

  return values;
};
