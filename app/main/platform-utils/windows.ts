import fs from 'node:fs'
import activeWin from 'active-win'

import  {app} from 'electron'

class WindowsUtils {
   public  getActiveApplicationName = async (): Promise<any> => {
     const activeWindow = await activeWin();
     if (activeWindow) {
       return activeWindow.owner.name
     } else {
       console.log('No active window found');
       return '';
     }
  };

  public getIconForApplicationName = async (appName?: string): Promise<string> => {
    // eslint-disable-next-line unicorn/prefer-module
    const iconExtractor = require('icon-extractor');
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const win = await activeWin();
          if (win) {
            iconExtractor.emitter.on('icon', function(data: any){
              const base64Data = data.Base64ImageData.replace(/^data:image\/png;base64,/, "");
              const imgPath = `${app.getPath('userData')}/${appName}.png`;
              fs.writeFile(imgPath, base64Data, 'base64', function(error) {
                if(error) {
                  console.error('Error saving icon:', error);
                  reject(error);
                } else {
                  console.log('Icon saved as', imgPath);
                  resolve(imgPath);
                }
              });
            });
            iconExtractor.emitter.on('error', function(error: any){
              console.error('Error fetching icon:', error);
              reject(error);
            });
            iconExtractor.getIcon(appName, win.owner.path);
          } else {
            const error = new Error('No active window found');
            console.error(error);
            reject(error);
          }
        } catch (error) {
          console.error('Error fetching icon:', error);
          reject(error);
        }
      })();
    });
  };
}

export default WindowsUtils;
