import Store from 'electron-store';
import playSound from 'play-sound';
import DatabaseManager from '../pages/main_page/database';
import ClipboardManager from '../pages/main_page/clip';
import StateManager from '../store';
import IntervalManager from './interval-manager';
import MenuBuilder from './menu';

const databaseManager = new DatabaseManager();
const clipboardManager = new ClipboardManager();
const intervalManager = new IntervalManager();
const stateManager = new StateManager();
const menuBuilder = new MenuBuilder();
const store = new Store();

const player = playSound();

export { databaseManager, clipboardManager, intervalManager, menuBuilder, stateManager, store, player };
