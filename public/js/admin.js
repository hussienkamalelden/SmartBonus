(() => {
  const $ = (s) => document.querySelector(s);
  const KEY = 'sb_admin_auth';
  let entries = [];

  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  async function load(auth) {
    const res = await fetch('/api/admin/entries', { headers: { Authorization: 'Basic ' + auth }, cache: 'no-store' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      const msg = res.status === 401 ? 'اسم المستخدم أو كلمة المرور غير صحيحة.'
        : res.status === 503 ? 'اللوحة غير مفعّلة بعد: تأكد من ربط قاعدة البيانات DB وإضافة ADMIN_USER و ADMIN_PASS في Cloudflare.'
        : 'تعذّر تحميل التسجيلات، حاول مرة أخرى.';
      throw new Error(msg);
    }
    return data;
  }

  function render() {
    const q = $('#q').value.trim().toLowerCase();
    const role = $('#role').value;
    const list = entries.filter((r) => (!role || r.role === role) &&
      (!q || [r.name, r.email, r.phone].some((v) => (v || '').toLowerCase().includes(q))));
    $('#rows').innerHTML = list.map((r) => `<tr>
      <td>${esc(r.id)}</td>
      <td><span class="pill pill--${esc(r.role)}">${r.role === 'supplier' ? 'مورّد' : 'صيدلية'}</span></td>
      <td>${esc(r.name) || '<span class="muted">—</span>'}</td>
      <td dir="ltr">${r.email ? `<a href="mailto:${esc(r.email)}" style="color:inherit">${esc(r.email)}</a>` : '<span class="muted">—</span>'}</td>
      <td dir="ltr">${r.phone ? `<a href="tel:${esc(r.phone)}" style="color:inherit">${esc(r.phone)}</a>` : '<span class="muted">—</span>'}</td>
      <td>${esc(r.country) || '<span class="muted">—</span>'}</td>
      <td>${esc((r.created_at || '').replace('T', ' ').replace('Z', ''))}</td></tr>`).join('');
    $('#empty').hidden = list.length > 0;
    $('#shown').textContent = `المعروض: ${list.length}`;
  }

  function showDash(data) {
    entries = data.entries || [];
    $('#sTotal').textContent = data.stats.total;
    $('#sPh').textContent = data.stats.pharmacies;
    $('#sSu').textContent = data.stats.suppliers;
    $('#sToday').textContent = data.stats.today;
    $('#login').hidden = true;
    $('#dash').hidden = false;
    render();
  }

  $('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = $('#loginBtn'), err = $('#loginErr');
    err.hidden = true; btn.disabled = true; btn.textContent = 'جارٍ الدخول…';
    const auth = btoa(unescape(encodeURIComponent($('#u').value.trim() + ':' + $('#p').value)));
    try {
      const data = await load(auth);
      sessionStorage.setItem(KEY, auth);
      showDash(data);
    } catch (ex) {
      err.textContent = ex.message === 'Failed to fetch' ? 'تعذّر الاتصال بالخادم.' : ex.message; err.hidden = false;
    } finally { btn.disabled = false; btn.textContent = 'تسجيل الدخول'; }
  });

  $('#refresh').addEventListener('click', async () => {
    try { showDash(await load(sessionStorage.getItem(KEY))); } catch { location.reload(); }
  });
  $('#logout').addEventListener('click', () => { sessionStorage.removeItem(KEY); location.reload(); });
  $('#q').addEventListener('input', render);
  $('#role').addEventListener('change', render);

  $('#csv').addEventListener('click', () => {
    const cols = ['id', 'role', 'name', 'email', 'phone', 'country', 'created_at'];
    const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = '﻿' + [cols.join(','), ...entries.map((r) => cols.map((c) => cell(r[c])).join(','))].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = `smartbonus-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  // auto sign-in for this browser tab
  const saved = sessionStorage.getItem(KEY);
  if (saved) load(saved).then(showDash).catch(() => sessionStorage.removeItem(KEY));
})();
