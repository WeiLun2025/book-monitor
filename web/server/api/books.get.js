// web/server/api/books.get.js
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { existsSync } from 'fs';

const SEEN_PATH = resolve('../data/seen.json');

export default defineEventHandler(async () => {
  if (!existsSync(SEEN_PATH)) return [];

  try {
    const raw = await readFile(SEEN_PATH, 'utf-8');
    const seen = JSON.parse(raw);

    return Object.entries(seen).map(([key, book]) => ({
      key,
      ...book,
    }));
  } catch (err) {
    throw createError({ statusCode: 500, message: '讀取書籍清單失敗：' + err.message });
  }
});