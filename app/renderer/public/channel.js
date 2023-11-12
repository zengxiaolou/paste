export var Channels;
(function (Channels) {
  Channels['ON_TOP'] = 'toggle-always-on-top';
  Channels['GET_DATA'] = 'get-data';
  Channels['CLIPBOARD_DATA'] = 'clipboard-data';
  Channels['REQUEST_PASTE'] = 'request-paste';
  Channels['UPDATE_RECORD'] = 'update-record';
  Channels['SHOW_CONTEXT_MENU'] = 'show-context-menu';
  Channels['LANGUAGE_CHANGED'] = 'language-changed';
  Channels['GET_STORE_VALUE'] = 'get-store-value';
  Channels['SHORTCUT_CHANGE'] = 'shortcut-change';
  Channels['CHANGE_LOGIN'] = 'change-login';
  Channels['CHANGE_SOUND'] = 'change-sound';
  Channels['QUIT'] = 'quit';
  Channels['CHANGE_SHORTCUTS'] = 'change-shortcuts';
  Channels['GET_STORE_VALUES'] = 'get-store-values-by-prefix';
})(Channels || (Channels = {}));
