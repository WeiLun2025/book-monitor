// src/index.js
import { parse } from './parsers/kadokawa.js';
import { getKeywords } from './config.js';
import { loadSeen, saveSeen } from './store.js';

const URL = 'https://www.kadokawa.com.tw/products';

function filterByKeywords(books, keywords) {
  return books.filter(book =>
    keywords.some(keyword => book.title.includes(keyword))
  );
}

async function main() {
  console.log('抓取中...');

  let html;
  try {
    const res = await fetch(URL);
    if (!res.ok) throw new Error(`HTTP 錯誤：${res.status}`);
    html = await res.text();
  } catch (err) {
    console.error('[錯誤] 抓取頁面失敗：', err.message);
    process.exit(1);
  }

  const keywords = await getKeywords();
  const books = parse(html);
  const matched = filterByKeywords(books, keywords);
  const seen = await loadSeen();

  const newBooks = [];

  for (const book of matched) {
    const key = `${book.source}_${book.id}`;
    if (seen[key]) continue;

    seen[key] = {
      title: book.title,
      source: book.source,
      url: book.url,
      created_at: new Date().toISOString(),
    };

    newBooks.push(book);
  }

  await saveSeen(seen);

  if (newBooks.length === 0) {
    console.log('沒有新書。');
  } else {
    console.log(`發現 ${newBooks.length} 本新書！\n`);
    newBooks.forEach(b => {
      console.log(`[新書] ${b.title}`);
      console.log(`  → ${b.url}\n`);
    });
  }
}

main();