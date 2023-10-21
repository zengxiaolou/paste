import path from 'node:path';
import { app, BrowserWindow, Tray } from 'electron';
import { MAIN_DIRECTORY } from './const';

export const createTray = (window: BrowserWindow) => {
  const tray = new Tray(path.resolve(MAIN_DIRECTORY, '../../assets/tray16.png'));
  if (process.platform === 'darwin') {
    app.dock.setIcon(path.resolve(MAIN_DIRECTORY, '../../assets/icon.png'));
  }
  tray.on('click', () => {
    if (window?.isVisible()) {
      window.hide();
    } else {
      window?.show();
    }
  });
  return tray;
};
