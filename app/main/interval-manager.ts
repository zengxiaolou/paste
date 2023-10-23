import { clipboardManager, databaseManager } from './singletons';
import { AppInfoFactory } from './platformUtils/app-info-factory';
import { sendClipboardDataToRenderer } from './main_page/main';
class IntervalManager {
  private clipboardIntervalID: ReturnType<typeof setInterval> | undefined;
  // 如果未来有其他的interval，可以像上面一样为它们声明私有属性

  startClipboardInterval() {
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

  // 如果未来有其他的interval，可以为它们创建类似的start和stop方法
}

export default IntervalManager;
