import { useEffect } from 'react';

const useResizeWindow = (height: number) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const resizeWindow = () => {
      window.ipc.resetWindowSize(height);
      setTimeout(() => {
        document.body.style.overflow = '';
      }, 10);
    };

    setTimeout(resizeWindow, 0);

    return () => {
      document.body.style.overflow = '';
    };
  }, [height]);
};

export default useResizeWindow;
