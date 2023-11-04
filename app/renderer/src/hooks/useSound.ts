import { useEffect, useState } from 'react';
function useSound() {
  const [sound, setSound] = useState<boolean>();
  const getSound = async () => {
    const sound = (await window.ipc.getStoreValue('sound')) as boolean;
    setSound(sound);
  };

  useEffect(() => {
    getSound();
  }, []);
  return sound;
}

export default useSound;
