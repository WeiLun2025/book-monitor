// src/store.js
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = resolve(__dirname, '../data/seen.json');

export async function loadSeen() {
  if (!existsSync(DB_PATH)) return {};
  try {
    const raw = await readFile(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[錯誤] 讀取 seen.json 失敗：', err.message);
    return {};
  }
}

export async function saveSeen(seen) {
  try {
    await writeFile(DB_PATH, JSON.stringify(seen, null, 2), 'utf-8');
  } catch (err) {
    console.error('[錯誤] 寫入 seen.json 失敗：', err.message);
  }
}