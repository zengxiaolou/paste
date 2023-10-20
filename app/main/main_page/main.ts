const path = require('path');

const { BrowserWindow, ipcMain, nativeImage } = require('electron');
const isDev = require('electron-is-dev');
const { getRowsByPage: getByPage } = require('./database');
const { paste } = require('./clip');

let win: import('electron').BrowserWindow | null;

function create() {
  const { screen } = require('electron');
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  const windowWidth = Math.floor(screenWidth / 3);
  const windowHeight = Math.floor(screenHeight * 0.9);
  // const xPosition = screenWidth - windowWidth - 24;

  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: windowWidth,
    height: windowHeight,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../../renderer/src/main/src/preload.js'),
      devTools: true,
    },
    icon: path.join(__dirname, '../../../../assets/icon.ico'),
  });
  if (isDev) {
    win.loadURL('http://localhost:3061');
  } else {
    win.loadURL(path.resolve(__dirname, '../../renderer/index.pages/main/index.html'));
  }
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });
  return win;
}

ipcMain.on('toggle-always-on-top', event => {
  if (win) {
    const isTopmost = win.isAlwaysOnTop();
    win.setAlwaysOnTop(!isTopmost);
    event.returnValue = !isTopmost;
  }
});

ipcMain.handle('get-data', async (event, arg) => {
  try {
    const row = await getByPage(arg.size, arg.page);
    return row.map((item: any) => {
      if (item.type === 'image') {
        const image = nativeImage.createFromPath(item.content);
        const dataURL = image.toDataURL();
        return { ...item, content: dataURL };
      }
      return item;
    });
  } catch (err: any) {
    console.error(err);
    event.sender.send('data-error', err?.message);
  }
});

ipcMain.handle('request-paste', async (event, args) => {
  paste(args.type, args.content);
});

const sendClipboardDataToRenderer = (data: any) => {
  if (win) {
    Object.assign(data, { created_at: new Date().toISOString() });
    win.webContents.send('clipboard-data', data);
  }
};

module.exports = { create, sendClipboardDataToRenderer };
