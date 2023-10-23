import { app, BrowserWindow } from 'electron';
import { create } from './main_page/main';
import { clipboardManager, databaseManager, intervalManager } from './components/singletons';
import { createTray } from './components/tray';
import { ClipData } from './main_page/type';

let mainWindow: BrowserWindow | null;

app
  .whenReady()
  .then(async () => {
    mainWindow = create();
    await createTray(mainWindow);
    intervalManager.startClipboardInterval();
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
