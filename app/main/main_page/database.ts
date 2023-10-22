import { join } from 'node:path';
import sqlite3 from 'sqlite3';
import { app } from 'electron';
import { ClipData } from './type';

class DatabaseManager {
  private db: sqlite3.Database | undefined = undefined;

  constructor() {
    this.createDatabase();
  }

  private createDatabase() {
    const databasePath = join(app.getPath('userData'), 'clipboard.db');
    this.db = new sqlite3.Database(databasePath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

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
      (error: Error | null) => {
        if (error) {
          console.error('Error creating table:', error.message);
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

    this.db?.run(query, [icon, appName, content, tags, type, now], (error: Error | null) => {
      if (error) {
        console.error('Error inserting data:', error.message);
      } else {
        console.log('Data inserted successfully');
      }
    });
  }

  public getLastRow(): Promise<ClipData> {
    return new Promise((resolve, reject) => {
      this.db?.serialize(() => {
        this.db?.get('SELECT * FROM clipboard ORDER BY id DESC LIMIT 1', (error, row: ClipData) => {
          if (error) {
            console.error(error.message);
            reject(error);
          } else {
            resolve(row);
          }
        });
      });
    });
  }

  public getDataById(id: number): Promise<ClipData> {
    return new Promise((resolve, reject) => {
      this.db?.serialize(() => {
        const query = `SELECT * FROM clipboard WHERE id = ?`;
        this.db?.get(query, [id], (error, row: ClipData) => {
          if (error) {
            reject(error);
          } else {
            resolve(row);
          }
        });
      });
    });
  }

  public getRowsByPage(size: number, page: number): Promise<ClipData[]> {
    const offset = size * (page - 1);

    return new Promise((resolve, reject) => {
      this.db?.serialize(() => {
        const query = `SELECT * FROM clipboard ORDER BY id DESC LIMIT ? OFFSET ?`;
        this.db?.all(query, [size, offset], (error, rows: ClipData[]) => {
          if (error) {
            reject(error);
          } else {
            resolve(rows);
          }
        });
      });
    });
  }
  public getByContent(content: string): Promise<ClipData[]> {
    return new Promise((resolve, reject) => {
      this.db?.serialize(() => {
        const query = `SELECT * FROM clipboard WHERE content like ? and type =? order by created_at desc `;
        this.db?.all(query, [`%${content}%`, 'html'], (error, rows: ClipData[]) => {
          if (error) {
            reject(error);
          } else {
            resolve(rows);
          }
        });
      });
    });
  }

  public deleteById(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM clipboard WHERE id = ?';
      this.db?.run(query, id, error => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  }
}

export default DatabaseManager;
