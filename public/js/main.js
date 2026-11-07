/* Smart Bonus — landing page (Arabic default, English optional) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  /* ================= translations ================= */
  const T = {
    ar: {
      docTitle: 'Smart Bonus | الطريقة الأذكى لتوريد الأدوية',
      navCta: 'انضم لقائمة الانتظار',
      eyebrow: 'التسجيل المبكر متاح الآن',
      title: 'صيدليتك… <span class="grad">أذكى.</span>',
      sub: 'كل الموردين والأسعار والبونص… في ثانية واحدة.',
      loading: 'جارٍ تجهيز الفيديو…',
      loadingVideo: 'جارٍ تحميل الفيديو…',
      play: 'شغّل الفيديو',
      chipTime: '60 ثانية',
      chipSound: 'شغّل الصوت',
      endTitle: 'جاهز تشتري بذكاء؟',
      endCta: 'انضم لقائمة الانتظار',
      replay: 'إعادة التشغيل',
      ctaPharmacy: 'أنا صيدلية',
      ctaSupplier: 'أنا مورّد',
      perk1: 'أفضل عرض في ثوانٍ',
      perk2: 'مزايدة حية بين الموردين',
      perk3: 'الدفع بعد الاستلام فقط',
      rights: 'جميع الحقوق محفوظة.',
      close: 'إغلاق',
      mEyebrow: 'وصول مبكر',
      mTitle: 'احجز مكانك مبكرًا',
      mLead: 'كن من أوائل من يستخدم Smart Bonus، وسنتواصل معك فور الإطلاق.',
      rolePharmacy: 'صيدلية',
      roleSupplier: 'مورّد',
      fName: 'الاسم بالكامل',
      optional: '(اختياري)',
      phName: 'مثال: د. أحمد علي',
      fEmail: 'البريد الإلكتروني',
      fPhone: 'رقم الهاتف / واتساب',
      hint: 'يكفي البريد الإلكتروني أو رقم الهاتف.',
      hintOk: 'تمام، هذا كل ما نحتاجه.',
      submit: 'انضم لقائمة الانتظار',
      fine: 'نستخدم بياناتك فقط للتواصل معك بخصوص <span class="nw">Smart Bonus</span>.',
      back: 'العودة للفيديو',
      doneTitle: 'تم تسجيلك بنجاح!',
      doneText: 'شكرًا لانضمامك، سنتواصل معك فور إطلاق Smart Bonus.',
      dupTitle: 'أنت مسجّل بالفعل!',
      dupText: 'بياناتك موجودة لدينا، وسنتواصل معك قريبًا.',
      errors: {
        missing_contact: 'من فضلك أدخل البريد الإلكتروني أو رقم الهاتف.',
        bad_email: 'البريد الإلكتروني غير صحيح.',
        bad_phone: 'رقم الهاتف غير صحيح (من 7 إلى 15 رقمًا).',
        network: 'تعذّر الاتصال بالخادم، حاول مرة أخرى بعد لحظات.',
        server: 'حدث خطأ أثناء الحفظ، حاول مرة أخرى.'
      },
      langLabel: 'English'
    },
    en: {
      docTitle: 'Smart Bonus | The smartest way to source medicines',
      navCta: 'Join the waitlist',
      eyebrow: 'Early access is open',
      title: 'Your pharmacy, <span class="grad">smarter.</span>',
      sub: 'Every supplier, price and bonus — in one second.',
      loading: 'Getting the video ready…',
      loadingVideo: 'Loading the video…',
      play: 'Play the 60-second video',
      chipTime: '60 sec',
      chipSound: 'Sound on',
      endTitle: 'Ready to source smarter?',
      endCta: 'Join the waitlist',
      replay: 'Replay',
      ctaPharmacy: "I'm a pharmacy",
      ctaSupplier: "I'm a supplier",
      perk1: 'Best offer in seconds',
      perk2: 'Live supplier bidding',
      perk3: 'Paid only on delivery',
      rights: 'All rights reserved.',
      close: 'Close',
      mEyebrow: 'Early access',
      mTitle: 'Get early access',
      mLead: "Be among the first to use Smart Bonus. We'll reach out the moment it opens.",
      rolePharmacy: 'Pharmacy',
      roleSupplier: 'Supplier',
      fName: 'Full name',
      optional: '(optional)',
      phName: 'e.g. Dr. Ahmed Ali',
      fEmail: 'Email',
      fPhone: 'Phone / WhatsApp',
      hint: 'Email or phone — one is enough.',
      hintOk: 'Perfect — that’s all we need.',
      submit: 'Join the waitlist',
      fine: 'We’ll only use your details to contact you about <span class="nw">Smart Bonus</span>.',
      back: 'Back to the video',
      doneTitle: 'You’re on the list!',
      doneText: 'Thanks for joining. We’ll reach out the moment Smart Bonus opens.',
      dupTitle: 'You’re already on the list!',
      dupText: 'Good news — we already have your details. We’ll be in touch soon.',
      errors: {
        missing_contact: 'Please add your email or phone number.',
        bad_email: 'That email doesn’t look right.',
        bad_phone: 'Please enter a valid phone number (7–15 digits).',
        network: 'Can’t reach the server right now. Please try again in a moment.',
        server: 'Something went wrong while saving. Please try again.'
      },
      langLabel: 'عربي'
    }
  };
  let lang = document.documentElement.lang === 'en' ? 'en' : 'ar';
  const t = (k) => T[lang][k];

  function applyLang() {
    const html = document.documentElement;
    html.lang = lang; html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = t('docTitle');
    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    $$('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    $('#langLabel').textContent = t('langLabel');
    $('#langBtn').setAttribute('aria-label', lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
    if (typeof syncRequired === 'function') syncRequired();
  }
  $('#langBtn').addEventListener('click', () => {
    lang = lang === 'ar' ? 'en' : 'ar';
    try { localStorage.setItem('sb_lang', lang); } catch (e) {}
    try { const u = new URL(location.href); u.searchParams.delete('lang'); history.replaceState(null, '', u); } catch (e) {}
    applyLang();
  });

  $('#year').textContent = new Date().getFullYear();

  /* ================= floating capsules ================= */
  const caps = $('#caps');
  [[6, 18, 70, -30, 16], [88, 14, 56, 40, 19], [92, 74, 90, -60, 22], [4, 78, 100, 20, 18],
   [48, 6, 40, 70, 15], [70, 92, 60, -20, 20], [26, 92, 46, 35, 17]].forEach(([x, y, w, r, d], i) => {
    const s = document.createElement('span');
    s.style.cssText = `left:${x}%;top:${y}%;width:${w * 2.4}px;height:${w}px;--r:${r}deg;--t:${d}s;--x:${(i % 2 ? -1 : 1) * 30}px;--y:${(i % 3 ? -1 : 1) * 36}px;animation-delay:-${i * 2}s`;
    caps.appendChild(s);
  });

  /* ================= video + loader ================= */
  const player = $('.player');
  const frame = $('#tilt');
  const video = $('#intro');
  const endCard = $('#endCard');
  const loaderText = $('.loader__text');

  // keep the loader until the poster image has arrived
  const poster = new Image();
  const posterReady = () => frame.classList.remove('is-loading');
  poster.onload = posterReady; poster.onerror = posterReady;
  poster.src = video.getAttribute('poster');
  if (poster.complete) posterReady();

  function startVideo() {
    endCard.hidden = true;
    frame.style.transform = '';
    player.classList.add('is-playing');
    if (!video.src) {
      loaderText.textContent = t('loadingVideo');
      frame.classList.add('is-loading');
      video.src = video.dataset.src;
    }
    video.controls = true;
    const p = video.play();
    if (p && p.catch) p.catch(() => { player.classList.remove('is-playing'); frame.classList.remove('is-loading'); });
  }
  video.addEventListener('playing', () => { frame.classList.remove('is-loading', 'is-buffering'); });
  video.addEventListener('waiting', () => { if (player.classList.contains('is-playing')) frame.classList.add('is-buffering'); });
  video.addEventListener('canplay', () => frame.classList.remove('is-buffering'));
  video.addEventListener('error', () => { frame.classList.remove('is-loading', 'is-buffering'); player.classList.remove('is-playing'); });
  video.addEventListener('play', () => player.classList.add('is-playing'));
  video.addEventListener('ended', () => { video.controls = false; endCard.hidden = false; });
  $('#playBtn').addEventListener('click', (e) => { e.stopPropagation(); startVideo(); });
  frame.addEventListener('click', (e) => {
    if (player.classList.contains('is-playing') || !endCard.hidden || e.target.closest('button')) return;
    startVideo();
  });
  $('#replay').addEventListener('click', () => { video.currentTime = 0; startVideo(); });

  /* cursor spotlight + gentle tilt (desktop only) */
  if (finePointer && !reduceMotion) {
    const spot = $('#spot');
    let raf = 0, mx = 0, my = 0;
    window.addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        spot.style.opacity = '1';
        spot.style.transform = `translate(${mx}px,${my}px)`;
        if (!player.classList.contains('is-playing')) {
          const r = frame.getBoundingClientRect();
          const dx = (mx - (r.left + r.width / 2)) / r.width;
          const dy = (my - (r.top + r.height / 2)) / r.height;
          frame.style.transform = `rotateX(${(-dy * 5).toFixed(2)}deg) rotateY(${(dx * 7).toFixed(2)}deg)`;
        }
      });
    }, { passive: true });
    document.addEventListener('pointerleave', () => { spot.style.opacity = '0'; frame.style.transform = ''; });
  }

  /* ================= modal ================= */
  const modal = $('#waitlist');
  const form = $('#form');
  const wlForm = $('#wlForm');
  const wlDone = $('#wlDone');
  const email = $('#email'), phone = $('#phone'), nameI = $('#name');
  const hint = $('#hint'), err = $('#err'), submit = $('#submit');
  let lastFocus = null;

  function openModal(role) {
    lastFocus = document.activeElement;
    if (role) { const r = $(`input[name="role"][value="${role}"]`, form); if (r) r.checked = true; }
    if (!video.paused) video.pause();
    wlForm.hidden = false; wlDone.hidden = true; err.hidden = true;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => nameI.focus(), 60);
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  $$('[data-open-waitlist]').forEach((b) => b.addEventListener('click', () => openModal(b.dataset.role)));
  $$('[data-close]', modal).forEach((b) => b.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') {
      const f = $$('button, input:not(.hp)', modal).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ================= form: email OR phone ================= */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const toLatinDigits = (v) => v.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
  const cleanPhone = (v) => toLatinDigits(v).replace(/[^\d+]/g, '');
  const phoneOk = (v) => /^\+?\d{7,15}$/.test(cleanPhone(v));

  function syncRequired() {
    const hasE = email.value.trim() !== '', hasP = phone.value.trim() !== '';
    $('[data-req="email"]').hidden = hasP && !hasE;
    $('[data-opt="email"]').hidden = !(hasP && !hasE);
    $('[data-req="phone"]').hidden = hasE && !hasP;
    $('[data-opt="phone"]').hidden = !(hasE && !hasP);
    const ok = (hasE && EMAIL_RE.test(email.value.trim())) || (hasP && phoneOk(phone.value));
    hint.textContent = ok ? t('hintOk') : t('hint');
    hint.classList.toggle('is-ok', ok);
  }
  window.syncRequired = syncRequired;
  [email, phone].forEach((i) => i.addEventListener('input', () => { i.classList.remove('is-invalid'); err.hidden = true; syncRequired(); }));

  function showError(code, field) {
    err.textContent = t('errors')[code] || t('errors').server;
    err.hidden = false;
    if (field) { field.classList.add('is-invalid'); field.focus(); }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    err.hidden = true;
    const e1 = email.value.trim(), p1 = phone.value.trim();
    if (!e1 && !p1) return showError('missing_contact', email);
    if (e1 && !EMAIL_RE.test(e1)) return showError('bad_email', email);
    if (p1 && !phoneOk(p1)) return showError('bad_phone', phone);

    const payload = {
      role: (form.querySelector('input[name="role"]:checked') || {}).value || 'pharmacy',
      name: nameI.value.trim(),
      email: e1,
      phone: p1 ? cleanPhone(p1) : '',
      lang,
      website: form.website.value // honeypot
    };

    submit.classList.add('is-loading'); submit.disabled = true;
    try {
      let res;
      try {
        res = await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } catch (netErr) { return showError('network'); }
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) return showError(data.code || 'server', data.code === 'bad_phone' ? phone : data.code === 'bad_email' ? email : null);
      $('#doneTitle').textContent = data.duplicate ? t('dupTitle') : t('doneTitle');
      $('#doneText').textContent = data.duplicate ? t('dupText') : t('doneText');
      wlForm.hidden = true; wlDone.hidden = false;
      $('[data-close].btn', wlDone).focus();
      form.reset(); syncRequired();
    } finally {
      submit.classList.remove('is-loading'); submit.disabled = false;
    }
  });

  applyLang();
})();
