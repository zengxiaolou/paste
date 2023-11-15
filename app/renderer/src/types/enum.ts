export enum DataTypes {
  HTML = 'html',
  IMAGE = 'image',
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

export const RemoveItemMap = {
  [RemoveItem.ONE_DAY]: 'After One Day',
  [RemoveItem.ONE_WEEK]: 'After One Week',
  [RemoveItem.TWO_WEEKS]: 'After Two Weeks',
  [RemoveItem.ONE_MONTH]: 'After One Month',
  [RemoveItem.TWO_MONTHS]: 'After Two Months',
  [RemoveItem.HALF_YEAR]: 'After Half Year',
  [RemoveItem.ONE_YEAR]: 'After One Year',
  [RemoveItem.MANUAL]: 'After Manual',
};
