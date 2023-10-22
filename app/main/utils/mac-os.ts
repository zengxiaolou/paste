import { exec } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import fs from 'node:fs';
import sharp from 'sharp';

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
        let icnsFiles: string[];
        try {
          icnsFiles = await fs.promises.readdir(resourcesPath);
          // eslint-disable-next-line node/no-unsupported-features/es-syntax
        } catch {
          reject('Failed to read the Resources directory.');
          return;
        }

        const primaryIcnsFile = icnsFiles.find(file => file.endsWith('.icns'));
        if (!primaryIcnsFile) {
          reject('No icns file found for the application.');
          return;
        }

        const originalIconPath = join(resourcesPath, primaryIcnsFile);
        const iconFileName = `${appName}.png`;
        const cacheIconPath = join(tmpdir(), iconFileName);

        try {
          await fs.promises.access(cacheIconPath);
          resolve(cacheIconPath);
          return;
          // eslint-disable-next-line node/no-unsupported-features/es-syntax
        } catch {
          // eslint-disable-next-line security/detect-child-process
          exec(`iconutil -c iconset "${originalIconPath}"`, async (error_, _, stderr) => {
            if (error_ || stderr) {
              reject(`Error converting .icns to .iconset: ${stderr}`);
              return;
            }

            const pngPath = originalIconPath.replace('.icns', '.iconset/icon_512x512.png');
            try {
              await sharp(pngPath).toFile(cacheIconPath);
              resolve(cacheIconPath);
            } catch (sharpError) {
              reject(`Error processing png with sharp: ${sharpError}`);
            }
          });
        }
      });
    });
  }
}

export default MacOSUtils;
