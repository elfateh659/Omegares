// Omega Res — نظام متابعة المشروعات والمشتريات
// Zero-dependency Node.js server: run with `node server.js`
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const PUBLIC_DIR = path.join(ROOT, 'public');
const MAX_BODY = 25 * 1024 * 1024; // 25MB (base64 uploads)
const MAX_FILE = 15 * 1024 * 1024; // 15MB per file

const APP_VERSION = '2026-11-08.4'; // must match public/app.js
const BRANCHES = ['cairo', 'alex']; // فرع القاهرة، فرع الإسكندرية
const USER_BRANCHES = [...BRANCHES, 'all'];
const DEPTS = ['tech', 'exec', 'purch', 'store', 'acc', 'eng', 'chair', 'it'];

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ---------- storage ----------
function hashPassword(pw, salt) {
  salt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(pw), salt, 64).toString('hex');
  return { salt, hash };
}
function verifyPassword(pw, user) {
  const { hash } = hashPassword(pw, user.salt);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(user.passHash, 'hex'));
}
const uid = (p = '') => p + crypto.randomBytes(6).toString('hex');
const now = () => new Date().toISOString();

let db;
function loadDb() {
  if (fs.existsSync(DB_FILE)) {
    db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } else {
    const { salt, hash } = hashPassword('admin123');
    db = {
      seq: 0,
      users: [{
        id: 'u_admin', username: 'admin', name: 'مدير النظام', dept: 'it', isAdmin: true,
        salt, passHash: hash, active: true, createdAt: now()
      }],
      projects: [],
      sessions: {}
    };
    saveDb();
    console.log('تم إنشاء قاعدة بيانات جديدة. المستخدم: admin  كلمة المرور: admin123');
  }
}
let saveTimer = null;
function saveDb() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const tmp = DB_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
    fs.renameSync(tmp, DB_FILE);
  }, 50);
}
loadDb();
// migrate older databases
if (!Array.isArray(db.stock)) db.stock = [];
if (!Array.isArray(db.withdrawals)) db.withdrawals = [];
if (typeof db.stockSeq !== 'number') db.stockSeq = 0;
if (typeof db.wseq !== 'number') db.wseq = 0;
// branches: existing records default to Cairo; the system admin covers all branches
for (const u of db.users) if (!USER_BRANCHES.includes(u.branch)) u.branch = u.isAdmin ? 'all' : 'cairo';
for (const x of [...db.projects, ...db.stock, ...db.withdrawals]) if (!BRANCHES.includes(x.branch)) x.branch = 'cairo';
for (const pr of db.projects) if (pr.storeInAt && !db.stock.some(s => s.projectId === pr.id)) stockInProject(pr, pr.stage === 'store_ship');
saveDb();

// ---------- helpers ----------
function send(res, code, obj, headers = {}) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(body);
}
const fail = (res, code, msg) => send(res, code, { error: msg });

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => {
      size += c.length;
      if (size > MAX_BODY) { reject(new Error('too_large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch { reject(new Error('bad_json')); }
    });
    req.on('error', reject);
  });
}
function parseCookies(req) {
  const out = {};
  (req.headers.cookie || '').split(';').forEach(p => {
    const i = p.indexOf('='); if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}
function currentUser(req) {
  const sid = parseCookies(req).sid;
  if (!sid || !db.sessions[sid]) return null;
  const u = db.users.find(x => x.id === db.sessions[sid].userId && x.active);
  return u || null;
}
const publicUser = u => ({ id: u.id, username: u.username, name: u.name, dept: u.dept, branch: u.branch, isAdmin: !!u.isAdmin, active: u.active });
const allBranches = u => u.isAdmin || u.branch === 'all';
const inBranch = (u, x) => allBranches(u) || x.branch === u.branch;
// the branch a new record goes to: the user's own branch, or the chosen one for users covering all branches
function targetBranch(u, wanted) {
  if (!allBranches(u)) return u.branch;
  if (!BRANCHES.includes(wanted)) throw Object.assign(new Error('اختر الفرع'), { code: 400 });
  return wanted;
}
const engOk = (eng, branch) => eng && eng.dept === 'eng' && eng.active && (eng.branch === branch || eng.branch === 'all');
const canManageUsers = u => u.isAdmin || u.dept === 'it';
const inDept = (u, dept) => u.isAdmin || u.dept === dept;

function saveUpload(file) {
  if (!file || !file.data) throw new Error('الملف مطلوب');
  const allowed = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp', 'image/gif': '.gif', 'application/pdf': '.pdf' };
  const ext = allowed[file.type];
  if (!ext) throw new Error('نوع الملف غير مدعوم (صورة أو PDF فقط)');
  const buf = Buffer.from(String(file.data), 'base64');
  if (buf.length > MAX_FILE) throw new Error('حجم الملف أكبر من 15 ميجابايت');
  const name = uid('f_') + ext;
  fs.writeFileSync(path.join(UPLOAD_DIR, name), buf);
  return { id: uid('a_'), url: '/uploads/' + name, name: String(file.name || name).slice(0, 120), type: file.type, size: buf.length };
}

function log(p, user, action, note) {
  p.history.push({ at: now(), by: user.name, userId: user.id, dept: user.dept, action, note: note || '' });
  p.updatedAt = now();
}

// ---------- stock ----------
const badUnit = u => !u || /^[\s\d٠-٩.,٫،/-]+$/.test(u);
const codeOf = n => 'OR' + String(n).padStart(6, '0');
const round3 = n => Math.round(n * 1000) / 1000;
function newStock(fields) {
  db.stockSeq += 1;
  const s = { id: uid('s_'), seq: db.stockSeq, code: codeOf(db.stockSeq), name: '', unit: '', qty: 0, projectId: null, projectName: null, createdAt: now(), updatedAt: now(), moves: [], ...fields };
  db.stock.push(s); return s;
}
function move(s, user, type, qty, ref) {
  s.moves.push({ at: now(), by: user ? user.name : '', type, qty, ref: ref || '', balance: s.qty });
  if (s.moves.length > 300) s.moves = s.moves.slice(-300);
  s.updatedAt = now();
}
function stockInProject(pr, inStock, user) {
  for (const it of pr.items) {
    if (db.stock.some(s => s.projectId === pr.id && s.itemId === it.id)) continue;
    const s = newStock({ branch: pr.branch, name: it.name, unit: it.unit, qty: inStock ? it.qty : 0, projectId: pr.id, projectName: pr.name, projectNumber: pr.number, itemId: it.id });
    move(s, user, 'in', it.qty, pr.number);
    if (!inStock) move(s, user, 'ship', -it.qty, pr.number);
  }
}
function shipProject(pr, user) {
  for (const s of db.stock.filter(s => s.projectId === pr.id && s.qty > 0)) { const q = s.qty; s.qty = 0; move(s, user, 'ship', -q, pr.number); }
}

// ---------- workflow ----------
const allQuoted = p => p.items.every(i => i.quotes.length > 0) || 'أضف عرض سعر واحد على الأقل لكل بند';
const allSelected = p => p.items.every(i => i.selected && i.quotes.some(q => q.id === i.selected)) || 'اختر سعرًا واحدًا لكل بند';
const hasInvoices = p => p.invoices.length > 0 || 'ارفع فاتورة شراء واحدة على الأقل';
const allChecked = p => p.items.every(i => i.checked) || 'افحص كل الأصناف قبل الإدخال للمخزن';
const total = p => p.items.reduce((s, i) => {
  const q = i.quotes.find(q => q.id === i.selected); return s + (q ? q.price * i.qty : 0);
}, 0);

const TRANS = {
  send:          { from: 'draft',         to: 'purch_new',     dept: 'tech' },
  reopen:        { from: 'rejected',      to: 'draft',         dept: 'tech' },
  purch_receive: { from: 'purch_new',     to: 'purch_quote',   dept: 'purch', assign: 'purch' },
  to_review:     { from: 'purch_quote',   to: 'exec_review',   dept: 'purch', check: allQuoted },
  to_chair:      { from: 'exec_review',   to: 'chair',         dept: 'exec',  check: allSelected },
  approve:       { from: 'chair',         to: 'acc_new',       dept: 'chair' },
  reject:        { from: 'chair',         to: 'rejected',      dept: 'chair' },
  acc_receive:   { from: 'acc_new',       to: 'acc_work',      dept: 'acc',   assign: 'acc' },
  acc_done:      { from: 'acc_work',      to: 'purch_buy_new', dept: 'acc' },
  buy_receive:   { from: 'purch_buy_new', to: 'purch_buying',  dept: 'purch', assign: 'buy' },
  buy_done:      { from: 'purch_buying',  to: 'store_inspect', dept: 'purch', check: hasInvoices },
  store_done:    { from: 'store_inspect', to: 'store_ship',    dept: 'store', check: allChecked },
  ship:          { from: 'store_ship',    to: 'eng_receive',   dept: 'store' },
  eng_receive:   { from: 'eng_receive',   to: 'closed',        dept: 'eng' },
};

function cleanItems(items) {
  if (!Array.isArray(items) || !items.length) throw new Error('أضف بندًا واحدًا على الأقل');
  return items.map(i => {
    const name = String(i.name || '').trim();
    const qty = Number(i.qty);
    if (!name) throw new Error('اسم البند مطلوب');
    if (!(qty > 0)) throw new Error('الكمية يجب أن تكون أكبر من صفر');
    return {
      id: uid('i_'), name: name.slice(0, 200), qty, unit: String(i.unit || '').trim().slice(0, 30),
      spec: String(i.spec || '').trim().slice(0, 1000), quotes: [], selected: null, checked: false
    };
  });
}

// ---------- routes ----------
async function api(req, res, url) {
  const m = req.method;
  const p = url.pathname;

  if (p === '/api/login' && m === 'POST') {
    const b = await readBody(req);
    const u = db.users.find(x => x.username.toLowerCase() === String(b.username || '').trim().toLowerCase());
    if (!u || !u.active || !verifyPassword(b.password || '', u)) return fail(res, 401, 'اسم المستخدم أو كلمة المرور غير صحيحة');
    const sid = crypto.randomBytes(24).toString('hex');
    db.sessions[sid] = { userId: u.id, at: now() };
    saveDb();
    return send(res, 200, { user: publicUser(u), version: APP_VERSION }, { 'Set-Cookie': `sid=${sid}; HttpOnly; Path=/; SameSite=Lax; Max-Age=2592000` });
  }

  const user = currentUser(req);
  if (!user) return fail(res, 401, 'يجب تسجيل الدخول');

  if (p === '/api/logout' && m === 'POST') {
    delete db.sessions[parseCookies(req).sid]; saveDb();
    return send(res, 200, { ok: true }, { 'Set-Cookie': 'sid=; Path=/; Max-Age=0' });
  }
  if (p === '/api/me' && m === 'GET') return send(res, 200, { user: publicUser(user), version: APP_VERSION });
  if (p === '/api/me/password' && m === 'POST') {
    const b = await readBody(req);
    if (!verifyPassword(b.current || '', user)) return fail(res, 400, 'كلمة المرور الحالية غير صحيحة');
    if (String(b.next || '').length < 6) return fail(res, 400, 'كلمة المرور الجديدة 6 أحرف على الأقل');
    const { salt, hash } = hashPassword(b.next); user.salt = salt; user.passHash = hash; saveDb();
    return send(res, 200, { ok: true });
  }

  // users
  if (p === '/api/users' && m === 'GET') return send(res, 200, { users: db.users.filter(u => allBranches(user) || u.branch === user.branch || u.branch === 'all').map(publicUser) });
  if (p === '/api/users' && m === 'POST') {
    if (!canManageUsers(user)) return fail(res, 403, 'غير مصرح');
    const b = await readBody(req);
    const username = String(b.username || '').trim();
    if (!username || !String(b.name || '').trim()) return fail(res, 400, 'الاسم واسم المستخدم مطلوبان');
    if (!DEPTS.includes(b.dept)) return fail(res, 400, 'اختر الإدارة');
    if (!USER_BRANCHES.includes(b.branch)) return fail(res, 400, 'اختر الفرع');
    if (!allBranches(user) && b.branch !== user.branch) return fail(res, 403, 'تستطيع إضافة موظفين لفرعك فقط');
    if (String(b.password || '').length < 6) return fail(res, 400, 'كلمة المرور 6 أحرف على الأقل');
    if (db.users.some(x => x.username.toLowerCase() === username.toLowerCase())) return fail(res, 400, 'اسم المستخدم مستخدم من قبل');
    const { salt, hash } = hashPassword(b.password);
    const u = { id: uid('u_'), username, name: String(b.name).trim(), dept: b.dept, branch: b.branch, isAdmin: false, salt, passHash: hash, active: true, createdAt: now() };
    db.users.push(u); saveDb();
    return send(res, 200, { user: publicUser(u) });
  }
  let mm = p.match(/^\/api\/users\/([\w]+)$/);
  if (mm) {
    if (!canManageUsers(user)) return fail(res, 403, 'غير مصرح');
    const u = db.users.find(x => x.id === mm[1]);
    if (!u || (!allBranches(user) && u.branch !== user.branch)) return fail(res, 404, 'غير موجود');
    if (m === 'PATCH') {
      const b = await readBody(req);
      if (b.name) u.name = String(b.name).trim();
      if (b.dept && DEPTS.includes(b.dept) && !u.isAdmin) u.dept = b.dept;
      if (b.branch && USER_BRANCHES.includes(b.branch) && !u.isAdmin) {
        if (!allBranches(user) && b.branch !== user.branch) return fail(res, 403, 'تستطيع إضافة موظفين لفرعك فقط');
        u.branch = b.branch;
      }
      if (typeof b.active === 'boolean' && !u.isAdmin) u.active = b.active;
      if (b.password) {
        if (String(b.password).length < 6) return fail(res, 400, 'كلمة المرور 6 أحرف على الأقل');
        const { salt, hash } = hashPassword(b.password); u.salt = salt; u.passHash = hash;
      }
      saveDb(); return send(res, 200, { user: publicUser(u) });
    }
    if (m === 'DELETE') {
      if (u.isAdmin) return fail(res, 400, 'لا يمكن حذف مدير النظام');
      // keep history intact: deactivate instead of hard delete when referenced
      const used = db.projects.some(pr => pr.engineerId === u.id || pr.history.some(h => h.userId === u.id))
        || db.withdrawals.some(w => w.requesterId === u.id || w.history.some(h => h.userId === u.id));
      if (used) u.active = false; else db.users = db.users.filter(x => x !== u);
      for (const [k, s] of Object.entries(db.sessions)) if (s.userId === u.id) delete db.sessions[k];
      saveDb(); return send(res, 200, { ok: true, deactivated: used });
    }
  }

  // stock
  const isStore = user.isAdmin || user.dept === 'store';
  // balances are visible to Stores (and the system admin) only; others see the item list
  if (p === '/api/stock' && m === 'GET') {
    const mine = db.stock.filter(s => inBranch(user, s));
    if (isStore) return send(res, 200, { stock: mine });
    return send(res, 200, { stock: mine.filter(s => s.qty > 0).map(s => ({
      branch: s.branch, id: s.id, seq: s.seq, code: s.code, name: s.name, unit: s.unit, projectId: s.projectId, projectName: s.projectName, projectNumber: s.projectNumber, available: true })) });
  }
  if (p === '/api/stock' && m === 'POST') {
    if (!isStore) return fail(res, 403, 'غير مصرح لإدارتك بهذا الإجراء');
    const b = await readBody(req);
    const name = String(b.name || '').trim(), unit = String(b.unit || '').trim(), qty = Number(b.qty);
    if (!name || !unit || !(qty >= 0) || String(b.qty ?? '') === '') return fail(res, 400, 'اكتب اسم الصنف والوحدة والرصيد');
    if (badUnit(unit)) return fail(res, 400, 'الوحدة تُكتب كلمة مثل قطعة أو كرتونة، والكمية تُكتب في خانة الرصيد');
    let branch; try { branch = targetBranch(user, b.branch); } catch (e) { return fail(res, 400, e.message); }
    const s = newStock({ branch, name: name.slice(0, 200), unit: unit.slice(0, 30), qty: round3(qty) });
    move(s, user, 'open', s.qty); saveDb();
    return send(res, 200, { item: s });
  }
  mm = p.match(/^\/api\/stock\/(\w+)$/);
  if (mm && m === 'PATCH') {
    if (!isStore) return fail(res, 403, 'غير مصرح لإدارتك بهذا الإجراء');
    const s = db.stock.find(x => x.id === mm[1]); if (!s || !inBranch(user, s)) return fail(res, 404, 'الصنف غير موجود');
    const b = await readBody(req);
    const name = String(b.name ?? s.name).trim(), unit = String(b.unit ?? s.unit).trim();
    if (!name) return fail(res, 400, 'اكتب اسم الصنف والوحدة والرصيد');
    if (badUnit(unit)) return fail(res, 400, 'الوحدة تُكتب كلمة مثل قطعة أو كرتونة، والكمية تُكتب في خانة الرصيد');
    s.name = name.slice(0, 200); s.unit = unit.slice(0, 30); move(s, user, 'edit', 0, ''); saveDb();
    for (const w of db.withdrawals) for (const l of w.lines) if (l.stockId === s.id && !['done', 'rejected'].includes(w.stage)) { l.name = s.name; l.unit = s.unit; }
    saveDb(); return send(res, 200, { item: s });
  }
  mm = p.match(/^\/api\/stock\/(\w+)\/add$/);
  if (mm && m === 'POST') {
    if (!isStore) return fail(res, 403, 'غير مصرح لإدارتك بهذا الإجراء');
    const s = db.stock.find(x => x.id === mm[1]); if (!s || !inBranch(user, s)) return fail(res, 404, 'الصنف غير موجود');
    if (s.projectId) return fail(res, 400, 'أصناف المشروعات تدخل المخزن من دورة المشروع فقط');
    const b = await readBody(req); const qty = Number(b.qty);
    if (!(qty > 0)) return fail(res, 400, 'الكمية يجب أن تكون أكبر من صفر');
    s.qty = round3(s.qty + qty); move(s, user, 'add', qty, String(b.note || '').slice(0, 200)); saveDb();
    return send(res, 200, { item: s });
  }

  // withdrawals (طلبات الصرف)
  const wVisible = w => w.requesterId === user.id || (inBranch(user, w) && (user.isAdmin || user.dept === 'exec' || user.dept === 'store'));
  if (p === '/api/withdrawals' && m === 'GET') return send(res, 200, { withdrawals: db.withdrawals.filter(wVisible) });
  if (p === '/api/withdrawals' && m === 'POST') {
    const b = await readBody(req);
    if (!Array.isArray(b.lines) || !b.lines.length) return fail(res, 400, 'أضف صنفًا واحدًا على الأقل');
    let branch; try { branch = targetBranch(user, b.branch); } catch (e) { return fail(res, 400, e.message); }
    const lines = [];
    for (const l of b.lines) {
      const s = db.stock.find(x => x.id === l.stockId); const qty = Number(l.qty);
      if (!s || s.branch !== branch) return fail(res, 400, 'الصنف غير موجود');
      if (!(qty > 0)) return fail(res, 400, 'الكمية يجب أن تكون أكبر من صفر');
      if (qty > s.qty) return fail(res, 400, 'الكمية المطلوبة غير متاحة بالمخزن: ' + s.name);
      lines.push({ stockId: s.id, code: s.code, name: s.name, unit: s.unit, projectName: s.projectName, qty: round3(qty) });
    }
    db.wseq += 1;
    const w = { branch, id: uid('w_'), number: `SR-${new Date().getFullYear()}-${String(db.wseq).padStart(4, '0')}`, purpose: String(b.purpose || '').trim().slice(0, 500),
      lines, stage: 'exec', requesterId: user.id, requesterName: user.name, requesterDept: user.dept, notify: { req: false, exec: false },
      createdAt: now(), updatedAt: now(), history: [] };
    log(w, user, 'create'); db.withdrawals.unshift(w); saveDb();
    return send(res, 200, { withdrawal: w });
  }
  mm = p.match(/^\/api\/withdrawals\/(\w+)\/(action|seen)$/);
  if (mm && m === 'POST') {
    const w = db.withdrawals.find(x => x.id === mm[1]);
    if (!w || !wVisible(w)) return fail(res, 404, 'الطلب غير موجود');
    const b = await readBody(req);
    if (mm[2] === 'seen') {
      if (w.requesterId === user.id) w.notify.req = false;
      if (user.dept === 'exec' || user.isAdmin) w.notify.exec = false;
      saveDb(); return send(res, 200, { withdrawal: w });
    }
    const W = { approve: ['exec', 'approved', 'exec'], reject: ['exec', 'rejected', 'exec'], receive: ['approved', 'store_work', 'store'], done: ['store_work', 'done', 'store'] }[b.action];
    if (!W) return fail(res, 400, 'إجراء غير معروف');
    if (w.stage !== W[0]) return fail(res, 409, 'الطلب ليس في هذه المرحلة الآن — حدّث الصفحة');
    if (!inDept(user, W[2]) || !inBranch(user, w)) return fail(res, 403, 'غير مصرح لإدارتك بهذا الإجراء');
    const note = String(b.note || '').slice(0, 1000);
    if (b.action === 'approve' || b.action === 'reject') w.execDecision = { ok: b.action === 'approve', note, by: user.name, at: now() };
    if (b.action === 'reject') w.notify.req = true;
    if (b.action === 'receive') w.storeBy = { name: user.name, userId: user.id, at: now() };
    if (b.action === 'done') {
      const short = w.lines.filter(l => { const s = db.stock.find(x => x.id === l.stockId); return !s || s.qty < l.qty; });
      if (short.length) return fail(res, 400, 'الرصيد الحالي لا يكفي: ' + short.map(l => l.name).join('، '));
      for (const l of w.lines) { const s = db.stock.find(x => x.id === l.stockId); s.qty = round3(s.qty - l.qty); move(s, user, 'out', -l.qty, w.number); }
      w.doneAt = now(); w.notify = { req: true, exec: true };
    }
    w.stage = W[1]; log(w, user, b.action, note); saveDb();
    return send(res, 200, { withdrawal: w });
  }

  // projects
  if (p === '/api/projects' && m === 'GET') return send(res, 200, { projects: db.projects.filter(x => inBranch(user, x)) });
  if (p === '/api/projects' && m === 'POST') {
    if (!inDept(user, 'tech')) return fail(res, 403, 'إنشاء المشروعات من المكتب الفني فقط');
    const b = await readBody(req);
    const name = String(b.name || '').trim();
    if (!name) return fail(res, 400, 'اسم المشروع مطلوب');
    let branch; try { branch = targetBranch(user, b.branch); } catch (e) { return fail(res, 400, e.message); }
    const eng = db.users.find(x => x.id === b.engineerId);
    if (!engOk(eng, branch)) return fail(res, 400, 'اختر مهندس المشروع');
    let items; try { items = cleanItems(b.items); } catch (e) { return fail(res, 400, e.message); }
    db.seq += 1;
    const pr = {
      branch, id: uid('p_'), number: `PR-${new Date().getFullYear()}-${String(db.seq).padStart(4, '0')}`,
      name: name.slice(0, 200), notes: String(b.notes || '').slice(0, 2000),
      engineerId: eng.id, engineerName: eng.name, items, invoices: [], payment: null, chairNote: '',
      stage: 'draft', assign: {}, createdBy: user.name, createdAt: now(), updatedAt: now(), history: []
    };
    log(pr, user, 'create');
    if (b.send) { pr.stage = 'purch_new'; log(pr, user, 'send'); }
    db.projects.unshift(pr); saveDb();
    return send(res, 200, { project: pr });
  }

  mm = p.match(/^\/api\/projects\/(\w+)(\/.*)?$/);
  if (mm) {
    const pr = db.projects.find(x => x.id === mm[1]);
    if (!pr || !inBranch(user, pr)) return fail(res, 404, 'المشروع غير موجود');
    const sub = mm[2] || '';
    const b = m === 'GET' ? {} : await readBody(req);
    const need = (stage, dept) => {
      if (pr.stage !== stage) throw Object.assign(new Error('الطلب ليس في هذه المرحلة الآن — حدّث الصفحة'), { code: 409 });
      if (!inDept(user, dept)) throw Object.assign(new Error('غير مصرح لإدارتك بهذا الإجراء'), { code: 403 });
    };
    try {
      if (sub === '' && m === 'PUT') { // edit draft
        need('draft', 'tech');
        const name = String(b.name || '').trim(); if (!name) throw new Error('اسم المشروع مطلوب');
        const eng = db.users.find(x => x.id === b.engineerId);
        if (!engOk(eng, pr.branch)) throw new Error('اختر مهندس المشروع');
        pr.name = name; pr.engineerId = eng.id; pr.engineerName = eng.name; pr.notes = String(b.notes || '');
        pr.items = cleanItems(b.items); log(pr, user, 'edit');
        if (b.send) { pr.stage = 'purch_new'; log(pr, user, 'send'); }
      } else if (sub === '' && m === 'DELETE') {
        need('draft', 'tech');
        db.projects = db.projects.filter(x => x !== pr); saveDb();
        return send(res, 200, { ok: true });
      } else if (sub === '/action' && m === 'POST') {
        const t = TRANS[b.action];
        if (!t) throw new Error('إجراء غير معروف');
        need(t.from, t.dept);
        if (b.action === 'eng_receive' && !user.isAdmin && pr.engineerId !== user.id)
          throw Object.assign(new Error('الاستلام للمهندس المسؤول عن المشروع فقط'), { code: 403 });
        if (t.check) { const r = t.check(pr); if (r !== true) throw new Error(r); }
        if (t.assign) pr.assign[t.assign] = { name: user.name, userId: user.id, at: now() };
        if (b.action === 'acc_done') {
          const amount = Number(b.amount);
          if (!(amount > 0)) throw new Error('أدخل المبلغ المصروف');
          pr.payment = { amount, note: String(b.note || '').slice(0, 1000), by: user.name, at: now() };
        }
        if (b.action === 'reject' || b.action === 'approve') pr.chairNote = String(b.note || '').slice(0, 1000);
        if (b.action === 'store_done') { pr.storeInAt = now(); stockInProject(pr, true, user); }
        if (b.action === 'ship') { pr.shippedAt = now(); shipProject(pr, user); }
        if (b.action === 'eng_receive') pr.closedAt = now();
        if (b.action === 'reopen') { pr.items.forEach(i => { i.quotes = []; i.selected = null; i.checked = false; }); pr.assign = {}; pr.chairNote = ''; }
        pr.stage = t.to;
        log(pr, user, b.action, b.note);
      } else if ((mm = sub.match(/^\/items\/(\w+)\/quotes$/)) && m === 'POST') {
        need('purch_quote', 'purch');
        const it = pr.items.find(i => i.id === mm[1]); if (!it) throw new Error('البند غير موجود');
        const supplier = String(b.supplier || '').trim(); const price = Number(b.price);
        if (!supplier) throw new Error('اسم المورد مطلوب');
        if (!(price > 0)) throw new Error('سعر الوحدة غير صحيح');
        const file = b.file ? saveUpload(b.file) : null;
        it.quotes.push({ id: uid('q_'), supplier: supplier.slice(0, 120), price, file, by: user.name, at: now() });
        pr.updatedAt = now();
      } else if ((mm = sub.match(/^\/items\/(\w+)\/quotes\/(\w+)$/)) && m === 'DELETE') {
        need('purch_quote', 'purch');
        const it = pr.items.find(i => i.id === mm[1]); if (!it) throw new Error('البند غير موجود');
        it.quotes = it.quotes.filter(q => q.id !== mm[2]); pr.updatedAt = now();
      } else if ((mm = sub.match(/^\/items\/(\w+)\/select$/)) && m === 'POST') {
        need('exec_review', 'exec');
        const it = pr.items.find(i => i.id === mm[1]); if (!it) throw new Error('البند غير موجود');
        if (!it.quotes.some(q => q.id === b.quoteId)) throw new Error('السعر غير موجود');
        it.selected = b.quoteId; pr.updatedAt = now();
      } else if ((mm = sub.match(/^\/items\/(\w+)\/check$/)) && m === 'POST') {
        need('store_inspect', 'store');
        const it = pr.items.find(i => i.id === mm[1]); if (!it) throw new Error('البند غير موجود');
        it.checked = !!b.checked; it.checkNote = String(b.note || '').slice(0, 300); pr.updatedAt = now();
      } else if (sub === '/invoices' && m === 'POST') {
        need('purch_buying', 'purch');
        const f = saveUpload(b.file); f.at = now(); f.by = user.name; pr.invoices.push(f); pr.updatedAt = now();
      } else if ((mm = sub.match(/^\/invoices\/(\w+)$/)) && m === 'DELETE') {
        need('purch_buying', 'purch');
        pr.invoices = pr.invoices.filter(f => f.id !== mm[1]); pr.updatedAt = now();
      } else {
        return fail(res, 404, 'غير موجود');
      }
    } catch (e) {
      return fail(res, e.code || 400, e.message);
    }
    pr.total = total(pr);
    saveDb();
    return send(res, 200, { project: pr });
  }
  return fail(res, 404, 'غير موجود');
}

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.pdf': 'application/pdf', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

function serveFile(res, file) {
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    fs.createReadStream(file).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  try {
    if (url.pathname.startsWith('/api/')) return await api(req, res, url);
    if (url.pathname.startsWith('/uploads/')) {
      if (!currentUser(req)) { res.writeHead(401); return res.end('Login required'); }
      const name = path.basename(url.pathname);
      return serveFile(res, path.join(UPLOAD_DIR, name));
    }
    let rel = decodeURIComponent(url.pathname);
    if (rel === '/' || !path.extname(rel)) rel = '/index.html';
    const file = path.normalize(path.join(PUBLIC_DIR, rel));
    if (!file.startsWith(PUBLIC_DIR)) { res.writeHead(403); return res.end(); }
    serveFile(res, file);
  } catch (e) {
    const msg = e.message === 'too_large' ? 'حجم الطلب كبير جدًا' : e.message === 'bad_json' ? 'بيانات غير صالحة' : 'خطأ في الخادم';
    if (!res.headersSent) fail(res, 400, msg);
    if (!['too_large', 'bad_json'].includes(e.message)) console.error(e);
  }
});

server.listen(PORT, () => {
  const nets = require('os').networkInterfaces();
  console.log(`\n  Omega Res يعمل الآن:  http://localhost:${PORT}`);
  for (const list of Object.values(nets)) for (const n of list || [])
    if (n.family === 'IPv4' && !n.internal) console.log(`  من أجهزة الشبكة:    http://${n.address}:${PORT}`);
  console.log('');
});
