import {ffi}  from 'ffi-napi';
import {ref} from 'ref-mapi'
import {wchar_t} from 'ref-wchar-napi'
import {struct} from 'ref-strcut-napi'

const SHFILEINFO = struct({
  'hIcon': 'long',
  'iIcon': 'int',
  'dwAttributes': 'uint32',
  'szDisplayName': 'string',
  'szTypeName': 'string'
});

const DWORD = 'uint32';
const UINT = 'uint';

const shell32 = ffi.Library('Shell32.dll', {
  'SHGetFileInfoW': [DWORD, ['string', UINT, ref.refType(SHFILEINFO), UINT, UINT]]
});

class WindowsUtils {

  public getActiveApplicationName = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const handle = this.user32.GetForegroundWindow();
      if (!handle) {
        reject(new Error('Unable to get handle of active window.'));
        return;
      }

      const buffer = Buffer.alloc(255 * wchar_t.size);
      const length = this.user32.GetWindowTextW(handle, buffer, buffer.length);
      if (length > 0) {
        resolve(buffer.toString('ucs2').replace(/\0/g, ''));
      } else {
        reject(new Error('Unable to get title of active window.'));
      }
    });
  };

  public getIconForApplicationName = (appPath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const shfi = new SHFILEINFO();
      const result = shell32.SHGetFileInfoW(
        appPath,
        0,
        shfi.ref(),
        SHFILEINFO.size,
        0x100 // SHGFI_ICON
      );
      console.log(result);
      // if (result) {
      //   // TODO: 处理 shfi.hIcon，例如将其转换为图像数据，并返回图像的路径或数据
      //   resolve(/* icon data or path */);
      // } else {
      //   reject(new Error('Unable to get icon.'));
      // }
    });
  };
  // public getIconForApplicationName = async (appName: string): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const script = `
  //           tell application "Finder"
  //               get the file of application process "${appName}"
  //           end tell
  //       `;
  //
  //     exec(`osascript -e '${script}'`, async (error, stdout) => {
  //       if (error) {
  //         reject(error);
  //         return;
  //       }
  //
  //       const originalIconPath = stdout.trim();
  //       const iconFileName = `${appName}.icns`; // 你可以根据需要修改文件名的格式
  //       const cacheIconPath = join(tmpdir(), iconFileName);
  //
  //       try {
  //         await fs.copyFile(originalIconPath, cacheIconPath);
  //         resolve(cacheIconPath);
  //       } catch (copyError) {
  //         reject(copyError);
  //       }
  //     });
  //   });
  // };

  private user32 = ffi.Library('user32', {
    'GetForegroundWindow': ['long', []],
    'GetWindowTextW': ['int', ['long', wchar_t, 'int']]
  })
}

export default WindowsUtils;
