declare global {
  interface Window {
    ipc: {
      toggleAlwaysOnTop: () => void;
      getData: (size: number, page: number) => any;
      onClipboardData: (callback: (data: any) => void) => void;
      requestPaste: (type: string, content: string, id: number) => void;
    };
  }
}

export {};
