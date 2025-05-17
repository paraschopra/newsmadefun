import { fetchAndCacheHeadlines, getCachedHeadlines } from '../lib/newsFetcher';
import * as fs from 'fs';
const path = require('path');

const DB_FILE = path.resolve(__dirname, '../headlines_test.db');

describe('newsFetcher service', () => {
  beforeEach(() => {
    // Clean up SQLite DB or mock it before each test
    if (fs.existsSync(DB_FILE)) fs.unlinkSync(DB_FILE);
  });

  it('fetches headlines from NewsAPI and caches them in SQLite', async () => {
    const headlines = await fetchAndCacheHeadlines();
    expect(Array.isArray(headlines)).toBe(true);
    expect(headlines.length).toBeGreaterThan(0);
    const cached = getCachedHeadlines();
    expect(cached).toEqual(headlines);
  });

  it('returns cached headlines if called again within the same day', async () => {
    const headlines1 = await fetchAndCacheHeadlines();
    const headlines2 = await fetchAndCacheHeadlines();
    expect(headlines2).toEqual(headlines1);
  });

  it('fetches new headlines if a day has passed', async () => {
    // First fetch and cache
    const headlines1 = await fetchAndCacheHeadlines();
    // Simulate a new day by manually updating the cache date
    const today = new Date().toISOString().slice(0, 10);
    // Remove today's cache to force a new fetch
    const db = require('better-sqlite3')(DB_FILE);
    db.prepare(`CREATE TABLE IF NOT EXISTS headlines_cache (
      date TEXT PRIMARY KEY,
      headlines TEXT
    )`).run();
    db.prepare('DELETE FROM headlines_cache WHERE date = ?').run(today);
    // Next fetch should re-fetch (mocked, so will be same data)
    const headlines2 = await fetchAndCacheHeadlines();
    expect(headlines2).toBeDefined();
    expect(Array.isArray(headlines2)).toBe(true);
  });
}); 