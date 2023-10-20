import { clipData } from './type';
import * as sqlite3 from 'sqlite3';
const dataPath = require('path');
const { app: dbApp } = require('electron');

let db: sqlite3.Database | null = null;

const createDatabase = () => {
  const dbPath = dataPath.join(dbApp.getPath('userData'), 'clipboard.db');
  db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

  db.run(
    `CREATE TABLE IF NOT EXISTS clipboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    icon TEXT,
    app_name TEXT,
    content TEXT,
    tags TEXT,
    type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`,
    (err: Error | null) => {
      if (err) {
        console.error('Error creating table: ', err.message);
      } else {
        console.log('Table clipboard created successfully or already exists');
      }
    }
  );
};

const saveToDatabase = (clipData: clipData) => {
  const { icon, appName, content, tags, type } = clipData;

  const query = `
    INSERT INTO clipboard
    (icon, app_name, content, tags, type)
    VALUES (?, ?, ?, ?, ?)
  `;

  db?.run(query, [icon, appName, content, tags, type], (err: Error | null) => {
    if (err) {
      console.error('Error inserting data:', err.message);
    } else {
      console.log('Data inserted successfully');
    }
  });
};

const getLastRow = () => {
  return new Promise((resolve, reject) => {
    db?.serialize(() => {
      db?.get('SELECT * FROM clipboard ORDER BY id DESC LIMIT 1', (err, row) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  });
};

const getRowsByPage = async (size: number, page: number) => {
  // 计算偏移量
  const offset = size * (page - 1);

  return new Promise((resolve, reject) => {
    db?.serialize(() => {
      // 使用占位符（?）以避免SQL注入
      const query = `SELECT * FROM clipboard ORDER BY id DESC LIMIT ? OFFSET ?`;
      db?.all(query, [size, offset], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  });
};

module.exports = { createDatabase, db, saveToDatabase, getLastRow, getRowsByPage };
