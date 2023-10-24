import { app, BrowserWindow } from 'electron';
import { create } from './main_page/main';
import { clipboardManager, databaseManager, intervalManager, menuBuilder } from './components/singletons';
import { createTray } from './components/tray';
import { ClipData } from './main_page/type';

let mainWindow: BrowserWindow | null;
const gotTheLock = app.requestSingleInstanceLock();

app
  .whenReady()
  .then(async () => {
    mainWindow = create();
    await createTray(mainWindow);
    menuBuilder.buildMenu();
    await intervalManager.startClipboardInterval();
    try {
      const lastClipboardData: ClipData = await databaseManager.getLastRow();
      lastClipboardData && clipboardManager.setInitContent(lastClipboardData.type, lastClipboardData.content);
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
