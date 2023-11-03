import { app, BrowserWindow, globalShortcut } from 'electron';
import i18n from './i18n/i18n';
import { create } from './pages/main_page/main';
import { clipboardManager, databaseManager, intervalManager, menuBuilder, store } from './components/singletons';
import { createTray } from './components/tray';
import { ClipData } from './pages/main_page/type';
import { create as createSetting } from './pages/setting/main';

let mainWindow: BrowserWindow | null;
const gotTheLock = app.requestSingleInstanceLock();

app
  .whenReady()
  // eslint-disable-next-line promise/always-return
  .then(async () => {
    mainWindow = create();
    createSetting();

    await createTray(mainWindow);

    await setLanguage();

    await intervalManager.startClipboardInterval();

    setShortcuts();

    store.onDidChange('language', () => {
      const language = store.get('language');
      i18n.changeLanguage(language as string);
      menuBuilder.buildMenu();
    });

    await setInitContent();
  })
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch(error => {
    console.error(error);
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) create();
  else mainWindow?.show();
});

if (gotTheLock) {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
} else {
  app.quit();
}

const setLanguage = async () => {
  menuBuilder.buildMenu();
  let language = store.get('language');
  if (!language) {
    language = app.getLocale() || 'en';
    store.set('language', language);
  }
  await i18n.changeLanguage(language as string);
};

const setShortcuts = () => {
  globalShortcut.register('Command+Shift+X', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow?.showInactive();
    }
  });
};

const setInitContent = async () => {
  try {
    const lastClipboardData: ClipData = await databaseManager.getLastRow();
    const { id, type, content } = lastClipboardData;
    lastClipboardData && clipboardManager.setInitContent(id as number, type, content);
  } catch (error) {
    console.error('Error initializing clipboard:', error);
    throw error;
  }
};
