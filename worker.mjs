// Omega Res — نسخة Cloudflare
// الصفحات (public/) تُخدم من Cloudflare مباشرة، وكل طلبات /api و /uploads تذهب إلى
// Durable Object واحد يحفظ قاعدة البيانات والمرفقات في تخزينه (يعمل على الخطة المجانية).
import { createCore, newDatabase } from './core.mjs';

const CHUNK = 1024 * 1024; // 1MB لكل جزء (الحد الأقصى للقيمة الواحدة 2MB)

export class OmegaStore {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.core = null;
    this.state.blockConcurrencyWhile(async () => { await this.load(); });
  }

  async load() {
    const st = this.state.storage;
    const meta = await st.get('db:meta');
    let db;
    if (meta && meta.n) {
      const keys = Array.from({ length: meta.n }, (_, i) => 'db:' + i);
      const parts = await st.get(keys);
      db = JSON.parse(keys.map(k => parts.get(k)).join(''));
    } else {
      db = newDatabase();
    }
    let lastN = meta ? meta.n : 0;
    const storage = {
      db,
      save: d => {
        const text = JSON.stringify(d);
        const entries = { };
        const n = Math.max(1, Math.ceil(text.length / (CHUNK / 2))); // نصف ميجا حرف = أقل من 2MB حتى مع العربي
        for (let i = 0; i < n; i++) entries['db:' + i] = text.slice(i * (CHUNK / 2), (i + 1) * (CHUNK / 2));
        entries['db:meta'] = { n, at: Date.now() };
        // put بدون await مقبول: Cloudflare لا يرسل الرد إلا بعد تأكيد الكتابة
        writeBatches(st, entries);
        if (lastN > n) st.delete(Array.from({ length: lastN - n }, (_, i) => 'db:' + (n + i)));
        lastN = n;
      },
      putFile: async (name, bytes, type) => {
        const n = Math.max(1, Math.ceil(bytes.byteLength / CHUNK));
        const entries = { };
        for (let i = 0; i < n; i++) entries[`file:${name}:${i}`] = bytes.slice(i * CHUNK, (i + 1) * CHUNK);
        entries[`file:${name}:meta`] = { n, type, size: bytes.byteLength };
        await writeBatches(st, entries);
      },
      getFile: async name => {
        const m = await st.get(`file:${name}:meta`);
        if (!m) return null;
        const keys = Array.from({ length: m.n }, (_, i) => `file:${name}:${i}`);
        const parts = await st.get(keys);
        const out = new Uint8Array(m.size);
        let off = 0;
        for (const k of keys) { const p = new Uint8Array(parts.get(k)); out.set(p, off); off += p.byteLength; }
        return { bytes: out, type: m.type };
      }
    };
    this.core = createCore(storage);
  }

  async fetch(request) {
    const url = new URL(request.url);
    const headers = {};
    for (const [k, v] of request.headers) headers[k.toLowerCase()] = v;
    let body = '';
    if (request.method !== 'GET' && request.method !== 'HEAD') body = await request.text();
    const out = await this.core.handle({
      method: request.method, path: url.pathname + url.search, headers,
      ip: headers['cf-connecting-ip'] || '', https: url.protocol === 'https:', body
    });
    return new Response(out.body, { status: out.status, headers: { ...this.core.SECURITY_HEADERS, ...out.headers } });
  }
}

function writeBatches(st, entries) {
  const keys = Object.keys(entries);
  const jobs = [];
  for (let i = 0; i < keys.length; i += 100) {
    const batch = {};
    for (const k of keys.slice(i, i + 100)) batch[k] = entries[k];
    jobs.push(st.put(batch));
  }
  return Promise.all(jobs);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/uploads/')) {
      const stub = env.OMEGA.get(env.OMEGA.idFromName('omega-main'));
      return stub.fetch(request);
    }
    return env.ASSETS.fetch(request);
  }
};

