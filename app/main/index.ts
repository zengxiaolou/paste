import { app, BrowserWindow } from 'electron';
import { create, sendClipboardDataToRenderer } from './main_page/main';
import { dbManager as databaseManager, clipboardManager } from './singletons';
import { createTray } from './tray';
import { ClipData } from './main_page/type';

let mainWindow: BrowserWindow | null;

app
  .whenReady()
  .then(async () => {
    mainWindow = create();
    createTray(mainWindow);
    try {
      const lastClipboardData: ClipData = await databaseManager.getLastRow();
      clipboardManager.setInitContent(lastClipboardData.type, lastClipboardData.content);
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

setInterval(() => {
  const clipboardData = clipboardManager.checkClipboardContent();
  if (clipboardData) {
    databaseManager.saveToDatabase(clipboardData);
    sendClipboardDataToRenderer(clipboardData);
  }
}, 1000);
