// Shared helpers for Pages Functions
export function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra }
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function cleanEntry(body) {
  const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const role = body.role === 'supplier' ? 'supplier' : 'pharmacy';
  const name = str(body.name, 100).replace(/[\u0000-\u001f<>]/g, '');
  const email = str(body.email, 254).toLowerCase();
  const phoneRaw = str(body.phone, 30)
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[^\d+]/g, '');
  const phone = phoneRaw.replace(/(?!^)\+/g, '');
  const errors = [];
  if (!email && !phone) errors.push('missing_contact');
  if (email && !EMAIL_RE.test(email)) errors.push('bad_email');
  if (phone && !/^\+?\d{7,15}$/.test(phone)) errors.push('bad_phone');
  return { role, name: name || null, email: email || null, phone: phone || null, errors };
}

// constant-time string compare
export function safeEqual(a, b) {
  const enc = new TextEncoder();
  const x = enc.encode(String(a)), y = enc.encode(String(b));
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] || 0) ^ (y[i] || 0);
  return diff === 0;
}

export function checkBasicAuth(request, env) {
  if (!env.ADMIN_USER || !env.ADMIN_PASS) return { ok: false, status: 503, error: 'Admin login is not configured yet (set ADMIN_USER and ADMIN_PASS).' };
  const h = request.headers.get('Authorization') || '';
  if (!h.startsWith('Basic ')) return { ok: false, status: 401, error: 'Login required.' };
  let decoded = '';
  try { decoded = atob(h.slice(6)); } catch { return { ok: false, status: 401, error: 'Login required.' }; }
  const i = decoded.indexOf(':');
  const user = decoded.slice(0, i), pass = decoded.slice(i + 1);
  const ok = safeEqual(user, env.ADMIN_USER) & safeEqual(pass, env.ADMIN_PASS);
  return ok ? { ok: true } : { ok: false, status: 401, error: 'Wrong username or password.' };
}
