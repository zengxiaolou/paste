import { ClipData } from './main_page/type';
import { create, sendClipboardDataToRenderer } from './main_page/main';
import { app, Tray, BrowserWindow } from 'electron';
import path from 'path';
import { dbManager, clipboardManager } from './singletons';

try {
  require('electron-reloader')(module);
} catch (_) {
  /* empty */
}

let tray;
let mainWindow: BrowserWindow | null;

app
  .whenReady()
  .then(() => {
    mainWindow = create();
    tray = new Tray(path.resolve(__dirname, '../../assets/tray16.png'));
    if (process.platform === 'darwin') {
      app.dock.setIcon(path.resolve(__dirname, '../../assets/icon.png'));
    }
    tray.on('click', () => {
      if (mainWindow?.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow?.show();
      }
    });
    dbManager.getLastRow().then((res: ClipData) => clipboardManager.setInitContent(res.type, res.content));
  })
  .catch(err => {
    console.error(err);
  });

app.on('activate', function () {
  if (mainWindow === null) create();
  else mainWindow?.show();
});

setInterval(() => {
  const clipboardData = clipboardManager.checkClipboardContent();
  if (clipboardData) {
    dbManager.saveToDatabase(clipboardData);
    sendClipboardDataToRenderer(clipboardData);
  }
}, 1000);
