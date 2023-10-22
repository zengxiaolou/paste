import { app, BrowserWindow } from 'electron';
import { create, sendClipboardDataToRenderer } from './main_page/main';
import { clipboardManager, databaseManager } from './singletons';
import { createTray } from './tray';
import { ClipData } from './main_page/type';
import { AppInfoFactory } from './platformUtils/app-info-factory';

let mainWindow: BrowserWindow | null;

app
  .whenReady()
  .then(async () => {
    mainWindow = create();
    createTray(mainWindow);
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

setInterval(async () => {
  const clipboardData = clipboardManager.checkClipboardContent();
  if (clipboardData) {
    try {
      const appName = await AppInfoFactory.getActiveApplicationName();
      clipboardData.icon = await AppInfoFactory.getIconForApplicationName(appName);
      clipboardData.appName = appName;
    } catch (error: any) {
      console.error('Error when fetching application name/application icon:', error);
    }

    databaseManager.saveToDatabase(clipboardData);
    sendClipboardDataToRenderer(clipboardData);
  }
}, 500);
