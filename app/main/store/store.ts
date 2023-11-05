import Store from 'electron-store';
import { LanguageEnum, RemoveItem, StoreKey } from '../types/enum';

class StoreManager {
  private static instance: StoreManager;
  private store: Store;

  private constructor() {
    this.store = new Store();
    this.initDefaults();
  }

  private initDefaults() {
    if (!this.store.has(StoreKey.GENERAL_LOGIN)) {
      this.store.set(StoreKey.GENERAL_LOGIN, true);
    }
    if (!this.store.has(StoreKey.GENERAL_SOUND)) {
      this.store.set(StoreKey.GENERAL_SOUND, true);
    }
    if (!this.store.has(StoreKey.GENERAL_LANGUAGE)) {
      this.store.set(StoreKey.GENERAL_LANGUAGE, LanguageEnum.SYSTEM);
    }
    if (!this.store.has(StoreKey.SHORTCUT_ACTION)) {
      this.store.set(StoreKey.SHORTCUT_ACTION, 'Command+Shift+X');
    }
    if (!this.store.has(StoreKey.SHORTCUT_PREVIOUS)) {
      this.store.set(StoreKey.SHORTCUT_PREVIOUS, 'Command+Shift+[');
    }
    if (!this.store.has(StoreKey.SHORTCUT_NEXT)) {
      this.store.set(StoreKey.SHORTCUT_NEXT, 'Command+Shift+]');
    }
    if (!this.store.has(StoreKey.SHORTCUT_PASTE)) {
      this.store.set(StoreKey.SHORTCUT_PASTE, 'Command+Shift+V');
    }
    if (!this.store.has(StoreKey.ADVANCED_REMOVE)) {
      this.store.set(StoreKey.ADVANCED_REMOVE, RemoveItem.oneDay);
    }
  }

  public static getInstance(): StoreManager {
    if (!StoreManager.instance) {
      StoreManager.instance = new StoreManager();
    }
    return StoreManager.instance;
  }

  public get(key: string): any {
    return this.store.get(key);
  }

  public set(key: string, value: any): void {
    this.store.set(key, value);
  }

  public delete(key: string): void {
    this.store.delete(key);
  }

  public onDidChange(key: string, callback: (newValue: any, oldValue: any) => void): void {
    this.store.onDidChange(key, callback);
  }

  public getByPrefix(prefix: string): any {
    const allSettings = this.store.store;
    const filteredSettings: any = {};

    for (const key in allSettings) {
      if (Object.hasOwnProperty.call(allSettings, key) && key.startsWith(prefix)) {
        // eslint-disable-next-line security/detect-object-injection
        filteredSettings[key] = allSettings[key];
      }
    }
    return filteredSettings;
  }

  public deleteAll(): void {
    return this.store.clear();
  }
}

export default StoreManager;
