import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { Channels } from './channels';
import { stateManager, store } from '@/components/singletons';
import { activeShortcut } from '@/utils/shortcut';
import { ShortcutAction, StoreKey } from '@/types/enum';

export const registerIpcHandler = () => {
  ipcMain.on(Channels.LANGUAGE_CHANGE, (event, language) => {
    for (const window of BrowserWindow.getAllWindows()) {
      store.set(StoreKey.GENERAL_LANGUAGE, language);
      window.webContents.send(Channels.LANGUAGE_CHANGE, language);
    }
  });
  ipcMain.handle(Channels.GET_STORE_VALUE, (event, key) => {
    return store.get(key);
  });

  ipcMain.on(Channels.CHANGE_LOGIN, (event, login) => {
    store.set(StoreKey.GENERAL_LOGIN, login);
    app.setLoginItemSettings({
      openAtLogin: login,
      openAsHidden: login,
    });
  });

  ipcMain.on(Channels.CHANGE_SOUND, (event, flag) => {
    store.set(StoreKey.GENERAL_SOUND, flag);
  });

  ipcMain.on(Channels.QUIT, () => {
    app.quit();
  });

  ipcMain.handle(Channels.CHANGE_SHORTCUTS, (event, arguments_) => {
    const { key, action, shortcuts } = arguments_;
    const old = store.get(key);
    action === ShortcutAction.ADD ? store.set(key, shortcuts) : store.delete(key);
    if (key === StoreKey.SHORTCUT_ACTION) {
      activeShortcut(action, shortcuts, old);
    } else {
      for (const window of BrowserWindow.getAllWindows()) {
        window.webContents.send(Channels.SHORTCUT_CHANGE, key);
      }
    }
    return true;
  });

  ipcMain.handle(Channels.GET_STORE_VALUES, (event, key) => {
    return store.getByPrefix(key);
  });

  ipcMain.handle(Channels.RESET_SHORTCUTS, () => {
    const oldActive = store.get(StoreKey.SHORTCUT_ACTION);
    activeShortcut(ShortcutAction.ADD, 'Shift+Command+X', oldActive);
    store.set(StoreKey.SHORTCUT_PREVIOUS, 'Shift+Command+[');
    store.set(StoreKey.SHORTCUT_NEXT, 'Shift+Command+]');
    for (const window of BrowserWindow.getAllWindows()) {
      window.webContents.send(Channels.SHORTCUT_CHANGE, StoreKey.SHORTCUT_PREVIOUS);
      window.webContents.send(Channels.SHORTCUT_CHANGE, StoreKey.SHORTCUT_NEXT);
    }
    return true;
  });

  ipcMain.handle(Channels.CHANGE_REMOVE_ITEM, (event, date) => {
    store.set(StoreKey.ADVANCED_REMOVE, date);
    return true;
  });

  ipcMain.on(Channels.RESET_WINDOW_SIZE, (event, height) => {
    const window = stateManager.getSettingWindow();
    if (window) {
      const [width] = window.getSize();
      window.setSize(width, height);
    }
  });

  ipcMain.on(Channels.OPEN_EXTERNAL, (event, url) => {
    shell.openExternal(url);
  });
};
