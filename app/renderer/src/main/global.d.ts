import { ClipData } from './src/type';

declare global {
  interface Window {
    ipc: {
      toggleAlwaysOnTop: () => void;
      getData: (size: number, page: number) => ClipData[] | undefined;
      onClipboardData: (callback: (data: any) => void) => void;
      requestPaste: (type: string, content: string, id: number) => void;
      searchContent: (content?: string) => ClipData[] | undefined;
      deleteRecord: (id: number) => boolean;
    };
  }
}

export {};
