'use strict';
/* Omega Res — المخزن العام، الباركود، طلبات الصرف */

// ---------------- Code 128 (B) barcode, no internet needed ----------------
const C128 = ['212222','222122','222221','121223','121322','131222','122213','122312','132212','221213','221312','231212','112232','122132','122231','113222','123122','123221','223211','221132','221231','213212','223112','312131','311222','321122','321221','312212','322112','322211','212123','212321','232121','111323','131123','131321','112313','132113','132311','211313','231113','231311','112133','112331','132131','113123','113321','133121','313121','211331','231131','213113','213311','213131','311123','311321','331121','312113','312311','332111','314111','221411','431111','111224','111422','121124','121421','141122','141221','112214','112412','122114','122411','142112','142211','241211','221114','413111','241112','134111','111242','121142','121241','114212','124112','124211','411212','421112','421211','212141','214121','412121','111143','111341','131141','114113','114311','411113','411311','113141','114131','311141','411131','211412','211214','211232','2331112'];
function barcodeSvg(text, { h = 48, x = 1.6, label = false } = {}) {
  const vals = [104];
  for (const ch of String(text)) { const v = ch.charCodeAt(0) - 32; if (v < 0 || v > 94) continue; vals.push(v); }
  let sum = vals[0]; for (let i = 1; i < vals.length; i++) sum += vals[i] * i;
  vals.push(sum % 103, 106);
  const quiet = 10 * x; let pos = quiet, rects = '';
  for (const v of vals) {
    const p = C128[v];
    for (let i = 0; i < p.length; i++) { const w = +p[i] * x; if (i % 2 === 0) rects += `<rect x="${pos.toFixed(2)}" y="0" width="${w.toFixed(2)}" height="${h}"/>`; pos += w; }
  }
  const W = pos + quiet, H = h + (label ? 18 : 0);
  const txt = label ? `<text x="${W / 2}" y="${h + 15}" text-anchor="middle" font-family="Consolas,monospace" font-size="14" fill="#000">${esc(text)}</text>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.toFixed(2)} ${H}" width="${W.toFixed(0)}" height="${H}"><rect width="100%" height="100%" fill="#fff"/><g fill="#000">${rects}</g>${txt}</svg>`;
}

// ---------------- helpers ----------------
const isStore = () => S.user.isAdmin || S.user.dept === 'store';
const isExec = () => S.user.isAdmin || S.user.dept === 'exec';
const vd = () => viewDept();
function wMine(w) { return w.requesterId === S.user.id || (S.user.isAdmin && w.requesterDept === vd()); }
function wCanAct(w) {
  const d = vd();
  if (w.stage === 'exec') return d === 'exec' && isExec();
  if (w.stage === 'approved' || w.stage === 'store_work') return d === 'store' && isStore();
  return false;
}
function wNotified(w) { return (w.notify?.req && wMine(w)) || (w.notify?.exec && vd() === 'exec' && isExec()); }
function wdBadge() { return S.withdrawals.filter(w => wCanAct(w) || wNotified(w)).length; }
function wPill(w) {
  if (w.stage === 'done') return ['ok', t('ws_done')];
  if (w.stage === 'rejected') return ['bad', t('ws_rejected')];
  if (wCanAct(w)) return ['mine', t('yourTurn')];
  return ['wait', t('ws_' + w.stage)];
}
const stockById = id => S.stock.find(s => s.id === id);
const seeBal = () => isStore();
const badUnit = u => !u || /^[\s\d٠-٩.,٫،/-]+$/.test(String(u));
const UNITS_AR = ['قطعة', 'عدد', 'كرتونة', 'علبة', 'شكارة', 'طن', 'كجم', 'جرام', 'متر', 'م²', 'م³', 'لتر', 'جالون', 'لفة', 'بكرة', 'زوج', 'دستة', 'رزمة', 'باكو', 'وحدة'];
const UNITS_EN = ['piece', 'box', 'carton', 'bag', 'ton', 'kg', 'g', 'm', 'm²', 'm³', 'liter', 'gallon', 'roll', 'pair', 'dozen', 'ream', 'pack', 'unit'];
const unitList = () => `<datalist id="units">${(lang === 'ar' ? UNITS_AR : UNITS_EN).map(u => `<option value="${u}">`).join('')}</datalist>`;
const hasStock = s => s.available || s.qty > 0;

// ---------------- general stock ----------------
function visibleStock() {
  const q = S.skQ.trim().toLowerCase();
  return S.stock.slice()
    .sort((a, b) => (a.projectId ? 1 : 0) - (b.projectId ? 1 : 0) || a.seq - b.seq)
    .filter(s => (seeBal() && S.showZero) || hasStock(s))
    .filter(s => !q || (s.name + ' ' + s.code + ' ' + (s.projectName || '')).toLowerCase().includes(q));
}
function generalStockView() {
  const all = S.stock, rows = visibleStock(), st = isStore();
  S._vis = rows.map(s => s.id);
  const allSel = rows.length && rows.every(s => S.lblSel.includes(s.id));
  const table = rows.length ? `<div class="panel tbl-wrap"><table class="stock-tbl"><thead><tr>
      ${st ? `<th><input type="checkbox" data-act="lblall" ${allSel ? 'checked' : ''} aria-label="${t('lb_print')}"></th>` : ''}
      <th>${t('sk_barcode')}</th><th>${t('item')}</th><th>${t('projectName')}</th>${st ? `<th>${t('sk_balance')}</th><th>${t('sk_add')}</th>` : `<th>${t('unit')}</th>`}</tr></thead>
    <tbody>${rows.map(s => `<tr>
      ${st ? `<td><input type="checkbox" data-act="lbl" data-id="${s.id}" ${S.lblSel.includes(s.id) ? 'checked' : ''} aria-label="${esc(s.code)}"></td>` : ''}
      <td><button class="bc" data-act="bcbig" data-code="${esc(s.code)}" aria-label="${esc(s.code)}">${barcodeSvg(s.code, { h: 34, x: 1.15 })}</button><div class="mono bc-code">${esc(s.code)}</div></td>
      <td>${S.skEdit === s.id ? `<div class="edit-row">
          <input type="text" id="se-n" data-bind="se.name" value="${esc(S.se.name)}" aria-label="${t('sk_name')}">
          <input type="text" id="se-u" data-bind="se.unit" list="units" value="${esc(S.se.unit)}" placeholder="${t('sk_unitPh')}" aria-label="${t('unit')}">
          <button class="btn sm primary" data-act="sesave" data-id="${s.id}">${t('save')}</button><button class="btn sm ghost" data-act="secancel">${t('cancel')}</button></div>`
        : `<b>${esc(s.name)}</b>${st && badUnit(s.unit) ? `<span class="unit-bad">${t('sk_unitBad')}</span>` : ''}${st && !s.projectId ? ` <button class="btn sm ghost" data-act="seopen" data-id="${s.id}">${t('sk_edit')}</button>` : ''}`}</td>
      <td>${brChip(s)}${s.projectId ? `<span class="ptag">${esc(s.projectName)}</span>` : `<span class="ptag gen">${t('sk_gen')}</span>`}</td>
      ${st ? `<td class="num ${s.qty <= 0 ? 'q0' : s.qty < 10 ? 'qlow' : ''}" style="white-space:nowrap">${fmtN(s.qty)} ${esc(s.unit)}</td>` : `<td>${esc(s.unit)}</td>`}
      ${st ? `<td>${s.projectId ? '' : `<div class="addq"><input type="number" min="0" step="any" id="aq-${s.id}" data-bind="aq.${s.id}" value="${esc(S.aq[s.id] || '')}"><button class="btn sm" data-act="addqty" data-id="${s.id}" aria-label="${t('sk_add')}">+</button></div>`}</td>` : ''}
    </tr>`).join('')}</tbody></table></div>`
    : `<div class="empty">${all.length ? t('sk_none') : `<b>${t('sk_genEmpty')}</b>${t('sk_genEmptySub')}`}</div>`;
  const pf = S.pf;
  if (!pf.branch) pf.branch = defBranch();
  const form = st ? `<form class="panel box" data-form="prod" style="margin-top:18px"><h3>${t('sk_addProd')}</h3>
      <div class="form-grid">
        ${allBr() ? `<label class="field"><span>${t('branch')}</span><select id="pf-b" data-bind="pf.branch">${BRANCHES.map(b => `<option value="${b}" ${b === pf.branch ? 'selected' : ''}>${bn(b)}</option>`).join('')}</select></label>` : ''}
        <label class="field"><span>${t('sk_name')}</span><input type="text" id="pf-n" data-bind="pf.name" value="${esc(pf.name)}" required></label>
        <label class="field"><span>${t('unit')}</span><input type="text" id="pf-u" data-bind="pf.unit" list="units" placeholder="${t('sk_unitPh')}" value="${esc(pf.unit)}" required></label>
        <label class="field"><span>${t('sk_open')}</span><input type="number" id="pf-q" min="0" step="any" data-bind="pf.qty" value="${esc(pf.qty)}" required></label>
      </div><p class="hint-line" style="margin:0">${t('sk_unitHint')}</p><div><button class="btn primary" type="submit">${t('sk_addProd')}</button></div></form>` : '';
  return `<div class="page-head"><div><h1>${t('sk_general')}</h1><p>${st ? t('sk_generalSub') : t('sk_generalSubNo')}</p></div></div>
    ${st ? `<div class="stat-row" style="margin-bottom:16px">
      <div class="stat"><span>${t('sk_items')}</span><b>${fmtN(all.filter(s => s.qty > 0).length)}</b></div>
      <div class="stat"><span>${t('sk_projItems')}</span><b>${fmtN(all.filter(s => s.qty > 0 && s.projectId).length)}</b></div>
      <div class="stat"><span>${t('sk_low')}</span><b>${fmtN(all.filter(s => s.qty > 0 && s.qty < 10).length)}</b></div>
      <div class="stat"><span>${t('sk_zero')}</span><b>${fmtN(all.filter(s => !(s.qty > 0)).length)}</b></div>
    </div>` : ''}
    <div class="stock-tools">
      <input type="search" id="skq" data-bind="skQ" data-live="1" placeholder="${t('sk_search')}" value="${esc(S.skQ)}" autocomplete="off">
      ${st ? `<label class="check"><input type="checkbox" data-act="zero" ${S.showZero ? 'checked' : ''}>${t('sk_showZero')}</label>` : ''}
      ${st && rows.length ? `<button class="btn sm" data-act="labels">🏷 ${t('lb_print')}${S.lblSel.length ? ` (${fmtN(S.lblSel.length)} ${t('lb_sel')})` : ''}</button>` : ''}
    </div>
    <p class="hint-line">${t('sk_scan')}${st ? ' ' + t('lb_hint') : ''}</p>
    ${table}${form}${unitList()}`;
}
function printLabels() {
  if (!isStore()) return;
  const ids = S.lblSel.length ? S.lblSel : (S._vis || []);
  const items = ids.map(stockById).filter(Boolean);
  if (!items.length) return;
  const ar = lang === 'ar';
  const cards = items.map(s => `<div class="lb"><div class="nm">${esc(s.name)}</div><div class="pj">${s.projectId ? esc(s.projectName) : (ar ? 'مخزن عام' : 'General stock')} · ${esc(s.unit)}</div>${barcodeSvg(s.code, { h: 46, x: 1.5, label: true })}</div>`).join('');
  const html = `<!doctype html><html lang="${lang}" dir="${ar ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><title>${t('lb_title')}</title><style>
    @page{size:A4;margin:10mm}*{box-sizing:border-box}body{margin:0;font-family:Tahoma,Arial,sans-serif;color:#000;background:#fff}
    .hd{font-size:12px;color:#555;margin:8px 0}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm}
    .lb{border:1px dashed #999;border-radius:2mm;padding:2.5mm 3mm;height:38mm;display:flex;flex-direction:column;align-items:center;justify-content:space-between;break-inside:avoid;overflow:hidden}
    .nm{font-weight:bold;font-size:13px;text-align:center;max-height:2.7em;overflow:hidden}.pj{font-size:10.5px;color:#333;text-align:center}
    svg{max-width:100%;height:auto}@media print{.hd{display:none}}</style></head>
    <body><p class="hd">Omega Res — ${t('lb_title')} · ${fmtD(new Date().toISOString())} · ${fmtN(items.length)}</p><div class="grid">${cards}</div>
    <script>window.onload=function(){setTimeout(function(){window.print()},300)}<\/script></body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  const w = window.open(url, '_blank');
  if (!w) toast(t('lb_popup'), true);
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

// ---------------- withdrawals ----------------
function wdView() {
  const F = { act: w => wCanAct(w) || wNotified(w) || w.id === S.wdSel, mine: wMine, active: w => !['done', 'rejected'].includes(w.stage), all: () => true };
  const list = S.withdrawals.slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).filter(F[S.wdFilter]);
  if (S.wdSel && !S.withdrawals.some(w => w.id === S.wdSel)) S.wdSel = null;
  if (!S.wdSel && list.length && window.innerWidth > 900) S.wdSel = list[0].id;
  const sel = S.withdrawals.find(w => w.id === S.wdSel);
  const filters = `<div class="filters">${['act', 'mine', 'active', 'all'].map(k => `<button class="chip ${S.wdFilter === k ? 'on' : ''}" data-act="wfilter" data-v="${k}">${t('wf_' + k)}</button>`).join('')}</div>`;
  const cards = list.map(w => {
    const [c, s] = wPill(w);
    return `<button class="pcard ${S.wdSel === w.id ? 'on' : ''}" data-act="wsel" data-id="${w.id}">
      <div class="row"><span class="eyebrow">${esc(w.number)}</span><span class="pill ${c}">${esc(s)}</span></div>
      <div class="pname">${esc(w.purpose || w.lines.map(l => l.name).join('، '))}${wNotified(w) ? `<span class="newdot" title="${t('wd_newBadge')}"></span>` : ''}</div>
      <div class="meta">${brChip(w)}${esc(w.requesterName)} · ${dn(w.requesterDept)} · ${fmtDay(w.createdAt)}</div></button>`;
  }).join('');
  return `<div class="page-head"><div><h1>${t('wd_title')}</h1><p>${t('wd_sub')}</p></div>
      ${S.wdNew ? '' : `<button class="btn primary" data-act="wnew">+ ${t('wd_new')}</button>`}</div>
    ${S.wdNew ? wdForm() : ''}
    <div class="split"><div class="list">${filters}${cards || `<div class="empty"><b>${t('wd_empty')}</b>${t('wd_emptySub')}</div>`}</div>
      <div>${sel ? wdDetail(sel) : (list.length ? `<div class="empty">${t('wd_pickOne')}</div>` : '')}</div></div>`;
}
function wdForm() {
  const d = S.wdNew;
  if (!d.branch) d.branch = defBranch();
  const avail = S.stock.filter(s => hasStock(s) && s.branch === d.branch).sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  return `<form class="panel box" data-form="wd" style="margin-bottom:18px"><h3>${t('wd_new')}</h3>
    ${allBr() ? `<label class="field"><span>${t('branch')}</span><select id="wd-b" data-bind="wdNew.branch" data-wbr="1">${BRANCHES.map(b => `<option value="${b}" ${b === d.branch ? 'selected' : ''}>${bn(b)}</option>`).join('')}</select></label>` : ''}
    <label class="field"><span>${t('wd_purpose')}</span><input type="text" id="wd-p" data-bind="wdNew.purpose" value="${esc(d.purpose)}"></label>
    <div class="wlines">${d.lines.map((l, i) => { const s = stockById(l.stockId); return `<div class="wline">
      <select id="wl-s-${i}" data-bind="wdNew.lines.${i}.stockId" data-wline="1"><option value="">${t('wd_pick')}</option>${avail.map(s => `<option value="${s.id}" ${s.id === l.stockId ? 'selected' : ''}>${esc(s.name)}${s.projectId ? ' — ' + esc(s.projectName) : ''} · ${esc(s.code)}${seeBal() ? ` · ${t('wd_avail')} ${fmtN(s.qty)}` : ''} · ${esc(s.unit)}</option>`).join('')}</select>
      <input type="number" id="wl-q-${i}" min="0" step="any" data-bind="wdNew.lines.${i}.qty" placeholder="${t('qty')}${s && seeBal() ? ' / ' + fmtN(s.qty) : s ? ' (' + esc(s.unit) + ')' : ''}" value="${esc(l.qty)}">
      <button type="button" class="btn sm ghost danger" data-act="wrm" data-i="${i}" ${d.lines.length < 2 ? 'disabled' : ''} aria-label="${t('remove')}">✕</button></div>`; }).join('')}
      <div><button type="button" class="btn sm" data-act="wadd">+ ${t('wd_addLine')}</button></div></div>
    <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn primary" type="submit" ${S.busy ? 'disabled' : ''}>${t('wd_send')}</button>
      <button type="button" class="btn ghost" data-act="wcancel">${t('cancel')}</button></div></form>`;
}
function wdDetail(w) {
  const [c, s] = wPill(w), act = wCanAct(w);
  const ph = { exec: 1, approved: 2, store_work: 2, done: 4, rejected: 1 }[w.stage];
  const steps = [t('wp_req'), dn('exec'), dn('store'), t('wp_done')];
  const who = [w.requesterName, w.execDecision?.by, w.storeBy?.name, ''];
  const track = `<div class="track wtrack ${w.stage === 'done' ? 'closed' : ''}">${steps.map((lbl, i) => {
    let cls = i < ph ? 'done' : i === ph ? 'cur' : '';
    if (w.stage === 'rejected' && i === 1) cls = 'bad';
    return `<div class="step ${cls}"><span class="dot">${cls === 'done' ? '✓' : cls === 'bad' ? '✕' : fmtN(i + 1)}</span><div>${esc(lbl)}${who[i] && (cls || i < ph) ? `<div class="who-s">${esc(who[i])}</div>` : ''}</div></div>`;
  }).join('')}</div>`;
  let panel = '';
  if (act) {
    const btn = (a, cls = 'btn primary') => `<button class="${cls}" data-act="wdo" data-a="${a}" data-id="${w.id}" ${S.busy ? 'disabled' : ''}>${t('wa_' + a)}</button>`;
    const note = w.stage === 'exec' ? `<label class="field" style="flex:1 1 260px"><span>${t('note')}</span><textarea id="wad-note" data-bind="wad.note">${esc(S.wad.note || '')}</textarea></label>` : '';
    const btns = w.stage === 'exec' ? btn('approve') + btn('reject', 'btn danger solid') : w.stage === 'approved' ? btn('receive') : btn('done');
    panel = `<section class="actions"><p class="hint">${t('wg_' + w.stage)}</p><div class="row">${note}${btns}</div></section>`;
  }
  let line;
  if (w.stage === 'done') line = `<div class="waiting-line ok">${t('wd_doneMsg')} · ${esc(w.storeBy?.name || '')} · ${fmtD(w.doneAt)}</div>`;
  else if (w.stage === 'rejected') line = `<div class="waiting-line bad">${t('wd_rejMsg')}${w.execDecision?.note ? ' — ' + esc(w.execDecision.note) : ''}</div>`;
  else if (act) line = `<div class="waiting-line mine">${t('yourTurn')} — ${t('ws_' + w.stage)}</div>`;
  else if (w.stage === 'exec' && vd() === 'store') line = `<div class="waiting-line">${t('wd_info')}</div>`;
  else line = `<div class="waiting-line">${t('waitingAt', { d: dn(w.stage === 'exec' ? 'exec' : 'store') })} · ${t('ws_' + w.stage)}</div>`;
  const rows = w.lines.map(l => { const st = seeBal() ? stockById(l.stockId) : null; const short = st && st.qty < l.qty && !['done', 'rejected'].includes(w.stage);
    return `<tr><td><b>${esc(l.name)}</b><div class="spec mono">${esc(l.code)}</div></td><td>${l.projectName ? `<span class="ptag">${esc(l.projectName)}</span>` : `<span class="ptag gen">${t('sk_gen')}</span>`}</td>
      <td class="num">${fmtN(l.qty)} ${esc(l.unit)}</td>${seeBal() ? `<td class="num ${short ? 'qlow' : ''}">${st ? fmtN(st.qty) + ' ' + esc(st.unit) : '—'}</td>` : ''}</tr>`; }).join('');
  return `<article class="panel detail">
    <section><div class="dhead"><div style="min-width:0"><div class="eyebrow">${esc(w.number)} · ${fmtD(w.createdAt)}</div><h2>${esc(w.purpose || t('wd_title'))}</h2></div><span class="pill ${c}">${esc(s)}</span></div>
      <div class="facts"><div><span>${t('branch')}</span>${bn(w.branch)}</div><div><span>${t('wd_req')}</span>${esc(w.requesterName)}</div><div><span>${t('dept')}</span>${dn(w.requesterDept)}</div><div><span>${t('itemsCount')}</span>${fmtN(w.lines.length)}</div></div></section>
    <section>${track}${line}</section>
    ${panel}
    <section><div class="sec-title"><h3>${t('items')}</h3></div><div class="tbl-wrap"><table><thead><tr><th>${t('item')}</th><th>${t('projectName')}</th><th>${t('qty')}</th>${seeBal() ? `<th>${t('wd_now')}</th>` : ''}</tr></thead><tbody>${rows}</tbody></table></div></section>
    <section><div class="sec-title"><h3>${t('history')}</h3></div><ol class="history">${[...w.history].reverse().map(h =>
      `<li><time>${fmtD(h.at)}</time><div><b>${esc(t('wh_' + h.action))}</b> — ${esc(h.by)} <span class="note">(${esc(dn(h.dept))})</span>${h.note ? `<div class="note">${esc(h.note)}</div>` : ''}</div></li>`).join('')}</ol></section>
  </article>`;
}
function upsertW(w) { const i = S.withdrawals.findIndex(x => x.id === w.id); if (i >= 0) S.withdrawals[i] = w; else S.withdrawals.unshift(w); }
function upsertS(s) { const i = S.stock.findIndex(x => x.id === s.id); if (i >= 0) S.stock[i] = s; else S.stock.push(s); }

// ---------------- events ----------------
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  switch (el.dataset.act) {
    case 'skv': S.skView = el.dataset.v; return render();
    case 'zero': S.showZero = el.checked; return render();
    case 'lbl': { const id = el.dataset.id; S.lblSel = el.checked ? [...S.lblSel, id] : S.lblSel.filter(x => x !== id); return render(); }
    case 'lblall': S.lblSel = el.checked ? (S._vis || []).slice() : []; return render();
    case 'labels': return printLabels();
    case 'bcbig': { const lb = $('#lightbox'); lb.querySelector('img').src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(barcodeSvg(el.dataset.code, { h: 120, x: 3, label: true })); lb.hidden = false; return; }
    case 'seopen': { const s = stockById(el.dataset.id); S.skEdit = s.id; S.se = { name: s.name, unit: badUnit(s.unit) ? '' : s.unit }; render(); document.getElementById('se-u')?.focus(); return; }
    case 'secancel': S.skEdit = null; return render();
    case 'sesave': { const id = el.dataset.id;
      if (badUnit(S.se.unit)) return toast(t('sk_unitHint'), true);
      return run(async () => { const r = await api('PATCH', '/api/stock/' + id, { name: S.se.name, unit: S.se.unit }); upsertS(r.item); S.skEdit = null; toast(t('saved')); }); }
    case 'addqty': { const id = el.dataset.id, q = Number(S.aq[id]); if (!(q > 0)) return toast(t('err_price'), true);
      return run(async () => { const r = await api('POST', `/api/stock/${id}/add`, { qty: q }); upsertS(r.item); S.aq[id] = ''; toast(t('saved')); }); }
    case 'wnew': S.wdNew = { purpose: '', lines: [{ stockId: '', qty: '' }] }; return render();
    case 'wcancel': S.wdNew = null; return render();
    case 'wadd': S.wdNew.lines.push({ stockId: '', qty: '' }); return render();
    case 'wrm': S.wdNew.lines.splice(+el.dataset.i, 1); return render();
    case 'wfilter': S.wdFilter = el.dataset.v; return render();
    case 'wsel': {
      S.wdSel = el.dataset.id; S.wad = {}; render();
      const w = S.withdrawals.find(x => x.id === S.wdSel);
      if (w && wNotified(w)) api('POST', `/api/withdrawals/${w.id}/seen`).then(r => { upsertW(r.withdrawal); render(); }).catch(() => {});
      if (window.innerWidth <= 900) document.querySelector('.detail')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    case 'wdo': { const id = el.dataset.id, action = el.dataset.a;
      return run(async () => {
        const r = await api('POST', `/api/withdrawals/${id}/action`, { action, note: S.wad.note || '' }); upsertW(r.withdrawal); S.wad = {};
        if (action === 'done') { const { stock } = await api('GET', '/api/stock'); S.stock = stock; }
        toast(t('wh_' + action));
      }); }
  }
});
document.addEventListener('change', e => {
  if (e.target.dataset.wbr) S.wdNew.lines = [{ stockId: '', qty: '' }];
  if (e.target.dataset.wline || e.target.dataset.wbr) render();
});
document.addEventListener('submit', e => {
  const form = e.target.dataset.form;
  if (form === 'prod') { e.preventDefault();
    if (badUnit(S.pf.unit)) return toast(t('sk_unitHint'), true);
    run(async () => { const r = await api('POST', '/api/stock', { branch: S.pf.branch, name: S.pf.name, unit: S.pf.unit, qty: Number(S.pf.qty) }); upsertS(r.item); S.pf = { branch: S.pf.branch }; toast(t('saved')); }); }
  if (form === 'wd') { e.preventDefault();
    const d = S.wdNew, lines = [];
    for (const l of d.lines) { const s = stockById(l.stockId), q = Number(l.qty); if (!s || !(q > 0) || (seeBal() && q > s.qty)) return toast(t('err_wd'), true); lines.push({ stockId: s.id, qty: q }); }
    run(async () => { const r = await api('POST', '/api/withdrawals', { branch: d.branch, purpose: d.purpose, lines }); upsertW(r.withdrawal); S.wdNew = null; S.wdFilter = 'mine'; S.wdSel = r.withdrawal.id; toast(t('wh_create')); }); }
});
