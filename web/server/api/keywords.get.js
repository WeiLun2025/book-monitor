// web/server/api/keywords.get.js
import { readFile } from 'fs/promises';
import { resolve } from 'path';

const KEYWORDS_PATH = resolve('../data/keywords.json');

export default defineEventHandler(async () => {
  try {
    const raw = await readFile(KEYWORDS_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    throw createError({ statusCode: 500, message: '讀取關鍵字失敗：' + err.message });
  }
});