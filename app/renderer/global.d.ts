import { ClipData, ClipboardDataQuery } from './src/types/type';
import { DataTypes } from './src/types/enum';

declare global {
  interface Window {
    ipc: {
      toggleAlwaysOnTop: () => Promise<boolean>;
      getData: (query: ClipboardDataQuery) => Promise<ClipData[] | undefined>;
      onClipboardData: (callback: (data: any) => void) => void;
      requestPaste: (type: string, content: string, id: number) => Promise<Boolean>;
      updateRecord: (data: ClipData) => Promise<boolean>;
      showContextMenu: (data: ClipData) => Promise<boolean>;
    };
  }
}

export {};
