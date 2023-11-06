import { useEffect } from 'react';

type CallbackFunction = () => void;

export const useShortcut = (shortcutKey: string, callback: CallbackFunction) => {
  // 将 handleKeyDown 移动到 useEffect 中，确保它不会在每次渲染时重新创建
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    const setShortcutListener = (shortcutCombination: string) => {
      // 定义事件监听器
      const handleKeyDown = (event: KeyboardEvent) => {
        const keys = shortcutCombination.split('+');
        const keyMap: Record<string, boolean> = {
          Shift: event.shiftKey,
          Control: event.ctrlKey,
          Command: event.metaKey,
          Alt: event.altKey,
        };

        const isShortcutPressed = keys.every(key => {
          if (keyMap[key] !== undefined) {
            return keyMap[key];
          }
          return event.key === key;
        });

        if (isShortcutPressed) {
          event.preventDefault();
          callback();
        }
      };

      // 添加和清理事件监听器
      window.addEventListener('keydown', handleKeyDown);
      unsubscribe = () => window.removeEventListener('keydown', handleKeyDown);
    };

    // 设置快捷键监听器
    const handleShortcutChange = async () => {
      const shortcutCombination = (await window.ipc.getStoreValue(shortcutKey)) as string;
      setShortcutListener(shortcutCombination);
    };

    handleShortcutChange();

    // 监听快捷键变化
    const shortcutChangedListener = async (data: string) => {
      if (data === shortcutKey) {
        unsubscribe();
        await handleShortcutChange();
      }
    };

    window.ipc.onShortcutChanged(shortcutChangedListener);
  }, [callback, shortcutKey]);
};
