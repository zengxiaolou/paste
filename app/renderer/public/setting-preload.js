const { contextBridge, ipcRenderer } = require('electron');

const ChannelsMap = {
  LANGUAGE_CHANGED: 'language-changed',
  GET_STORE_VALUE: 'get-store-value',
  CHANGE_LOGIN: 'change-login',
  CHANGE_SOUND: 'change-sound',
  QUIT: 'quit',
};

contextBridge.exposeInMainWorld('ipc', {
  changeLanguage: language => ipcRenderer.send(ChannelsMap.LANGUAGE_CHANGED, language),
  getStoreValue: async key => {
    return await ipcRenderer.invoke(ChannelsMap.GET_STORE_VALUE, key);
  },
  changeLogin: login => ipcRenderer.send(ChannelsMap.CHANGE_LOGIN, login),
  changeSound: flag => ipcRenderer.send(ChannelsMap.CHANGE_SOUND, flag),
  quit: () => ipcRenderer.send(ChannelsMap.QUIT),
});
