import { AppInfoFactory } from '../platform-utils/app-info-factory';
import { sendClipboardDataToRenderer } from '../main_page/main';
import { clipboardManager, databaseManager } from './singletons';
class IntervalManager {
  private clipboardIntervalID: ReturnType<typeof setInterval> | undefined;
  async startClipboardInterval() {
    if (!this.clipboardIntervalID) {
      this.clipboardIntervalID = setInterval(async () => {
        const clipboardData = clipboardManager.checkClipboardContent();
        if (clipboardData) {
          try {
            const appName = await AppInfoFactory.getActiveApplicationName();
            clipboardData.icon = await AppInfoFactory.getIconForApplicationName(appName);
            clipboardData.appName = appName;
          } catch (error: any) {
            console.error('Error when fetching application name/application icon:', error);
          }

          databaseManager.saveToDatabase(clipboardData);
          sendClipboardDataToRenderer(clipboardData);
        }
      }, 500);
    }
  }

  stopClipboardInterval() {
    if (this.clipboardIntervalID) {
      clearInterval(this.clipboardIntervalID);
      this.clipboardIntervalID = undefined;
    }
  }
}

export default IntervalManager;
