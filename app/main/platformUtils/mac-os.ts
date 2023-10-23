import { exec } from 'node:child_process';
import path, { join } from 'node:path';
import { tmpdir } from 'node:os';
import fs from 'node:fs';
import * as promises_fs from 'node:fs/promises';
import { PathLike } from 'node:fs';
import SimplePlist from 'simple-plist';
import { MAIN_PAGE_DIRECTION } from '../main_page/const';

class MacOSUtils {
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
          resolve(stdout.trim());
        }
      });
    });
  };

  public async getIconForApplicationName(appName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const script = `
      tell application "Finder"
          get the file of application process "${appName}"
      end tell
    `;

      // eslint-disable-next-line security/detect-child-process
      exec(`osascript -e '${script}'`, async (error, stdout) => {
        if (error) {
          reject(error);
          return;
        }

        const appBundlePath = stdout.trim().replace('alias Macintosh HD:', '/').replaceAll(':', '/');
        const resourcesPath = join(appBundlePath, '/Contents/Resources/');
        const contentsPath = join(appBundlePath, '/Contents/info.plist');
        const iconName = await this.getICNSNameFromPlist(contentsPath);
        if (!iconName) {
          return;
        }
        const originalIconPath = join(resourcesPath, iconName);
        const iconSetPath = await this.convertIcnsToIconset(originalIconPath, iconName);
        if (!iconSetPath) {
          reject('No available icon found for the application.');
          return;
        }
        const chosenIconPath = await this.findDesiredPng(iconSetPath);

        const iconFileName = `${appName}.png`;
        const cacheIconPath = join(tmpdir(), iconFileName);
        await promises_fs.copyFile(<PathLike>chosenIconPath, cacheIconPath);
        resolve(cacheIconPath);
      });
    });
  }
  private async convertIcnsToIconset(icnsPath: string, iconName: string) {
    const temporaryDirection = path.join(MAIN_PAGE_DIRECTION, 'temp');
    const temporaryPath = path.join(temporaryDirection, iconName.replaceAll(' ', ''));

    fs.mkdirSync(temporaryDirection, { recursive: true });

    fs.copyFileSync(icnsPath, temporaryPath);
    return new Promise((resolve, reject) => {
      const iconsetPath = temporaryPath.replace('.icns', '.iconset');
      // eslint-disable-next-line security/detect-child-process
      exec(`iconutil -c iconset ${temporaryPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return reject(error);
        }
        if (stderr) {
          console.error(`Stderr: ${stderr}`);
          return reject(new Error(stderr));
        }
        console.log(`Stdout: ${stdout}`);
        resolve(iconsetPath);
      });
    });
  }
  private async findDesiredPng(iconsetPath: any): Promise<string | undefined> {
    try {
      const files = await promises_fs.readdir(iconsetPath);
      const preferredSizes = ['256x256', '128x128', '64x64', '32x32'];
      for (const preferredSize of preferredSizes) {
        const desiredFile = files.find(file => file.includes(preferredSize) && file.endsWith('.png'));
        if (desiredFile) {
          return path.join(iconsetPath, desiredFile);
        }
      }
      return undefined;
    } catch (error) {
      console.error('Error in findDesiredPng:', error);
      return;
    }
  }

  private getICNSNameFromPlist(plistPath: string): string | undefined {
    const data: any = SimplePlist.readFileSync(plistPath);
    let icnsName: string | undefined = data.CFBundleIconFile;

    if (icnsName && !icnsName.endsWith('.icns')) {
      return `${icnsName}.icns`;
    }
    return icnsName;
  }
}

export default MacOSUtils;
