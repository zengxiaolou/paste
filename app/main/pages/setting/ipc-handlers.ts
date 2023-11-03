import { BrowserWindow, ipcMain } from 'electron';
import { store } from '../../components/singletons';
import { Channels } from './channels';

export const registerIpcHandler = () => {
  ipcMain.on(Channels.LANGUAGE_CHANGE, (event, language) => {
    for (const window of BrowserWindow.getAllWindows()) {
      store.set('language', language);
      window.webContents.send(Channels.LANGUAGE_CHANGE, language);
    }
  });
  ipcMain.handle(Channels.GET_STORE_VALUE, (event, key) => {
    return store.get(key);
  });
};
