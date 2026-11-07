// POST /api/waitlist  — save a waitlist sign-up into D1
import { json, cleanEntry } from '../../lib/util.js';

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ ok: false, code: 'server', error: 'Database is not connected yet.' }, 503);

  const type = request.headers.get('Content-Type') || '';
  if (!type.includes('application/json')) return json({ ok: false, code: 'server', error: 'Bad request.' }, 415);

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, code: 'server', error: 'Bad request.' }, 400); }
  if (!body || typeof body !== 'object') return json({ ok: false, code: 'server', error: 'Bad request.' }, 400);

  // honeypot: real people never fill the hidden "website" field
  if (body.website) return json({ ok: true });

  const e = cleanEntry(body);
  if (e.errors.length) return json({ ok: false, code: e.errors[0] }, 422);

  const country = (request.cf && request.cf.country) || null;
  try {
    const res = await env.DB.prepare(
      'INSERT OR IGNORE INTO waitlist (role, name, email, phone, country) VALUES (?1, ?2, ?3, ?4, ?5)'
    ).bind(e.role, e.name, e.email, e.phone, country).run();
    const inserted = res && res.meta ? res.meta.changes > 0 : true;
    return json({ ok: true, duplicate: !inserted });
  } catch (err) {
    return json({ ok: false, code: 'server', error: 'Could not save right now.' }, 500);
  }
}

export function onRequest() {
  return json({ ok: false, code: 'server', error: 'Method not allowed.' }, 405, { Allow: 'POST' });
}
