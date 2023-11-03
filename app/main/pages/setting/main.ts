import path from 'node:path';
import { BrowserWindow, screen } from 'electron';
import isDev from 'electron-is-dev';
import i18n from '../../i18n/i18n';
import { stateManager } from '../../components/singletons';
import { MAIN_PAGE_DIRECTION } from './const';
import { registerIpcHandler } from './ipc-handlers';

let win = stateManager.getSettingWindow();

const init = () => {
  registerIpcHandler();
};

init();

const create = () => {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  const windowWidth = Math.floor(screenWidth / 4);
  const windowHeight = Math.floor(screenHeight / 5);
  const windowXPosition = Math.floor((screenWidth - windowWidth) / 2);
  const windowYPosition = Math.floor(screenHeight * 0.1);

  win = new BrowserWindow({
    title: i18n.t('Settings'),
    x: windowXPosition,
    y: windowYPosition,
    width: windowWidth,
    height: windowHeight,
    backgroundColor: '#383839',
    show: isDev,
    webPreferences: {
      devTools: isDev,
      preload: path.join(
        MAIN_PAGE_DIRECTION,
        isDev ? '../../../renderer/public/setting-preload.js' : '../../../renderer/build/setting-preload.js'
      ),
    },
  });
  if (isDev) {
    win.loadURL('http://localhost:3061/settings');
  }

  win.webContents.openDevTools();
  stateManager.setMainWindow(win);
  win.on('closed', () => {
    stateManager.setMainWindow();
  });
  return win;
};

export { create };
