import { useEffect, useState } from 'react';
import { StoreKey } from '../types/enum';
function useSound() {
  const [sound, setSound] = useState<boolean>();
  const getSound = async () => {
    const sound = (await window.ipc.getStoreValue(StoreKey.GENERAL_SOUND)) as boolean;
    setSound(sound);
  };

  useEffect(() => {
    getSound();
  }, []);
  return sound;
}

export default useSound;
