import * as path from 'path';
import { BrowserWindow, nativeImage } from 'electron';
import * as isDev from 'electron-is-dev';
import { registerIpcHandler } from './ipcHandlers';
import { ClipData } from './type';

const init = () => {
  registerIpcHandler(win);
};

let win: import('electron').BrowserWindow | null;
init();

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

const sendClipboardDataToRenderer = (data: ClipData) => {
  if (win) {
    if (data.type === 'image') {
      const image = nativeImage.createFromPath(data.content);
      const dataURL = image.toDataURL();
      Object.assign(data, { content: dataURL });
    }
    Object.assign(data, { created_at: new Date().toISOString() });
    win.webContents.send('clipboard-data', data);
  }
};

export { create, sendClipboardDataToRenderer };
