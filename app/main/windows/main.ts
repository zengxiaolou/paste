const path = require('path');

const { BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');

let win;

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
  return win;
}

module.exports = { create };
