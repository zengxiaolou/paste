import Store from 'electron-store';
import { LanguageEnum, RemoveItem } from '../types/enum';

class StoreManager {
  private static instance: StoreManager;
  private store: Store;

  private constructor() {
    this.store = new Store();
    this.initDefaults();
  }

  private initDefaults() {
    if (!this.store.has('login')) {
      this.store.set('login', true);
    }
    if (!this.store.has('sound')) {
      this.store.set('sound', true);
    }
    if (!this.store.has('language')) {
      this.store.set('language', LanguageEnum.en);
    }
    if (!this.store.has('shortcut:active')) {
      this.store.set('shortcut:active', 'Command+Shift+X');
    }
    if (!this.store.has('shortcut:previous')) {
      this.store.set('shortcut:previous', 'Command+Shift+[');
    }
    if (!this.store.has('shortcut:next')) {
      this.store.set('shortcut:next', 'Command+Shift+]');
    }
    if (!this.store.has('shortcut:paste')) {
      this.store.set('shortcut:paste', 'Command');
    }
    if (!this.store.has('advanced:remove')) {
      this.store.set('advanced:remove', RemoveItem.oneMonth);
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
}

export default StoreManager;
