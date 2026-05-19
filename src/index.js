// src/index.js
import { parse } from './parsers/kadokawa.js';
import { getKeywords } from './config.js';

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

  console.log(`共找到 ${books.length} 筆商品，符合關鍵字 ${matched.length} 筆\n`);
  matched.forEach(b => {
    console.log(`[${b.id}] ${b.title}`);
    console.log(`  → ${b.url}\n`);
  });
}

main();