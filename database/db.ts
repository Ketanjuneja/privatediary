import * as SecureStore from 'expo-secure-store';
import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';


interface DiaryEntry {
  id?: number;
  date: string;
  mode: 'free' | 'qa';
  content: string;
  created_at?: string;
  updated_at?: string;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    try {
    
      let encryptionKey = await SecureStore.getItemAsync('db_encryption_key');
      if(!encryptionKey) 
        {
            encryptionKey = await Crypto.randomUUID();
            await SecureStore.setItemAsync('db_encryption_key', encryptionKey);
        } 
      this.db = await SQLite.openDatabaseAsync('diary.db', {
        encryptionKey: encryptionKey,
      });
      await this.createTables();
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private async createTables() {
    if (!this.db) throw new Error('Database not initialized');

    const tableExists = await this.db.getFirstAsync(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='diary_entries';
    `);

    if (!tableExists) {
      await this.db.execAsync(`
        CREATE TABLE diary_entries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL,
          mode TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create index for faster date queries
      await this.db.execAsync(`
        CREATE INDEX idx_diary_date ON diary_entries(date);
      `);
    }
  }

  async getEntry(date: string, mode: 'free' | 'qa'): Promise<DiaryEntry | null> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const result = await this.db.getFirstAsync(
        'SELECT * FROM diary_entries WHERE date = ? AND mode = ?',
        [date, mode]
      ) as DiaryEntry | null;

      return result;
    } catch (error) {
      console.error('Error getting entry:', error);
      return null;
    }
  }

  async setEntry(date: string, mode: 'free' | 'qa', content: string): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Check if entry exists
      const existingEntry = await this.getEntry(date, mode);

      if (existingEntry) {
        // Update existing entry
        await this.db.runAsync(
          'UPDATE diary_entries SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE date = ? AND mode = ?',
          [content, date, mode]
        );
      } else {
        // Insert new entry
        await this.db.runAsync(
          'INSERT INTO diary_entries (date, mode, content) VALUES (?, ?, ?)',
          [date, mode, content]
        );
      }

      return true;
    } catch (error) {
      console.error('Error setting entry:', error);
      return false;
    }
  }

  async getAllEntries(): Promise<DiaryEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const result = await this.db.getAllAsync(
        'SELECT * FROM diary_entries ORDER BY date DESC, created_at DESC'
      ) as DiaryEntry[];

      return result;
    } catch (error) {
      console.error('Error getting all entries:', error);
      return [];
    }
  }

  async deleteEntry(date: string, mode: 'free' | 'qa'): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.runAsync(
        'DELETE FROM diary_entries WHERE date = ? AND mode = ?',
        [date, mode]
      );
      return true;
    } catch (error) {
      console.error('Error deleting entry:', error);
      return false;
    }
  }

  async getEntriesByDateRange(startDate: string, endDate: string): Promise<DiaryEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const result = await this.db.getAllAsync(
        'SELECT * FROM diary_entries WHERE date >= ? AND date <= ? ORDER BY date DESC',
        [startDate, endDate]
      ) as DiaryEntry[];

      return result;
    } catch (error) {
      console.error('Error getting entries by date range:', error);
      return [];
    }
  }
}

export const db = new DatabaseService();
export type { DiaryEntry };