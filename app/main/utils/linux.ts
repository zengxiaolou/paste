import { exec } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import fs from 'node:fs/promises';

class LinuxUtils {
  public getActiveApplicationName = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const script = `
            tell application "System Events"
            name of first process whose frontmost is true
            end tell
        `;
      exec(`osascript -e '${script}'`, (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout.trim()); // 使用trim()来移除可能的空白或换行符
        }
      });
    });
  };

  public getIconForApplicationName = async (appName: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const script = `
            tell application "Finder"
                get the file of application process "${appName}"
            end tell
        `;

      exec(`osascript -e '${script}'`, async (error, stdout) => {
        if (error) {
          reject(error);
          return;
        }

        const originalIconPath = stdout.trim();
        const iconFileName = `${appName}.icns`; // 你可以根据需要修改文件名的格式
        const cacheIconPath = join(tmpdir(), iconFileName);

        try {
          await fs.copyFile(originalIconPath, cacheIconPath);
          resolve(cacheIconPath);
        } catch (copyError) {
          reject(copyError);
        }
      });
    });
  };
}

export default LinuxUtils;
