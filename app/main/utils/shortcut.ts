import { globalShortcut } from 'electron';
import { stateManager, store } from '../components/singletons';
import { ShortcutAction } from '../types/enum';

export const activeShortcut = (action: ShortcutAction, shortcut?: string, old?: string) => {
  const win = stateManager.getMainWindow();
  let key = shortcut ?? store.get('shortcut:active');
  if (process.platform === 'darwin') {
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
