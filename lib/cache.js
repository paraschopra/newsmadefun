"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCache = initCache;
exports.setCachedHeadlines = setCachedHeadlines;
exports.getCachedHeadlines = getCachedHeadlines;
var path = require('path');
var Database = require('better-sqlite3');
var DB_FILE = path.resolve(__dirname, '../headlines_test.db');
var db = null;
function initCache() {
    if (!db) {
        db = new Database(DB_FILE, { readonly: false, fileMustExist: false });
        db.pragma('journal_mode = WAL');
        db.prepare("CREATE TABLE IF NOT EXISTS headlines_cache (\n      date TEXT PRIMARY KEY,\n      headlines TEXT\n    )").run();
    }
}
function setCachedHeadlines(date, headlines) {
    if (!db)
        initCache();
    var stmt = db.prepare("INSERT OR REPLACE INTO headlines_cache (date, headlines) VALUES (?, ?)");
    stmt.run(date, JSON.stringify(headlines));
}
function getCachedHeadlines(date) {
    if (!db)
        initCache();
    var row = db.prepare("SELECT headlines FROM headlines_cache WHERE date = ?").get(date);
    if (row && row.headlines) {
        return JSON.parse(row.headlines);
    }
    return null;
}
