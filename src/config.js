// src/config.js
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const KEYWORDS_PATH = resolve(__dirname, '../data/keywords.json');

export async function getKeywords() {
  try {
    const raw = await readFile(KEYWORDS_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[錯誤] 讀取關鍵字失敗：', err.message);
    return [];
  }
}