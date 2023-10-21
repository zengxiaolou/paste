import { ClipData } from './type';
import { nativeImage } from 'electron';
import * as electron from 'electron';
import { ipcMain } from 'electron';
import { dbManager, clipboardManager } from '../singletons';

export const registerIpcHandler = (win: electron.BrowserWindow | null) => {
  ipcMain.on('toggle-always-on-top', event => {
    if (win) {
      const isTopmost = win.isAlwaysOnTop();
      win.setAlwaysOnTop(!isTopmost);
      event.returnValue = !isTopmost;
    }
  });

  ipcMain.handle('get-data', async (event, arg) => {
    try {
      const row = await dbManager.getRowsByPage(arg.size, arg.page);
      return row.map((item: ClipData) => {
        if (item.type === 'image') {
          const image = nativeImage.createFromPath(item.content);
          const dataURL = image.toDataURL();
          return { ...item, content: dataURL };
        }
        return item;
      });
    } catch (err: any) {
      console.error(err);
      event.sender.send('data-error', err?.message);
    }
  });

  ipcMain.handle('request-paste', async (event, args) => {
    if (args.type === 'image') {
      const imageData = await dbManager.getDataById(args.id);
      args.content = imageData.content;
    }
    clipboardManager.paste(args.type, args.content);
  });
};
