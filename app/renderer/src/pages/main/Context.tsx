import React, { createContext, FC, useState } from 'react';
import { ClipData } from '@/types/type';

interface providerProps {
  children: React.ReactNode;
}
interface ContextType {
  search?: string;
  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
  deletedRecord?: ClipData;
  setDeletedRecord: React.Dispatch<React.SetStateAction<ClipData | undefined>>;
  total: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
}
export const Context = createContext<ContextType>({
  search: '',
  setSearch: () => {},
  deletedRecord: undefined,
  setDeletedRecord: () => {},
  total: 0,
  setTotal: () => {},
});
export const Provider: FC<providerProps> = ({ children }) => {
  const [search, setSearch] = useState<string>();
  const [deletedRecord, setDeletedRecord] = useState<ClipData | undefined>();
  const [total, setTotal] = useState<number>(0);
  return (
    <Context.Provider value={{ search, setSearch, deletedRecord, setDeletedRecord, total, setTotal }}>
      {children}
    </Context.Provider>
  );
};
