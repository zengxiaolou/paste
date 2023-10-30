import { exec } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

class LinuxUtils {
  public getActiveApplicationName = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const script = `
        xprop -id $(xprop -root _NET_ACTIVE_WINDOW | cut -d# -f2 | cut -d' ' -f2) WM_CLASS
      `;
      exec(script, (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          const result = stdout.trim().split('=')[1].split(',')[0].trim();
          console.log(result);
          resolve(result.replaceAll('"', ''));
        }
      });
    });
  };

  public async getIconForApplicationName(appName: string): Promise<string> {
    const binPath = await this.getBinPathForAppName(appName)
    console.log(binPath)
    return new Promise((resolve, reject) => {
      const possibleIconPaths = [
        path.join(binPath, '../icon.png'),
      ];

      for (const iconPath of possibleIconPaths) {
        if (fs.existsSync(iconPath)) {
          resolve(iconPath);
          return;
        }
      }

      reject('Icon not found');
    });
  }

  private getBinPathForAppName(appName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(`pgrep -f ${appName}`, (error, stdout) => {
        if (error) {
          reject('Could not find process');
          return;
        }

        const pid = stdout.trim().split('\n')[0];  // Get the first PID, if there are multiple
        console.log(pid)
        const exeLinkPath = `/proc/${pid}/exe`;

        fs.readlink(exeLinkPath, (error_: any, linkString) => {
          if (error_) {
            reject('Could not read symbolic link');
            return;
          }
          const binPath = path.dirname(linkString);
          resolve(binPath);
        });
      });
    });
  }
}

export default LinuxUtils
