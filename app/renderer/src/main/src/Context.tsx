import React, { createContext, FC, useState } from 'react';

interface providerProps {
  children: React.ReactNode;
}
interface ContextType {
  search: string | undefined;
  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
  deletedId: number | undefined;
  setDeletedId: React.Dispatch<React.SetStateAction<number | undefined>>;
}
export const Context = createContext<ContextType>({
  search: '',
  setSearch: () => {},
  deletedId: undefined,
  setDeletedId: () => {},
});
export const Provider: FC<providerProps> = ({ children }) => {
  const [search, setSearch] = useState<string>();
  const [deletedId, setDeletedId] = useState<number | undefined>();
  return <Context.Provider value={{ search, setSearch, deletedId, setDeletedId }}>{children}</Context.Provider>;
};
