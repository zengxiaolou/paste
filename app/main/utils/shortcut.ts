import { globalShortcut } from 'electron';
import { stateManager, store } from '../components/singletons';
import { Platform, ShortcutAction, StoreKey } from '../types/enum';

export const activeShortcut = (action: ShortcutAction, shortcut?: string, old?: string) => {
  const win = stateManager.getMainWindow();
  let key = shortcut ?? store.get(StoreKey.SHORTCUT_ACTION);
  if (process.platform === Platform.MAC) {
    action === ShortcutAction.ADD &&
      globalShortcut.register(key, () => {
        if (win?.isVisible()) {
          win?.hide();
        } else {
          win?.showInactive();
        }
      });
    action === ShortcutAction.ADD && old && globalShortcut.unregister(old);
    action === ShortcutAction.DELETE && shortcut && globalShortcut.unregister(shortcut);
  }
};
