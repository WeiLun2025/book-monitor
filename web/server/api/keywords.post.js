// web/server/api/keywords.post.js
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

const KEYWORDS_PATH = resolve('../data/keywords.json');

export default defineEventHandler(async (event) => {
  const { keyword } = await readBody(event);
  if (!keyword) throw createError({ statusCode: 400, message: '關鍵字不能為空' });

  try {
    const raw = await readFile(KEYWORDS_PATH, 'utf-8');
    const keywords = JSON.parse(raw);

    if (keywords.includes(keyword)) {
      throw createError({ statusCode: 400, message: '關鍵字已存在' });
    }

    keywords.push(keyword);
    await writeFile(KEYWORDS_PATH, JSON.stringify(keywords, null, 2), 'utf-8');

    return { success: true, keywords };
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError({ statusCode: 500, message: '新增關鍵字失敗：' + err.message });
  }
});