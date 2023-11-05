import { app, BrowserWindow, globalShortcut } from 'electron';
import { create } from './pages/main_page/main';
import { clipboardManager, databaseManager, intervalManager, store } from './components/singletons';
import { createTray } from './components/tray';
import { ClipData } from './pages/main_page/type';
import { create as createSetting } from './pages/setting/main';
import { setLanguage } from './utils/language';
import { activeShortcut } from './utils/shortcut';
import { Platform, ShortcutAction, StoreKey } from './types/enum';

let mainWindow: BrowserWindow | null;
const gotTheLock = app.requestSingleInstanceLock();

app
  .whenReady()
  // eslint-disable-next-line promise/always-return
  .then(async () => {
    mainWindow = create();
    createSetting();
    await createTray(mainWindow);
    await setLanguage();
    activeShortcut(ShortcutAction.ADD);

    await intervalManager.startClipboardInterval();

    store.onDidChange(StoreKey.GENERAL_LANGUAGE, () => {
      setLanguage();
    });

    await setInitContent();
  })
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch(error => {
    console.error(error);
  });

app.on('window-all-closed', () => {
  if (process.platform !== Platform.MAC) {
    globalShortcut.unregisterAll();
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) create();
  else mainWindow?.show();
});

if (gotTheLock) {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
} else {
  app.quit();
}

const setInitContent = async () => {
  try {
    const lastClipboardData: ClipData = await databaseManager.getLastRow();
    const { id, type, content } = lastClipboardData;
    lastClipboardData && clipboardManager.setInitContent(id as number, type, content);
  } catch (error) {
    console.error('Error initializing clipboard:', error);
    throw error;
  }
};
