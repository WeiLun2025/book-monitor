// src/index.js
import { parse } from './parsers/kadokawa.js';

const URL = 'https://www.kadokawa.com.tw/products';

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

  const books = parse(html);
  console.log(`共找到 ${books.length} 筆商品\n`);

  books.forEach(b => {
    console.log(`[${b.id}] ${b.title}`);
    console.log(`  → ${b.url}\n`);
  });
}

main();