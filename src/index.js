// Smart Bonus waitlist — Cloudflare Worker entry
// Static files (public/) are served by Cloudflare directly; only /api/* reaches this code.
import * as waitlist from '../functions/api/waitlist.js';
import * as entries from '../functions/api/admin/entries.js';
import { json } from '../lib/util.js';

const ROUTES = {
  '/api/waitlist': waitlist,
  '/api/admin/entries': entries
};

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const mod = ROUTES[pathname.replace(/\/+$/, '')];
    if (mod) {
      const m = request.method.toUpperCase();
      const handler = mod['onRequest' + m[0] + m.slice(1).toLowerCase()] || mod.onRequest;
      return handler({ request, env });
    }
    if (pathname.startsWith('/api/')) return json({ ok: false, code: 'server', error: 'Not found.' }, 404);
    return env.ASSETS.fetch(request);
  }
};
