import DatabaseManager from './main_page/database';
import ClipboardManager from './main_page/clip';

const databaseManager = new DatabaseManager();
const clipboardManager = new ClipboardManager();

export { databaseManager as dbManager, clipboardManager };
