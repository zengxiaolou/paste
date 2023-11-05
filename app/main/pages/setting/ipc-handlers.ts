import { app, BrowserWindow, ipcMain } from 'electron';
import { store } from '../../components/singletons';
import { activeShortcut } from '../../utils/shortcut';
import { ShortcutAction } from '../../types/enum';
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

  ipcMain.on(Channels.QUIT, () => {
    app.quit();
  });

  ipcMain.handle(Channels.CHANGE_SHORTCUTS, (event, arguments_) => {
    const { key, action, shortcuts } = arguments_;
    const old = store.get(key);
    action === ShortcutAction.ADD ? store.set(key, shortcuts) : store.delete(key);
    if (key === 'shortcut:active') {
      activeShortcut(action, shortcuts, old);
    } else {
      for (const window of BrowserWindow.getAllWindows()) {
        window.webContents.send(Channels.SHORTCUT_CHANGE, key);
      }
    }
    return true;
  });
};
