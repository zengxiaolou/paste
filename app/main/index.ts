const electron = require('electron');
const { create: createMainWindow } = require('./windows/main.ts');
const indexPath = require('path');

const { app, Tray } = electron;

try {
  require('electron-reloader')(module);
} catch (_) {
  /* empty */
}

let tray;
let mainWindow: import('electron').BrowserWindow | undefined;

app.whenReady().then(() => {
  mainWindow = createMainWindow();
  tray = new Tray(indexPath.resolve(__dirname, '../../assets/tray16.png'));

  tray.on('click', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow?.show();
    }
  });
});
