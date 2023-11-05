import MacOSUtils from './mac-os';
import LinuxUtils from './linux';
import WindowsUtils from './windows';
import { Platform } from '../types/enum';

interface IPlatformUtils {
  getActiveApplicationName(): Promise<string>;
  getIconForApplicationName(appName: string): Promise<string>;
}

export const AppInfoFactory = {
  getActiveApplicationName(): Promise<string> {
    const utils = this.getUtilsInstance();
    return utils.getActiveApplicationName();
  },

  getIconForApplicationName(appName: string): Promise<string> {
    const utils = this.getUtilsInstance();
    return utils.getIconForApplicationName(appName);
  },

  getUtilsInstance(): IPlatformUtils {
    switch (process.platform) {
      case Platform.MAC: {
        return new MacOSUtils();
      }
      case Platform.WINDOW: {
        return new WindowsUtils();
      }
      case Platform.LINUX: {
        return new LinuxUtils();
      }
      default: {
        throw new Error('Unsupported platform');
      }
    }
  },
};
