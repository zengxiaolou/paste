import { ClipData, ClipboardDataQuery } from '@/types/type';
import { ShortcutAction } from '@/types/enum';

declare global {
  interface Window {
    ipc: {
      toggleAlwaysOnTop: () => Promise<boolean>;
      getData: (query: ClipboardDataQuery) => Promise<{ data: ClipData[]; total: number } | undefined>;
      onClipboardData: (callback: (data: any) => void) => void;
      requestPaste: (type: string, content: string, id: number) => Promise<boolean>;
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
      resetShortcuts: () => Promise<boolean>;
      changeRemoveItem: (date: number) => Promise<boolean>;
      resetWindowSize: (height: number) => void;
      openExternal: (utl: string) => void;
    };
  }
}

export {};
