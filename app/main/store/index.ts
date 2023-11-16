import { BrowserWindow } from 'electron';

export default class StateManager {
  mainWindow: BrowserWindow | undefined = undefined;
  settingWindow: BrowserWindow | undefined = undefined;
  constructor() {
    this.mainWindow = undefined;
    this.settingWindow = undefined;
  }
  setMainWindow(window?: BrowserWindow) {
    this.mainWindow = window;
  }
  getMainWindow(): BrowserWindow | undefined {
    return this.mainWindow;
  }

  setSettingWindow(window?: BrowserWindow) {
    this.settingWindow = window;
  }

  getSettingWindow(): BrowserWindow | undefined {
    return this.settingWindow;
  }

  showOrHideSettingWindow() {
    if (this.settingWindow?.isVisible()) {
      this.settingWindow?.hide();
    } else {
      this.settingWindow?.showInactive();
    }
  }
}
