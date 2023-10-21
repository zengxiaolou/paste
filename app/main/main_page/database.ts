import * as sqlite3 from 'sqlite3';
import path from 'path';
import { app } from 'electron';
import { ClipData } from './type';

class DatabaseManager {
  private db: sqlite3.Database | null = null;

  constructor() {
    this.createDatabase();
  }

  private createDatabase() {
    const dbPath = path.join(app.getPath('userData'), 'clipboard.db');
    this.db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

    this.db.run(
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
  }

  public saveToDatabase(clipData: ClipData) {
    const { icon, appName, content, tags, type } = clipData;
    const now = new Date().toISOString();
    const query = `
      INSERT INTO clipboard
      (icon, app_name, content, tags, type, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    this.db?.run(query, [icon, appName, content, tags, type, now], (err: Error | null) => {
      if (err) {
        console.error('Error inserting data:', err.message);
      } else {
        console.log('Data inserted successfully');
      }
    });
  }

  public getLastRow() {
    return new Promise((resolve, reject) => {
      this.db?.serialize(() => {
        this.db?.get('SELECT * FROM clipboard ORDER BY id DESC LIMIT 1', (err, row) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
    });
  }

  public getDataById(id: number) {
    return new Promise((resolve, reject) => {
      this.db?.serialize(() => {
        const query = `SELECT * FROM clipboard WHERE id = ?`;
        this.db?.get(query, [id], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
    });
  }

  public getRowsByPage(size: number, page: number) {
    const offset = size * (page - 1);

    return new Promise((resolve, reject) => {
      this.db?.serialize(() => {
        const query = `SELECT * FROM clipboard ORDER BY id DESC LIMIT ? OFFSET ?`;
        this.db?.all(query, [size, offset], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    });
  }
  public getByContent(content: string) {
    return new Promise((resolve, reject) => {
      this.db?.serialize(() => {
        const query = `SELECT * FROM clipboard WHERE content =?`;
        this.db?.get(query, [content], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
    });
  }
}

module.exports = DatabaseManager;
