import React, { createContext, FC, useState } from 'react';
import { ClipData } from './type';

interface providerProps {
  children: React.ReactNode;
}
interface ContextType {
  search: string | undefined;
  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
  deletedRecord?: ClipData;
  setDeletedRecord: React.Dispatch<React.SetStateAction<ClipData | undefined>>;
}
export const Context = createContext<ContextType>({
  search: '',
  setSearch: () => {},
  deletedRecord: undefined,
  setDeletedRecord: () => {},
});
export const Provider: FC<providerProps> = ({ children }) => {
  const [search, setSearch] = useState<string>();
  const [deletedRecord, setDeletedRecord] = useState<ClipData | undefined>();
  return <Context.Provider value={{ search, setSearch, deletedRecord, setDeletedRecord }}>{children}</Context.Provider>;
};
