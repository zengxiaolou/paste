const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ipc', {
  toggleAlwaysOnTop: () => ipcRenderer.send('toggle-always-on-top'),
  getData: async (size: number, page: number) => {
    return await ipcRenderer.invoke('get-data', { size, page });
  },
});
