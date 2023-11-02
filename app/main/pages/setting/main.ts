import { BrowserWindow, screen } from 'electron';
import isDev from 'electron-is-dev';
import i18n from '../../components/i18n';
import { stateManager } from '../../components/singletons';

let win = stateManager.getSettingWindow();
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
