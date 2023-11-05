import { app, Menu, shell, BrowserWindow, MenuItemConstructorOptions } from 'electron';
import i18n from '../i18n';
import { stateManager } from './singletons';
import { Platform } from '../types/enum';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor() {
    this.mainWindow = stateManager.getMainWindow() as BrowserWindow;
  }

  buildMenu(): Menu {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
      this.setupDevelopmentEnvironment();
    }

    const template = process.platform === Platform.MAC ? this.buildDarwinTemplate() : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, properties) => {
      const { x, y } = properties;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'Electron',
      submenu: [
        {
          label: i18n.t('About'),
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        { label: i18n.t('Preferences'), accelerator: 'Command+,' },
        { type: 'separator' },
        {
          label: 'Hide',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: i18n.t('Hide Others'),
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        { label: i18n.t('Show All'), selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: i18n.t('Quit'),
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: i18n.t('Edit'),
      submenu: [
        { label: i18n.t('Undo'), accelerator: 'Command+Z', selector: 'undo:' },
        { label: i18n.t('Redo'), accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: i18n.t('Cut'), accelerator: 'Command+X', selector: 'cut:' },
        { label: i18n.t('Copy'), accelerator: 'Command+C', selector: 'copy:' },
        { label: i18n.t('Paste'), accelerator: 'Command+V', selector: 'paste:' },
        {
          label: i18n.t('Select All'),
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
      ],
    };
    const subMenuViewDevelopment: MenuItemConstructorOptions = {
      label: i18n.t('View'),
      submenu: [
        {
          label: i18n.t('Reload'),
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: i18n.t('Toggle Full Screen'),
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: i18n.t('Toggle Developer Tools'),
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProduction: MenuItemConstructorOptions = {
      label: i18n.t('View'),
      submenu: [
        {
          label: i18n.t('Toggle Full Screen'),
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: i18n.t('Window'),
      submenu: [
        {
          label: i18n.t('Minimize'),
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: i18n.t('Close'), accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: i18n.t('Bring All to Front'), selector: 'arrangeInFront:' },
      ],
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: i18n.t('Help'),
      submenu: [
        {
          label: i18n.t('Learn More'),
          click() {
            shell.openExternal('https://electronjs.org');
          },
        },
        {
          label: i18n.t('Documentation'),
          click() {
            shell.openExternal('https://github.com/electron/electron/tree/main/docs#readme');
          },
        },
        {
          label: i18n.t('Community Discussions'),
          click() {
            shell.openExternal('https://www.electronjs.org/community');
          },
        },
        {
          label: i18n.t('Search Issues'),
          click() {
            shell.openExternal('https://github.com/electron/electron/issues');
          },
        },
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'
        ? subMenuViewDevelopment
        : subMenuViewProduction;

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: i18n.t('&File'),
        submenu: [
          {
            label: i18n.t('&Open'),
            accelerator: 'Ctrl+O',
          },
          {
            label: i18n.t('&Close'),
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
      {
        label: i18n.t('&View'),
        submenu:
          process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: i18n.t('&Reload'),
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: i18n.t('Toggle &Full Screen'),
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
                  },
                },
                {
                  label: i18n.t('Toggle &Developer Tools'),
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools();
                  },
                },
              ]
            : [
                {
                  label: i18n.t('Toggle &Full Screen'),
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
                  },
                },
              ],
      },
      {
        label: i18n.t('Help'),
        submenu: [
          {
            label: i18n.t('Learn More'),
            click() {
              shell.openExternal('https://electronjs.org');
            },
          },
          {
            label: i18n.t('Documentation'),
            click() {
              shell.openExternal('https://github.com/electron/electron/tree/main/docs#readme');
            },
          },
          {
            label: i18n.t('Community Discussions'),
            click() {
              shell.openExternal('https://www.electronjs.org/community');
            },
          },
          {
            label: i18n.t('Search Issues'),
            click() {
              shell.openExternal('https://github.com/electron/electron/issues');
            },
          },
        ],
      },
    ];

    return templateDefault;
  }
}
