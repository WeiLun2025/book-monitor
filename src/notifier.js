// src/notifier.js
import nodemailer from 'nodemailer';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, '../.env'), quiet: true });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendNotification(newBooks) {
  const bookList = newBooks
    .map(b => `・${b.title}\n  ${b.url}`)
    .join('\n\n');

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.NOTIFY_TO,
    subject: `📚 發現 ${newBooks.length} 本新書！`,
    text: `以下為新上架書籍：\n\n${bookList}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('通知信已寄出！');
  } catch (err) {
    console.error('[錯誤] 寄信失敗：', err.message);
  }
}