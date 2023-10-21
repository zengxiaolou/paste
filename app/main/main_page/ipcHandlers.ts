import { ClipData } from './type';
import { BrowserWindow, ipcMain, nativeImage } from 'electron';
import { clipboardManager, dbManager } from '../singletons';
import { Channels } from './channels';
import { DataTypes } from './enum';

export const registerIpcHandler = (win: BrowserWindow | null) => {
  ipcMain.on(Channels.TOGGLE_ALWAYS_ON_TOP, event => {
    if (win) {
      const isTopmost = win.isAlwaysOnTop();
      win.setAlwaysOnTop(!isTopmost);
      event.returnValue = !isTopmost;
    }
  });

  ipcMain.handle(Channels.GET_DATA, async (event, arg) => {
    try {
      const row = await dbManager.getRowsByPage(arg.size, arg.page);
      return row.map((item: ClipData) => {
        if (item.type === DataTypes.IMAGE) {
          const image = nativeImage.createFromPath(item.content);
          const dataURL = image.toDataURL();
          return { ...item, content: dataURL };
        }
        return item;
      });
    } catch (err: any) {
      console.error(err);
      event.sender.send(Channels.DATA_ERROR, err?.message);
    }
  });

  ipcMain.handle(Channels.REQUEST_PASTE, async (event, args) => {
    if (args.type === DataTypes.IMAGE) {
      const imageData = await dbManager.getDataById(args.id);
      args.content = imageData.content;
    }
    clipboardManager.paste(args.type, args.content);
  });
};
