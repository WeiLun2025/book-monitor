// web/server/api/scan.post.js
import { execFile } from 'child_process';
import { resolve } from 'path';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export default defineEventHandler(async () => {
  const scriptPath = resolve('../src/index.js');

  try {
    const { stdout, stderr } = await execFileAsync('node', [scriptPath], {
      encoding: 'utf-8',
    });
    if (stderr) console.error('stderr:', stderr);
    return { success: true, output: stdout || '執行完成' };
  } catch (err) {
    console.error('scan error:', err.message);
    if (err.stdout) {
      return { success: true, output: err.stdout };
    }
    throw createError({ statusCode: 500, message: err.message });
  }
});