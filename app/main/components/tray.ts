import path from 'node:path';
import { app, BrowserWindow, Tray, Menu } from 'electron';
import { MAIN_DIRECTORY } from '../const';
import i18n from '../i18n';
import { Platform } from '../types/enum';
import { intervalManager, stateManager } from './singletons';

export const createTray = async (window: BrowserWindow) => {
  const tray = new Tray(path.resolve(MAIN_DIRECTORY, '../../assets/tray16.png'));
  let isMonitoring = true;

  if (process.platform === Platform.MAC) {
    app.dock.setIcon(path.resolve(MAIN_DIRECTORY, '../../assets/icon.png'));
  }

  tray.on('click', () => {
    // eslint-disable-next-line unicorn/no-null
    tray.setContextMenu(null);
    if (window?.isVisible()) {
      window.hide();
    } else {
      window?.show();
    }
  });

  tray.on('right-click', () => {
    updateContextMenu(tray, isMonitoring);
    tray.popUpContextMenu();
  });
  return tray;
};

const updateContextMenu = (tray: Tray, isMonitoring: boolean) => {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: isMonitoring ? i18n.t('Stop Monitoring Clipboard') : i18n.t('Resume Monitoring Clipboard'),
      click: () => {
        if (isMonitoring) {
          intervalManager.stopClipboardInterval();
        } else {
          intervalManager.startClipboardInterval();
        }
        isMonitoring = !isMonitoring;
        updateContextMenu(tray, isMonitoring);
      },
      accelerator: 'Command+Ctrl+m',
    },
    { type: 'separator' },
    {
      label: i18n.t('Preferences'),
      click: () => stateManager.showOrHideSettingWindow(),
      accelerator: 'Command+,',
    },
    { type: 'separator' },
    { label: i18n.t('Quit'), click: () => app.quit(), accelerator: 'Command+q' },
  ]);
  tray.setContextMenu(contextMenu);
};
