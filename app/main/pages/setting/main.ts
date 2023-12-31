import path from 'node:path';
import url from 'node:url';
import { BrowserWindow, screen } from 'electron';
import isDev from 'electron-is-dev';
import { SETTING_PAGE_DIRECTION } from './const';
import { registerIpcHandler } from './ipc-handlers';
import i18n from '@/i18n/index';
import { stateManager } from '@/components/singletons';

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
    resizable: false,
    backgroundColor: '#383839',
    show: false,
    webPreferences: {
      devTools: isDev,
      preload: path.join(
        SETTING_PAGE_DIRECTION,
        isDev ? '../../../renderer/public/setting-preload.js' : '../../../renderer/build/setting-preload.js'
      ),
    },
  });
  if (isDev) {
    win.loadURL('http://localhost:3061/#/settings');
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(SETTING_PAGE_DIRECTION, '../../../renderer/build/index.html'),
        protocol: 'file:',
        slashes: true,
        hash: '/settings',
      })
    );
  }

  win.webContents.openDevTools();
  stateManager.setSettingWindow(win);
  win.on('closed', () => {
    stateManager.setSettingWindow();
  });
  return win;
};

export { create };
