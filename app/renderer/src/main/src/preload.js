const { contextBridge, ipcRenderer } = require('electron');

const ChannelsMap = {
  ON_TOP: 'toggle-always-on-top',
  GET_DATA: 'get-data',
  CLIPBOARD_DATA: 'clipboard-data',
  REQUEST_PASTE: 'request-paste',
  CONTENT_SEARCH: 'content-search',
  DELETE_RECORD: 'delete-record',
  UPDATE_RECORD: 'update-record',
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

  searchContent: async content => {
    return await ipcRenderer.invoke(ChannelsMap.CONTENT_SEARCH, content);
  },

  deleteRecord: async (id, type) => {
    return await ipcRenderer.invoke(ChannelsMap.DELETE_RECORD, { id, type });
  },

  updateRecord: async data => {
    return await ipcRenderer.invoke(ChannelsMap.UPDATE_RECORD, { data });
  },
});
