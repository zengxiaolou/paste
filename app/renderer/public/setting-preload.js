const { contextBridge, ipcRenderer } = require('electron');

const ChannelsMap = {
  LANGUAGE_CHANGED: 'language-changed',
};

contextBridge.exposeInMainWorld('ipc', {
  changeLanguage: language => ipcRenderer.send(ChannelsMap.LANGUAGE_CHANGED, language),
});
