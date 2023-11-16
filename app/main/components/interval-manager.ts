import path from 'node:path';
import { AppInfoFactory } from '@/platform-utils/app-info-factory';
import { sendClipboardDataToRenderer } from '@/pages/main_page/main';
import { ClipData } from '@/pages/main_page/type';
import { StoreKey } from '@/types/enum';
import { clipboardManager, databaseManager, player, store } from './singletons';
import { COMPONENT__DIRECTORY } from './const';
class IntervalManager {
  private clipboardIntervalID: ReturnType<typeof setInterval> | undefined;
  async startClipboardInterval() {
    if (!this.clipboardIntervalID) {
      this.clipboardIntervalID = setInterval(async () => {
        const { data, isDuplicate } = clipboardManager.checkClipboardContent();
        await this.handleDataToDB(data, isDuplicate);
      }, 500);
    }
  }

  stopClipboardInterval() {
    if (this.clipboardIntervalID) {
      clearInterval(this.clipboardIntervalID);
      this.clipboardIntervalID = undefined;
    }
  }
  private handleDataToDB = async (
    data: ClipData | undefined,
    isDuplicate: boolean
  ): Promise<ClipData | Error | undefined> => {
    if (data) {
      if (!isDuplicate) {
        try {
          const appName = await AppInfoFactory.getActiveApplicationName();
          data.icon = await AppInfoFactory.getIconForApplicationName(appName);
          data.appName = appName;
        } catch (error: any) {
          console.error('Error when fetching application name/application icon:', error);
        }
        await databaseManager.saveToDatabase(data);
        sendClipboardDataToRenderer(data);
        if (store.get(StoreKey.GENERAL_SOUND)) {
          player.play(path.join(COMPONENT__DIRECTORY, '../../../assets/paste.mp3'));
        }
      } else if (isDuplicate && data?.id) {
        const date = new Date();
        const newData = await databaseManager.updateCreatedAtById(data?.id, date);
        sendClipboardDataToRenderer(newData as ClipData);
      }
    } else {
      return undefined;
    }
  };
}

export default IntervalManager;
