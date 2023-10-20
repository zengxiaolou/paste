const { contextBridge, ipcRenderer } = require('electron');

const ChannelsMap = {
  ON_TOP: 'toggle-always-on-top',
  GET_DATA: 'get-data',
  CLIPBOARD_DATA: 'clipboard-data',
};

contextBridge.exposeInMainWorld('ipc', {
  toggleAlwaysOnTop: () => ipcRenderer.send(ChannelsMap.ON_TOP),
  getData: async (size, page) => {
    return await ipcRenderer.invoke(ChannelsMap.GET_DATA, { size, page });
  },
  onClipboardData: callback => {
    ipcRenderer.on(ChannelsMap.CLIPBOARD_DATA, (event, data) => {
      callback(data);
    });
  },
});
