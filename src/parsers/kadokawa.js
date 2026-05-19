// src/parsers/kadokawa.js
import * as cheerio from 'cheerio';

export function parse(html) {
  const $ = cheerio.load(html);
  const books = [];
  const seen = new Set();

  $('li.List-item a').each((_, el) => {
    const href = $(el).attr('href') || '';
    const title = $(el).text().trim();

    if (!href.includes('/products/')) return;

    const id = href.split('/products/')[1]?.split('?')[0];
    if (!id || !title) return;

    if (seen.has(id)) return;
    seen.add(id);

    books.push({
      id,
      title,
      url: href,
      source: 'kadokawa',
    });
  });

  if (books.length === 0) {
    console.warn('[kadokawa] 警告：未解析到任何商品，網站結構可能已改版');
  }

  return books;
}