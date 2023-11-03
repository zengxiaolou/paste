const { contextBridge, ipcRenderer } = require('electron');

const ChannelsMap = {
  LANGUAGE_CHANGED: 'language-changed',
  GET_STORE_VALUE: 'get-store-value',
};

contextBridge.exposeInMainWorld('ipc', {
  changeLanguage: language => ipcRenderer.send(ChannelsMap.LANGUAGE_CHANGED, language),
  getStoreValue: async key => {
    return await ipcRenderer.invoke(ChannelsMap.GET_STORE_VALUE, key);
  },
});
