const path = require('path');
const Database = require('better-sqlite3');

const DB_FILE = path.resolve(__dirname, '../headlines_test.db');
let db: any = null;

export function initCache() {
  if (!db) {
    db = new Database(DB_FILE, { readonly: false, fileMustExist: false });
    db.pragma('journal_mode = WAL');
    db.prepare(`CREATE TABLE IF NOT EXISTS headlines_cache (
      date TEXT PRIMARY KEY,
      headlines TEXT
    )`).run();
  }
}

export function setCachedHeadlines(date: string, headlines: any[]) {
  if (!db) initCache();
  const stmt = db.prepare(`INSERT OR REPLACE INTO headlines_cache (date, headlines) VALUES (?, ?)`);
  stmt.run(date, JSON.stringify(headlines));
}

export function getCachedHeadlines(date: string): any[] | null {
  if (!db) initCache();
  const row = db.prepare(`SELECT headlines FROM headlines_cache WHERE date = ?`).get(date);
  if (row && row.headlines) {
    return JSON.parse(row.headlines);
  }
  return null;
}
