import { BrowserWindow, ipcMain, Menu, nativeImage, MenuItem } from 'electron';
import i18n from '../../i18n';
import { clipboardManager, databaseManager, store } from '@/components/singletons';
import { deleteFile } from '@/utils/file';
import { stateManager } from '@/components/singletons';
import { ClipData } from './type';
import { Channels } from './channels';
import { DataTypes } from './enum';
import { StoreKey } from '@/types/enum';
export const registerIpcHandler = () => {
  ipcMain.handle(Channels.TOGGLE_ALWAYS_ON_TOP, async () => {
    const win = stateManager.getMainWindow();
    if (win) {
      const isTopmost = win.isAlwaysOnTop();
      win.setAlwaysOnTop(!isTopmost);
      return true;
    }
    return false;
  });

  ipcMain.handle(Channels.GET_DATA, async (event, arguments_): Promise<ClipData[] | undefined> => {
    try {
      const row: ClipData[] = await databaseManager.getRowsByPage(arguments_.query);
      return row.map((item: ClipData) => {
        if (item.type === DataTypes.IMAGE) {
          const image = nativeImage.createFromPath(item.content);
          Object.assign(item, { content: image.toDataURL() });
        }
        if (item.icon) {
          const icon = nativeImage.createFromPath(item.icon);
          Object.assign(item, { icon: icon.toDataURL() });
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
    const result = clipboardManager.paste(arguments_.id, arguments_.type, arguments_.content);
    result && stateManager?.getMainWindow()?.hide();
    return result;
  });

  ipcMain.handle(Channels.UPDATE_RECORD, async (event, arguments_) => {
    const data = arguments_.data;
    if (data?.id) {
      return await databaseManager.updateById(data.id, data);
    }
  });

  ipcMain.handle(Channels.SHOW_CONTEXT_MENU, (event, arguments_) => {
    return new Promise(resolve => {
      const menu = new Menu();
      const language = store.get(StoreKey.GENERAL_LANGUAGE) as string;
      menu.append(
        new MenuItem({
          label: i18n.t('Delete', { lng: language }),
          id: 'delete',
          click: async () => {
            let status;
            if (arguments_.type === DataTypes.IMAGE) {
              const row = await databaseManager.getDataById(arguments_.id);
              await deleteFile(row.content);
            }
            status = await databaseManager.deleteById(arguments_.id);
            resolve(status);
          },
        })
      );
      const window = BrowserWindow.fromWebContents(event.sender);
      if (window) {
        menu.popup({ window });
      }
    });
  });
};
