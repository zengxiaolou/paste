const { contextBridge, ipcRenderer } = require('electron');

const ChannelsMap = {
  LANGUAGE_CHANGED: 'language-changed',
  GET_STORE_VALUE: 'get-store-value',
  CHANGE_LOGIN: 'change-login',
  CHANGE_SOUND: 'change-sound',
  QUIT: 'quit',
  CHANGE_SHORTCUTS: 'change-shortcuts',
  GET_STORE_VALUES: 'get-store-values-by-prefix',
  RESET_SHORTCUTS: 'reset-shortcuts',
  CHANGE_REMOVE_ITEM: 'change-remove-item',
};

contextBridge.exposeInMainWorld('ipc', {
  changeLanguage: language => ipcRenderer.send(ChannelsMap.LANGUAGE_CHANGED, language),
  getStoreValue: async key => {
    return await ipcRenderer.invoke(ChannelsMap.GET_STORE_VALUE, key);
  },
  getStoreValues: async prefix => {
    return await ipcRenderer.invoke(ChannelsMap.GET_STORE_VALUES, prefix);
  },
  changeLogin: login => ipcRenderer.send(ChannelsMap.CHANGE_LOGIN, login),
  changeSound: flag => ipcRenderer.send(ChannelsMap.CHANGE_SOUND, flag),
  changeShortcuts: async (key, action, shortcuts) => {
    return await ipcRenderer.invoke(ChannelsMap.CHANGE_SHORTCUTS, { key, action, shortcuts });
  },
  quit: () => ipcRenderer.send(ChannelsMap.QUIT),
  onShortcutChanged: () =>
    new Promise(resolve => {
      ipcRenderer.on(ChannelsMap.SHORTCUT_CHANGE, (event, data) => {
        resolve(data);
      });
    }),
  resetShortcuts: async () => {
    return await ipcRenderer.invoke(ChannelsMap.RESET_SHORTCUTS);
  },
  changeRemoveItem: async date => {
    return await ipcRenderer.invoke(ChannelsMap.CHANGE_REMOVE_ITEM, date);
  },
});
