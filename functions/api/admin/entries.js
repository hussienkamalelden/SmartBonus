// GET /api/admin/entries  — list sign-ups (HTTP Basic auth with ADMIN_USER / ADMIN_PASS)
import { json, checkBasicAuth } from '../../../lib/util.js';

export async function onRequestGet({ request, env }) {
  const auth = checkBasicAuth(request, env);
  if (!auth.ok) {
    if (auth.status === 401) await new Promise((r) => setTimeout(r, 700)); // slow down guessing
    return json({ ok: false, error: auth.error }, auth.status);
  }
  if (!env.DB) return json({ ok: false, error: 'Database is not connected yet.' }, 503);

  const { results } = await env.DB.prepare(
    'SELECT id, role, name, email, phone, country, created_at FROM waitlist ORDER BY id DESC LIMIT 10000'
  ).all();
  const rows = results || [];
  const today = new Date().toISOString().slice(0, 10);
  return json({
    ok: true,
    stats: {
      total: rows.length,
      pharmacies: rows.filter((r) => r.role === 'pharmacy').length,
      suppliers: rows.filter((r) => r.role === 'supplier').length,
      today: rows.filter((r) => (r.created_at || '').startsWith(today)).length
    },
    entries: rows
  });
}

export function onRequest() {
  return json({ ok: false, error: 'Method not allowed.' }, 405, { Allow: 'GET' });
}
