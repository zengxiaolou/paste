import { BrowserWindow, ipcMain, nativeImage } from 'electron';
import { clipboardManager, dbManager as databaseManager } from '../singletons';
import { ClipData } from './type';
import { Channels } from './channels';
import { DataTypes } from './enum';

export const registerIpcHandler = (win: BrowserWindow | undefined) => {
  ipcMain.on(Channels.TOGGLE_ALWAYS_ON_TOP, event => {
    if (win) {
      const isTopmost = win.isAlwaysOnTop();
      win.setAlwaysOnTop(!isTopmost);
      event.returnValue = !isTopmost;
    }
  });

  ipcMain.handle(Channels.GET_DATA, async (event, arguments_): Promise<ClipData[] | undefined> => {
    try {
      const row: ClipData[] = await databaseManager.getRowsByPage(arguments_.size, arguments_.page);
      return row.map((item: ClipData) => {
        if (item.type === DataTypes.IMAGE) {
          const image = nativeImage.createFromPath(item.content);
          const dataURL = image.toDataURL();
          return { ...item, content: dataURL };
        }
        return item;
      });
    } catch (error: any) {
      console.error(error);
      event.sender.send(Channels.DATA_ERROR, error?.message);
    }
  });

  ipcMain.handle(Channels.REQUEST_PASTE, async (event, arguments_) => {
    if (arguments_.type === DataTypes.IMAGE) {
      const imageData = await databaseManager.getDataById(arguments_.id);
      arguments_.content = imageData.content;
    }
    clipboardManager.paste(arguments_.type, arguments_.content);
  });

  ipcMain.handle(Channels.CONTENT_SEARCH, async (event, search) => {
    return await databaseManager.getByContent(search);
  });

  ipcMain.handle(Channels.DELETE_RECORD, async (event, id: number) => {
    return await databaseManager.deleteById(id);
  });
};
