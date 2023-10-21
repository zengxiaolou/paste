import React, { createContext, FC, useState } from 'react';

interface providerProps {
  children: React.ReactNode;
}
interface ContextType {
  search: string | undefined;
  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
}
export const Context = createContext<ContextType>({ search: '', setSearch: () => {} });
export const Provider: FC<providerProps> = ({ children }) => {
  const [search, setSearch] = useState<string>();
  return <Context.Provider value={{ search, setSearch }}>{children}</Context.Provider>;
};
