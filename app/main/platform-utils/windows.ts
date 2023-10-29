// import  struct  from 'ref-struct-napi';
// import { wchar_t } from 'ref-wchar-napi';
// import { ffi }  from 'ffi-napi';
// import { ref } from 'ref-mapi'
//
// const SHFILEINFO = struct({
//   'hIcon': 'long',
//   'iIcon': 'int',
//   'dwAttributes': 'uint32',
//   'szDisplayName': [wchar_t, 260], // MAX_PATH
//   'szTypeName': [wchar_t, 80]  // Adjust this value as per your requirement
// });
//
// const shell32 = ffi.Library('Shell32.dll', {
//   'SHGetFileInfoW': ['uint32', ['string', 'uint32', ref.refType(SHFILEINFO), 'uint32', 'uint32']]
// });
//
// class WindowsUtils {
//
//   public getActiveApplicationName = (): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const handle = this.user32.GetForegroundWindow();
//       if (!handle) {
//         reject(new Error('Unable to get handle of active window.'));
//         return;
//       }
//
//       const buffer = Buffer.alloc(255 * wchar_t.size);
//       const length = this.user32.GetWindowTextW(handle, buffer, buffer.length);
//       if (length > 0) {
//         resolve(buffer.toString('ucs2').replaceAll('\0', ''));
//       } else {
//         reject(new Error('Unable to get title of active window.'));
//       }
//     });
//   };
//
//   public getIconForApplicationName = (appPath: string): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const shfi = new SHFILEINFO();
//       const result = shell32.SHGetFileInfoW(
//         appPath,
//         0,
//         shfi.ref(),
//         shfi.constructor.size,
//         0x1_00
//       );
//       console.log(result);
//       // if (result) {
//       //   // TODO: 处理 shfi.hIcon，例如将其转换为图像数据，并返回图像的路径或数据
//       //   resolve(/* icon data or path */);
//       // } else {
//       //   reject(new Error('Unable to get icon.'));
//       // }
//     });
//   };
//
//
//   private user32 = ffi.Library('user32', {
//     'GetForegroundWindow': ['long', []],
//     'GetWindowTextW': ['int', ['long', wchar_t, 'int']]
//   })
// }
//
// export default WindowsUtils;
