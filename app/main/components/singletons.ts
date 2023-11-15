import playSound from 'play-sound';
import IntervalManager from './interval-manager';
import MenuBuilder from './menu';
import DatabaseManager from '@/pages/main_page/database';
import ClipboardManager from '@/pages/main_page/clip';
import StateManager from '@/store';
import StoreManager from '@/store/store';

const databaseManager = new DatabaseManager();
const clipboardManager = new ClipboardManager();
const intervalManager = new IntervalManager();
const stateManager = new StateManager();
const menuBuilder = new MenuBuilder();
const store = StoreManager.getInstance();
const player = playSound();

export { databaseManager, clipboardManager, intervalManager, menuBuilder, stateManager, store, player };
