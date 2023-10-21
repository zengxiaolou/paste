import { clipData } from './main_page/type';

const electron = require('electron');
const { create: createMainWindow, sendClipboardDataToRenderer: sendClipboard } = require('./main_page/main');
const indexPath = require('path');
const { dbManager, clipboardManager } = require('./singletons');

const { app, Tray } = electron;

try {
  require('electron-reloader')(module);
} catch (_) {
  /* empty */
}

let tray;
let mainWindow: import('electron').BrowserWindow | null;

app
  .whenReady()
  .then(() => {
    mainWindow = createMainWindow();
    tray = new Tray(indexPath.resolve(__dirname, '../../assets/tray16.png'));
    if (process.platform === 'darwin') {
      app.dock.setIcon(indexPath.resolve(__dirname, '../../assets/icon.png'));
    }
    tray.on('click', () => {
      if (mainWindow?.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow?.show();
      }
    });
    dbManager.getLastRow().then((res: clipData) => clipboardManager.setInitContent(res.type, res.content));
  })
  .catch(err => {
    console.error(err);
  });

app.on('activate', function () {
  if (mainWindow === null) createMainWindow();
  else mainWindow?.show();
});

setInterval(() => {
  const clipboardData = clipboardManager.checkClipboardContent();
  if (clipboardData) {
    dbManager.saveToDatabase(clipboardData);
    sendClipboard(clipboardData);
  }
}, 1000);
