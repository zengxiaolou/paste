export enum RemoveItem {
  ONE_DAY = 1,
  ONE_WEEK = 7,
  TWO_WEEKS = 14,
  ONE_MONTH = 30,
  TWO_MONTHS = 60,
  HALF_YEAR = 180,
  ONE_YEAR = 365,
  MANUAL = -1,
}

export enum LanguageEnum {
  SYSTEM = 'SYSTEM',
  EN = 'EN',
  ZH = 'ZH',
}
export enum ShortcutAction {
  ADD,
  DELETE,
}

export enum StoreKey {
  SHORTCUT_ACTION = 'shortcutAction',
  SHORTCUT_PREVIOUS = 'shortcutPrevious',
  SHORTCUT_NEXT = 'shortcutNext',
  SHORTCUT_PASTE = 'shortcutPaste',
  GENERAL_LOGIN = 'generalLogin',
  GENERAL_SOUND = 'generalSound',
  GENERAL_LANGUAGE = 'generalLanguage',
  ADVANCED_REMOVE = 'advancedRemove',
}

export enum Platform {
  MAC = 'darwin',
  WINDOW = 'win32',
  LINUX = 'linux',
}
