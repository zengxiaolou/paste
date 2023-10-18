const path = require('path');

const { BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const { getRowsByPage: getByPage } = require('./database');

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
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, '../../renderer/src/main/src/preload.ts'),
    },
    icon: path.join(__dirname, '../../../../assets/icon.ico'),
  });
  if (isDev) {
    win.loadURL('http://localhost:3061');
  } else {
    win.loadURL(path.resolve(__dirname, '../../renderer/index.pages/main/index.html'));
  }
  win.on('closed', () => {
    win = null;
  });

  ipcMain.on('toggle-always-on-top', event => {
    if (win) {
      const isTopmost = win.isAlwaysOnTop();
      win.setAlwaysOnTop(!isTopmost);
      event.returnValue = !isTopmost;
    }
  });

  ipcMain.on('get-data', async (event, arg) => {
    try {
      const rows = await getByPage(arg.size, arg.page);
      console.log('🤮 ~ file:main method: line:53 -----', rows);
      event.sender.send('data-response', rows);
    } catch (err: any) {
      console.error(err);
      event.sender.send('data-error', err?.message);
    }
  });

  return win;
}

module.exports = { create };
