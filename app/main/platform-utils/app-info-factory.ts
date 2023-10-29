import MacOSUtils from './mac-os';
import LinuxUtils from './linux';

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
      case 'darwin': {
        return new MacOSUtils();
      }
      // case 'win32': {
      //   return new WindowsUtils();
      // }
      case 'linux': {
        return new LinuxUtils();
      }
      default: {
        throw new Error('Unsupported platform');
      }
    }
  },
};
