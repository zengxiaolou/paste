import { BrowserWindow } from 'electron';

export default class StateManager {
  mainWindow: BrowserWindow | undefined = undefined;
  constructor() {
    this.mainWindow = undefined;
  }
  setMainWindow(window?: BrowserWindow) {
    this.mainWindow = window;
  }
  getMainWindow(): BrowserWindow | undefined {
    return this.mainWindow;
  }
}
