import { app, BrowserWindow, globalShortcut } from 'electron';
import { create } from './pages/main_page/main';
import { clipboardManager, databaseManager, intervalManager, menuBuilder, store } from './components/singletons';
import { createTray } from './components/tray';
import { ClipData } from './pages/main_page/type';
import { create as createSetting } from './pages/setting/main';

let mainWindow: BrowserWindow | null;
const gotTheLock = app.requestSingleInstanceLock();

app
  .whenReady()
  .then(async () => {
    mainWindow = create();
    createSetting();
    await createTray(mainWindow);
    menuBuilder.buildMenu();
    store.onDidChange('language', () => {
      menuBuilder.buildMenu();
    });
    await intervalManager.startClipboardInterval();
    globalShortcut.register('Command+Shift+X', () => {
      if (mainWindow?.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow?.showInactive();
      }
    });

    try {
      const lastClipboardData: ClipData = await databaseManager.getLastRow();
      const { id, type, content } = lastClipboardData;
      lastClipboardData && clipboardManager.setInitContent(id as number, type, content);
      return lastClipboardData;
    } catch (error) {
      console.error('Error initializing clipboard:', error);
      throw error;
    }
  })
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch(error => {
    console.error(error);
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
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
