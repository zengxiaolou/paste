import { useEffect, useState } from 'react';
import { StoreKey } from '../types/enum';
function useLogin() {
  const [login, setLogin] = useState<boolean>();
  const getLogin = async () => {
    const login = (await window.ipc.getStoreValue(StoreKey.GENERAL_LOGIN)) as boolean;
    setLogin(login);
  };

  useEffect(() => {
    getLogin();
  }, []);
  return login;
}

export default useLogin;
