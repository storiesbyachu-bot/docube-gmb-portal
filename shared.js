// ══ CONFIG ══
const SB_URL = 'https://sptapddgvamgeqlykvdu.supabase.co';
const SB_KEY = 'sb_publishable_1AtpPE78KZ-H3WxO5_QdcA_hWIQLpDz';

async function sbQ(method, table, params = '', body = null) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SB_KEY,
      'Authorization': `Bearer ${SB_KEY}`,
      'Accept': 'application/json'
    }
  };
  if (method === 'POST') opts.headers['Prefer'] = 'return=representation';
  if (method === 'PATCH') opts.headers['Prefer'] = 'return=representation';
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(`${SB_URL}/rest/v1/${table}?${params}`, opts);
  if (!r.ok) {
    const e = await r.text();
    // Try to parse Supabase error for cleaner message
    try {
      const parsed = JSON.parse(e);
      throw new Error(JSON.stringify(parsed));
    } catch(_) {
      throw new Error(e);
    }
  }
  const txt = await r.text();
  return txt ? JSON.parse(txt) : [];
}
const sbGet  = (t, p) => sbQ('GET',    t, p);
const sbPost = (t, b) => sbQ('POST',   t, '', b);
const sbPatch = (t, p, b) => sbQ('PATCH', t, p, b);
const sbDel  = (t, p) => sbQ('DELETE', t, p);

function toast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.className = `toast show ${type}`;
  document.getElementById('toastMsg').textContent = msg;
  setTimeout(() => el.classList.remove('show'), 3200);
}

function initials(name) {
  if (!name) return 'D';
  return name.replace(/^Dr\.?\s*/i, '').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
}

function formatTime(t) {
  const [h, m] = t.split(':').map(Number);
  const ap = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ap}`;
}
