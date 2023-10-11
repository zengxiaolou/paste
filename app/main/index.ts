const electron = require('electron');
const { create: createMainWindow } = require('./windows/main');
const indexPath = require('path');

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
    tray = new Tray(indexPath.resolve(__dirname, '../../../assets/tray16.png'));
    if (process.platform === 'darwin') {
      app.dock.setIcon(indexPath.resolve(__dirname, '../../../assets/icon.png'));
    }
    tray.on('click', () => {
      if (mainWindow?.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow?.show();
      }
    });
  })
  .catch(err => {
    console.error(err);
  });

app.on('activate', function () {
  if (mainWindow === null) createMainWindow();
  else mainWindow?.show();
});
