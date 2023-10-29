import activeWin from 'active-win'

class WindowsUtils {
   public  getActiveApplicationName = async (): Promise<any> => {
     const activeWindow = await activeWin();
     if (activeWindow) {
       console.log(`Active app name: ${activeWindow.owner.name}`);
     } else {
       console.log('No active window found');
     }
  };

  public getIconForApplicationName = (appName: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      resolve(appName)
    });
  };
}

export default WindowsUtils;
