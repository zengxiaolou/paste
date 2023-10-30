import { join } from 'node:path';
import sqlite3 from 'sqlite3';
import { app } from 'electron';
import { ClipboardDataQuery, ClipData } from './type';
import { DataTypes } from './enum';

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
      collection bool DEFAULT false,
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

  public saveToDatabase(clipData: ClipData): Promise<ClipData | Error> {
    const { icon, appName, content, tags, type } = clipData;
    const now = new Date().toISOString();
    const query = `
    INSERT INTO clipboard
    (icon, app_name, content, tags, type, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

    return new Promise((resolve, reject) => {
      this.db?.run(query, [icon, appName, content, tags, type, now], function (error: Error | null) {
        if (error) {
          console.error('Error inserting data:', error.message);
          reject(error);
        } else {
          Object.assign( clipData, { id: this.lastID });
          resolve(clipData);
        }
      });
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

  // eslint-disable-next-line complexity
  public getRowsByPage(parameters: ClipboardDataQuery): Promise<ClipData[]> {
    let query = 'SELECT * FROM clipboard';
    const queryParameters: (string | number | boolean | Date)[] = [];
    const conditions = [];

    if (parameters?.tags) {
      conditions.push('tags LIKE ?');
      queryParameters.push('%' + parameters.tags + '%');
    }
    if (parameters?.type) {
      conditions.push('type =?');
      queryParameters.push(parameters.type);
    }
    if (parameters?.collection) {
      conditions.push('collection =?');
      queryParameters.push(parameters.collection);
    }
    if (parameters?.type !== DataTypes.IMAGE && parameters?.content) {
      conditions.push('content LIKE ?');
      queryParameters.push('%' + parameters.content + '%');
    }
    if (parameters?.appName) {
      conditions.push('app_name =?');
      queryParameters.push(parameters?.appName);
    }
    if (parameters?.createdAt) {
      const formattedDate = new Date(parameters.createdAt).toISOString().split('T')[0];
      conditions.push('DATE(created_at) = DATE(?)');
      queryParameters.push(formattedDate);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    if (parameters?.size && parameters?.size > 0 && parameters?.page) {
      const offset = parameters.size * (parameters.page - 1);
      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      queryParameters.push(parameters.size, offset);
    }

    return new Promise((resolve, reject) => {
      this.db?.serialize(() => {
        this.db?.all(query, queryParameters, (error, rows: ClipData[]) => {
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

  public updateById(id: number, data: ClipData): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE clipboard SET tags =?, collection =? WHERE id =?';
      this.db?.run(query, [data.tags, data.collection, id], error => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  }

  public updateCreatedAtById(id: number, createdAt: Date): Promise<ClipData | Error> {
    return new Promise((resolve, reject) => {
      const updateQuery = 'UPDATE clipboard SET created_at = ? WHERE id = ?';
      this.db?.run(updateQuery, [createdAt.toISOString(), id], error => {
        if (error) {
          reject(error);
        } else {
          const selectQuery = 'SELECT * FROM clipboard WHERE id = ?';
          this.db?.get(selectQuery, [id], (error, row: ClipData) => {
            if (error) {
              reject(error);
            } else if (row) {
              resolve(row);
            } else {
              reject(new Error('No record found with id ' + id));
            }
          });
        }
      });
    });
  }


  public deleteByCreatedAt(created_at: Date): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM clipboard WHERE created_at <?';
      this.db?.run(query, created_at, error => {
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
