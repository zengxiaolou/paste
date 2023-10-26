import path from 'node:path';
import { BrowserWindow, nativeImage, screen } from 'electron';
import isDev from 'electron-is-dev';
import { stateManager } from '../components/singletons';
import { registerIpcHandler } from './ipc-handlers';
import { ClipData } from './type';
import { DataTypes } from './enum';
import { Channels } from './channels';
import { MAIN_PAGE_DIRECTION } from './const';

let win = stateManager.getMainWindow();
const init = () => {
  registerIpcHandler(win);
};

init();

/**
 * create main page windows
 *  @returns {BrowserWindow} windows
 */
function create() {
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
      preload: path.join(MAIN_PAGE_DIRECTION, '../../renderer/src/main/build/preload.js'),
      devTools: true,
    },
    icon: path.join(MAIN_PAGE_DIRECTION, '../../../../assets/icon.ico'),
  });
  if (isDev) {
    win
      .loadURL('http://localhost:3061')
      .then(() => console.log('create success'))
      .catch(error => {
        console.error(error);
      });
  } else {
    win
      .loadFile(path.resolve(MAIN_PAGE_DIRECTION, '../../renderer/src/main/build/index.html'))
      .then(() => console.log('create success'))
      .catch(error => {
        console.error(error);
      });
  }
  win.webContents.openDevTools();
  stateManager.setMainWindow(win);
  win.on('closed', () => {
    stateManager.setMainWindow();
  });
  return win;
}

const sendClipboardDataToRenderer = (data: ClipData) => {
  if (win) {
    if (data.type === DataTypes.IMAGE) {
      const image = nativeImage.createFromPath(data.content);
      Object.assign(data, { content: image.toDataURL() });
    }
    if (data.icon) {
      const icon = nativeImage.createFromPath(data.icon);
      Object.assign(data, { icon: icon.toDataURL() });
    }
    Object.assign(data, { created_at: new Date().toISOString() });
    win.webContents.send(Channels.CLIPBOARD_DATA, data);
  }
};

export { create, sendClipboardDataToRenderer };
