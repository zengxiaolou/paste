import DatabaseManager from './main_page/database';
import ClipboardManager from './main_page/clip';
import MacOSUtils from './utils/mac-os';

const databaseManager = new DatabaseManager();
const clipboardManager = new ClipboardManager();

const macOSUtils = new MacOSUtils();

export { databaseManager, clipboardManager, macOSUtils };
