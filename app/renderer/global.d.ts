import { ClipData, ClipboardDataQuery } from './src/types/type';
import { ShortcutAction } from './src/types/enum';

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
      getStoreValue: (key: string) => Promise<string | boolean | number>;
      getStoreValues: (prefix: string) => Promise<Record<string, string | boolean | number>>;
      changeLogin: (login: boolean) => void;
      changeSound: (flag: boolean) => void;
      quit: () => void;
      changeShortcuts: (key: string, action: ShortcutAction, shortcut?: string) => Promise<boolean>;
      onShortcutChanged: () => Promise<string>;
    };
  }
}

export {};
