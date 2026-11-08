// Omega Res — نظام متابعة المشروعات والمشتريات
// تشغيل على الكمبيوتر: node server.js  (بدون أي مكتبات إضافية)
// نفس منطق النظام موجود في core.mjs ويستخدمه أيضًا worker.mjs على Cloudflare.
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const PUBLIC_DIR = path.join(ROOT, 'public');
const MAX_BODY = 25 * 1024 * 1024;

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.pdf': 'application/pdf', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

function readText(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => {
      size += c.length;
      if (size > MAX_BODY) { reject(new Error('too_large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function serveFile(res, file, headers) {
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, headers); return res.end('Not found'); }
    res.writeHead(200, { ...headers, 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    fs.createReadStream(file).pipe(res);
  });
}

(async () => {
  const { createCore, newDatabase } = await import('./core.mjs');

  let db;
  if (fs.existsSync(DB_FILE)) db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  else { db = newDatabase(); console.log('تم إنشاء قاعدة بيانات جديدة. المستخدم: admin  كلمة المرور: admin123 (سيُطلب تغييرها عند أول دخول)'); }

  let saveTimer = null;
  const storage = {
    db,
    save(d) {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        const tmp = DB_FILE + '.tmp';
        fs.writeFileSync(tmp, JSON.stringify(d, null, 2));
        fs.renameSync(tmp, DB_FILE);
      }, 50);
    },
    async putFile(name, bytes) { fs.writeFileSync(path.join(UPLOAD_DIR, path.basename(name)), bytes); },
    async getFile(name) {
      const f = path.join(UPLOAD_DIR, path.basename(name));
      if (!fs.existsSync(f)) return null;
      return { bytes: fs.readFileSync(f), type: MIME[path.extname(f).toLowerCase()] };
    }
  };
  const core = createCore(storage);
  const SEC = core.SECURITY_HEADERS;

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    try {
      if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/uploads/')) {
        let body = '';
        try { body = req.method === 'GET' ? '' : await readText(req); }
        catch { res.writeHead(400, { ...SEC, 'Content-Type': 'application/json; charset=utf-8' }); return res.end(JSON.stringify({ error: 'حجم الطلب كبير جدًا' })); }
        const out = await core.handle({ method: req.method, path: req.url, headers: req.headers, ip: req.socket.remoteAddress, https: false, body });
        res.writeHead(out.status, { ...SEC, ...out.headers });
        return res.end(out.body);
      }
      let rel = decodeURIComponent(url.pathname);
      if (rel === '/' || !path.extname(rel)) rel = '/index.html';
      const file = path.normalize(path.join(PUBLIC_DIR, rel));
      if (!file.startsWith(PUBLIC_DIR)) { res.writeHead(403, SEC); return res.end(); }
      serveFile(res, file, SEC);
    } catch (e) {
      console.error(e);
      if (!res.headersSent) { res.writeHead(500, SEC); res.end('خطأ في الخادم'); }
    }
  });

  server.listen(PORT, () => {
    const nets = require('os').networkInterfaces();
    console.log(`\n  Omega Res يعمل الآن:  http://localhost:${PORT}`);
    for (const list of Object.values(nets)) for (const n of list || [])
      if (n.family === 'IPv4' && !n.internal) console.log(`  من أجهزة الشبكة:    http://${n.address}:${PORT}`);
    console.log('');
  });
})();
