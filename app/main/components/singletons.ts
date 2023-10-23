import DatabaseManager from '../main_page/database';
import ClipboardManager from '../main_page/clip';
import IntervalManager from './interval-manager';

const databaseManager = new DatabaseManager();
const clipboardManager = new ClipboardManager();
const intervalManager = new IntervalManager();

export { databaseManager, clipboardManager, intervalManager };
