import { useEffect, useState } from 'react';
function useLogin() {
  const [login, setLogin] = useState<boolean>();
  const getLogin = async () => {
    const login = (await window.ipc.getStoreValue('login')) as boolean;
    setLogin(login);
  };

  useEffect(() => {
    getLogin();
  }, []);
  return login;
}

export default useLogin;
