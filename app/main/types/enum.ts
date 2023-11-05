export enum RemoveItem {
  oneDay,
  oneWeek,
  twoWeeks,
  oneMonth,
  twoMonth,
  halfYear,
  oneYear,
  Manual,
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
