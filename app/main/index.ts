const electron = require('electron');
const { create: createMainWindow } = require('./main_page/main');
const indexPath = require('path');
const { createDatabase: createDB, saveToDatabase, getLastRow } = require('./main_page/database');
const { checkClipboardContent, setInitContent } = require('./main_page/clip');

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
    createDB();
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
    getLastRow().then((res: any) => setInitContent(res.type, res.content));
  })
  .catch(err => {
    console.error(err);
  });

app.on('activate', function () {
  if (mainWindow === null) createMainWindow();
  else mainWindow?.show();
});

setInterval(() => {
  const clipboardData = checkClipboardContent();
  if (clipboardData) {
    saveToDatabase(clipboardData);
  }
}, 1000);
