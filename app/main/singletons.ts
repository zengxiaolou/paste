const DatabaseManager = require('./main_page/database');
const ClipboardManager = require('./main_page/clip');
const dbManager = new DatabaseManager();
const clipboardManager = new ClipboardManager();

export { dbManager, clipboardManager };
