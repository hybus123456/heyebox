import initSqlJs, { Database } from "sql.js";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DB_PATH = join(process.cwd(), "data", "heyebox.db");

let db: Database | null = null;

async function getDb(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: () => join(process.cwd(), "node_modules", "sql.js", "dist", "sql-wasm.wasm"),
  });

  if (existsSync(DB_PATH)) {
    const buffer = readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id TEXT NOT NULL,
      player_name TEXT NOT NULL DEFAULT '匿名',
      score INTEGER NOT NULL,
      level INTEGER,
      details TEXT,
      created_at TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id TEXT NOT NULL,
      item_type TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(item_id, item_type)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      avatar TEXT,
      created_at TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS verification_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0
    )
  `);

  saveDb();
  return db;
}

function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  
  const dir = join(process.cwd(), "data");
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  
  writeFileSync(DB_PATH, buffer);
}

// Feedback functions
export interface FeedbackItem {
  id: number;
  type: string;
  content: string;
  created_at: string;
}

export async function getAllFeedbacks(): Promise<FeedbackItem[]> {
  const db = await getDb();
  const result = db.exec("SELECT * FROM feedback ORDER BY id DESC");
  if (result.length === 0) return [];
  
  return result[0].values.map((row) => ({
    id: row[0] as number,
    type: row[1] as string,
    content: row[2] as string,
    created_at: row[3] as string,
  }));
}

export async function addFeedback(type: string, content: string): Promise<FeedbackItem> {
  const db = await getDb();
  const created_at = new Date().toLocaleString("zh-CN");
  
  db.run("INSERT INTO feedback (type, content, created_at) VALUES (?, ?, ?)", [type, content, created_at]);
  saveDb();
  
  const result = db.exec("SELECT last_insert_rowid()");
  const id = result[0].values[0][0] as number;
  
  return { id, type, content, created_at };
}

export async function deleteFeedback(id: number): Promise<boolean> {
  const db = await getDb();
  db.run("DELETE FROM feedback WHERE id = ?", [id]);
  saveDb();
  return true;
}

// Score functions
export interface ScoreItem {
  id: number;
  game_id: string;
  player_name: string;
  score: number;
  level: number | null;
  details: string | null;
  created_at: string;
}

export async function getAllScores(gameId?: string, limit: number = 10): Promise<ScoreItem[]> {
  const db = await getDb();
  let query = "SELECT * FROM scores";
  const params: unknown[] = [];
  
  if (gameId) {
    query += " WHERE game_id = ?";
    params.push(gameId);
  }
  
  query += " ORDER BY score DESC LIMIT ?";
  params.push(limit);
  
  const result = db.exec(query, params);
  if (result.length === 0) return [];
  
  return result[0].values.map((row) => ({
    id: row[0] as number,
    game_id: row[1] as string,
    player_name: row[2] as string,
    score: row[3] as number,
    level: row[4] as number | null,
    details: row[5] as string | null,
    created_at: row[6] as string,
  }));
}

export async function addScore(
  gameId: string,
  playerName: string,
  score: number,
  level?: number,
  details?: string
): Promise<ScoreItem> {
  const db = await getDb();
  const created_at = new Date().toLocaleString("zh-CN");
  
  db.run(
    "INSERT INTO scores (game_id, player_name, score, level, details, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [gameId, playerName, score, level || null, details || null, created_at]
  );
  saveDb();
  
  const result = db.exec("SELECT last_insert_rowid()");
  const id = result[0].values[0][0] as number;
  
  return { id, game_id: gameId, player_name: playerName, score, level: level || null, details: details || null, created_at };
}

// Favorite functions
export interface FavoriteItem {
  id: number;
  item_id: string;
  item_type: string;
  created_at: string;
}

export async function getFavorites(type?: string): Promise<FavoriteItem[]> {
  const db = await getDb();
  let query = "SELECT * FROM favorites";
  const params: unknown[] = [];
  
  if (type) {
    query += " WHERE item_type = ?";
    params.push(type);
  }
  
  query += " ORDER BY created_at DESC";
  
  const result = db.exec(query, params);
  if (result.length === 0) return [];
  
  return result[0].values.map((row) => ({
    id: row[0] as number,
    item_id: row[1] as string,
    item_type: row[2] as string,
    created_at: row[3] as string,
  }));
}

export async function addFavorite(itemId: string, itemType: string): Promise<FavoriteItem> {
  const db = await getDb();
  const created_at = new Date().toLocaleString("zh-CN");
  
  try {
    db.run(
      "INSERT INTO favorites (item_id, item_type, created_at) VALUES (?, ?, ?)",
      [itemId, itemType, created_at]
    );
    saveDb();
  } catch {
    // Ignore duplicate entry
  }
  
  const result = db.exec("SELECT id FROM favorites WHERE item_id = ? AND item_type = ?", [itemId, itemType]);
  const id = result[0].values[0][0] as number;
  
  return { id, item_id: itemId, item_type: itemType, created_at };
}

export async function removeFavorite(itemId: string, itemType: string): Promise<boolean> {
  const db = await getDb();
  db.run("DELETE FROM favorites WHERE item_id = ? AND item_type = ?", [itemId, itemType]);
  saveDb();
  return true;
}

export async function isFavorite(itemId: string, itemType: string): Promise<boolean> {
  const db = await getDb();
  const result = db.exec(
    "SELECT COUNT(*) FROM favorites WHERE item_id = ? AND item_type = ?",
    [itemId, itemType]
  );
  return (result[0].values[0][0] as number) > 0;
}

// User functions
export interface User {
  id: number;
  email: string;
  name: string | null;
  avatar: string | null;
  created_at: string;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDb();
  const result = db.exec("SELECT * FROM users WHERE email = ?", [email]);
  if (result.length === 0 || result[0].values.length === 0) return null;
  
  const row = result[0].values[0];
  return {
    id: row[0] as number,
    email: row[1] as string,
    name: row[2] as string | null,
    avatar: row[3] as string | null,
    created_at: row[4] as string,
  };
}

export async function createUser(email: string, name?: string): Promise<User> {
  const db = await getDb();
  const created_at = new Date().toLocaleString("zh-CN");
  
  db.run("INSERT INTO users (email, name, created_at) VALUES (?, ?, ?)", [email, name || null, created_at]);
  saveDb();
  
  const result = db.exec("SELECT last_insert_rowid()");
  const id = result[0].values[0][0] as number;
  
  return { id, email, name: name || null, avatar: null, created_at };
}

export async function createVerificationCode(email: string, code: string): Promise<void> {
  const db = await getDb();
  const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes
  
  db.run("DELETE FROM verification_codes WHERE email = ? OR expires_at < datetime('now')", [email]);
  db.run("INSERT INTO verification_codes (email, code, expires_at) VALUES (?, ?, ?)", [email, code, expires_at]);
  saveDb();
}

export async function verifyCode(email: string, code: string): Promise<boolean> {
  const db = await getDb();
  const result = db.exec(
    "SELECT id FROM verification_codes WHERE email = ? AND code = ? AND used = 0 AND expires_at > datetime('now')",
    [email, code]
  );
  
  if (result.length === 0 || result[0].values.length === 0) return false;
  
  const id = result[0].values[0][0] as number;
  db.run("UPDATE verification_codes SET used = 1 WHERE id = ?", [id]);
  saveDb();
  
  return true;
}
