const { contextBridge, ipcRenderer } = require('electron');

const ChannelsMap = {
  ON_TOP: 'toggle-always-on-top',
  GET_DATA: 'get-data',
  CLIPBOARD_DATA: 'clipboard-data',
  REQUEST_PASTE: 'request-paste',
  UPDATE_RECORD: 'update-record',
  SHOW_CONTEXT_MENU: 'show-context-menu',
};

contextBridge.exposeInMainWorld('ipc', {
  toggleAlwaysOnTop: () => ipcRenderer.send(ChannelsMap.ON_TOP),
  getData: async query => {
    return await ipcRenderer.invoke(ChannelsMap.GET_DATA, { query });
  },
  onClipboardData: callback => {
    ipcRenderer.on(ChannelsMap.CLIPBOARD_DATA, (event, data) => {
      callback(data);
    });
  },
  requestPaste: async (type, content, id) => {
    return await ipcRenderer.invoke(ChannelsMap.REQUEST_PASTE, { type, content, id });
  },

  updateRecord: async data => {
    return await ipcRenderer.invoke(ChannelsMap.UPDATE_RECORD, { data });
  },
  showContextMenu: async data => await ipcRenderer.invoke(ChannelsMap.SHOW_CONTEXT_MENU, data),
});
