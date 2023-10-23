import DatabaseManager from '../main_page/database';
import ClipboardManager from '../main_page/clip';
import StateManager from '../store';
import IntervalManager from './interval-manager';
import MenuBuilder from './menu';

const databaseManager = new DatabaseManager();
const clipboardManager = new ClipboardManager();
const intervalManager = new IntervalManager();

const stateManager = new StateManager();
const menuBuilder = new MenuBuilder();

export { databaseManager, clipboardManager, intervalManager, menuBuilder, stateManager };
