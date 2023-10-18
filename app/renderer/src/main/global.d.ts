declare global {
  interface Window {
    ipc: {
      toggleAlwaysOnTop: () => void;
      getData: () => void;
    };
  }
}

export {};
