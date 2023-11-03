import { app, BrowserWindow, ipcMain } from 'electron';
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

  ipcMain.on(Channels.CHANGE_LOGIN, (event, login) => {
    store.set('login', login);
    app.setLoginItemSettings({
      openAtLogin: login,
      openAsHidden: login,
    });
  });

  ipcMain.on(Channels.CHANGE_SOUND, (event, flag) => {
    store.set('sound', flag);
  });
};
