import { ClipData, ClipboardDataQuery } from './src/types/type';

declare global {
  interface Window {
    ipc: {
      toggleAlwaysOnTop: () => Promise<boolean>;
      getData: (query: ClipboardDataQuery) => Promise<ClipData[] | undefined>;
      onClipboardData: (callback: (data: any) => void) => void;
      requestPaste: (type: string, content: string, id: number) => Promise<Boolean>;
      updateRecord: (data: ClipData) => Promise<boolean>;
      showContextMenu: (data: ClipData) => Promise<boolean>;
      onLanguageChange: (callback: (language: string) => void) => void;
      changeLanguage: (language: string) => void;
      getStoreValue: (key: string) => Promise<string>;
    };
  }
}

export {};
