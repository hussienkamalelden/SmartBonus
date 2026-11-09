/* Smart Bonus — site script (landing + about). Arabic default, English optional. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  /* ================= videos per audience =================
     To add the supplier video later: put the file in /assets/video/ and fill `video` + `poster`. */
  const AUD = {
    supplier: { video: '', poster: '' },
    pharmacy: { video: '/assets/video/smartbonus-intro.mp4', poster: '/assets/video/poster.jpg' }
  };

  /* ================= translations ================= */
  const T = {
    ar: {
      docHome: 'Smart Bonus | منصة المشتريات الذكية للقطاع الصحي',
      docAbout: 'من نحن | Smart Bonus',
      langLabel: 'English', navAbout: 'من نحن', navHome: 'الرئيسية', audAria: 'اختر نوع حسابك',
      tabSupplier: 'أنا مورّد', tabPharmacy: 'أنا صيدلية',
      supplier: {
        title: 'صيدليات أكثر… وطلبات أكثر… <span class="grad">بلا مجهود.</span>',
        sub: 'اعرض مخزونك، نافس بذكاء، ودع الطلبات تأتي إليك.',
        cta: 'سجّل كمورّد الآن', end: 'جاهز تبيع أكثر؟', role: 'مورّد', mTitle: 'سجّل كمورّد',
        name: 'اسم الشركة أو المسؤول', ph: 'مثال: شركة النور للأدوية',
        done: 'شكرًا لانضمامك، سنتواصل معك فور فتح المنصة للموردين.'
      },
      pharmacy: {
        title: 'كل الموردين… وأفضل عرض <span class="grad">في ثانية.</span>',
        sub: 'قارن الأسعار والبونص، واطلب بضغطة واحدة.',
        cta: 'سجّل صيدليتك الآن', end: 'جاهز تشتري بذكاء؟', role: 'صيدلية', mTitle: 'سجّل صيدليتك',
        name: 'اسم الصيدلية أو الصيدلي', ph: 'مثال: صيدلية الشفاء',
        done: 'شكرًا لانضمامك، سنتواصل معك فور إطلاق <span class="nw">Smart Bonus</span>.'
      },
      loading: 'جارٍ تجهيز الفيديو…', loadingVideo: 'جارٍ تحميل الفيديو…', play: 'شغّل الفيديو',
      chipTime: '60 ثانية', chipSound: 'شغّل الصوت', replay: 'إعادة التشغيل',
      soonTitle: 'فيديو الموردين في الطريق…', soonSub: 'سجّل الآن وكن أول من يشاهده.',
      soon1: 'رادار النواقص', soon2: 'مصفاة الرواكد', soon3: 'مؤشر التنافسية', soon4: 'تسوية تلقائية',
      trustline: 'تطوير <b>شركة الريان لتقنية المعلومات</b> · بالشراكة مع <b>شركة الفاروق لاستيراد وتوريد الأدوية</b>',
      close: 'إغلاق', optional: '(اختياري)', fEmail: 'البريد الإلكتروني', fPhone: 'رقم الهاتف / واتساب',
      hint: 'يكفي البريد الإلكتروني أو رقم الهاتف.', hintOk: 'تمام، هذا كل ما نحتاجه.',
      fine: 'نستخدم بياناتك فقط للتواصل معك بخصوص <span class="nw">Smart Bonus</span>.',
      back: 'العودة للصفحة', doneTitle: 'تم تسجيلك بنجاح!', dupTitle: 'أنت مسجّل بالفعل!', dupText: 'بياناتك موجودة لدينا، وسنتواصل معك قريبًا.',
      errors: {
        missing_contact: 'من فضلك أدخل البريد الإلكتروني أو رقم الهاتف.', bad_email: 'البريد الإلكتروني غير صحيح.',
        bad_phone: 'رقم الهاتف غير صحيح (من 7 إلى 15 رقمًا).', network: 'تعذّر الاتصال بالخادم، حاول مرة أخرى بعد لحظات.',
        server: 'حدث خطأ أثناء الحفظ، حاول مرة أخرى.'
      },
      footTag: 'اشترِ بذكاء. قارن بثقة. واستفد أكثر.', footDesc: 'منصة المشتريات الذكية للقطاع الصحي.', footLinks: 'روابط سريعة',
      credit: 'تطوير <b>شركة الريان لتقنية المعلومات</b> · بالشراكة مع <b>شركة الفاروق لاستيراد وتوريد الأدوية والمستلزمات الطبية</b>',
      footGroup: 'منظومة مؤسسية متكاملة', footContact: 'تواصل معنا', rights: 'جميع الحقوق محفوظة.',
      orgRayan: 'شركة الريان لتقنية المعلومات', orgRayanRole: 'الذراع التقني · تطوير وتشغيل المنصة',
      orgFarouk: 'شركة الفاروق لاستيراد وتوريد الأدوية والمستلزمات الطبية', orgFaroukRole: 'الذراع التجاري والتوريدي',
      legal: 'تم استكمال الإجراءات والمستندات القانونية الخاصة بالشركتين.',
      addr1: 'شارع الجرابة - طرابلس - ليبيا', addr2: 'أرض الرحبة - بنغازي - ليبيا',
      /* about */
      abEyebrow: 'من نحن',
      abTitle: 'نعيد ابتكار <span class="grad">طريقة الشراء</span> في القطاع الصحي.',
      abLead: '<b>Smart Bonus</b> منظومة رقمية متكاملة للمشتريات الذكية، تهدف إلى تطوير طريقة حصول الصيدليات والعيادات والمختبرات على احتياجاتها من الأدوية والمستلزمات الطبية.',
      who1: 'صيدليات', who2: 'عيادات', who3: 'مختبرات', who4: 'موردون',
      howTitle: 'نجمع ثلاث قوى في منصة واحدة',
      howLead: 'لتمكين المؤسسات الصحية من مقارنة العروض، وتحسين قرارات الشراء، وتحقيق أفضل قيمة مقابل ميزانياتها.',
      p1t: 'التكنولوجيا', p1d: 'تطبيقات وأنظمة رقمية تجعل طلب الأدوية وتتبعه أسهل وأسرع.',
      p2t: 'تحليل الأسعار', p2d: 'مقارنة ذكية للأسعار والعروض والبونص لتصل إلى أفضل قيمة.',
      p3t: 'شبكة الموردين', p3d: 'ربط المشترين بالموردين في سوق واحد أكثر كفاءة وشفافية.',
      orgTitle: 'منظومة مؤسسية متكاملة', orgLead: 'تستند Smart Bonus إلى تكامل بين شركتين متخصصتين.',
      roleTech: 'الذراع التقني', roleSupply: 'الذراع التجاري والتوريدي',
      orgRayanD: 'المسؤولة عن تطوير التطبيقات والأنظمة الرقمية، وإدارة البنية التقنية وأدوات المقارنة والتحليل الذكي.',
      orgFaroukD: 'المتخصصة في استيراد وتوريد الأدوية والمستلزمات الطبية، وبناء العلاقات مع الموردين وشركات الأدوية.',
      legalLong: 'تم استكمال الإجراءات والمستندات القانونية الخاصة بالشركتين، بما يضمن وضوح الإطار المؤسسي والتنظيمي لكل نشاط.',
      visionT: 'رؤيتنا', visionD: 'أن نصبح منصة رائدة في تطوير المشتريات والتوريد بالقطاع الصحي، نحو سوق أكثر كفاءة وشفافية.',
      missionT: 'رسالتنا', missionD: 'تمكين المؤسسات الصحية من الشراء بذكاء، عبر مقارنة الأسعار والعروض، وربط المشترين بالموردين، وتحسين كفاءة المشتريات.',
      closeT: 'اشترِ بذكاء. قارن بثقة. واستفد أكثر.', closeD: 'نحو مستقبل أكثر ذكاءً للمشتريات في القطاع الصحي.',
      joinSupplier: 'سجّل كمورّد', joinPharmacy: 'سجّل صيدليتك'
    },
    en: {
      docHome: 'Smart Bonus | Smart procurement for healthcare',
      docAbout: 'About us | Smart Bonus',
      langLabel: 'عربي', navAbout: 'About us', navHome: 'Home', audAria: 'Choose your account type',
      tabSupplier: "I'm a supplier", tabPharmacy: "I'm a pharmacy",
      supplier: {
        title: 'More pharmacies. More orders. <span class="grad">Zero chasing.</span>',
        sub: 'Show your stock, compete smart, and let the orders come to you.',
        cta: 'Join as a supplier', end: 'Ready to sell more?', role: 'Supplier', mTitle: 'Join as a supplier',
        name: 'Company or contact name', ph: 'e.g. Al Noor Pharma',
        done: 'Thanks for joining. We’ll reach out as soon as the platform opens to suppliers.'
      },
      pharmacy: {
        title: 'Every supplier. The best offer. <span class="grad">In one second.</span>',
        sub: 'Compare prices and bonuses, then order in one tap.',
        cta: 'Register your pharmacy', end: 'Ready to buy smarter?', role: 'Pharmacy', mTitle: 'Register your pharmacy',
        name: 'Pharmacy or pharmacist name', ph: 'e.g. Al Shifaa Pharmacy',
        done: 'Thanks for joining. We’ll reach out the moment <span class="nw">Smart Bonus</span> opens.'
      },
      loading: 'Getting the video ready…', loadingVideo: 'Loading the video…', play: 'Play the video',
      chipTime: '60 sec', chipSound: 'Sound on', replay: 'Replay',
      soonTitle: 'The supplier video is on its way…', soonSub: 'Sign up now and be the first to watch it.',
      soon1: 'Shortage radar', soon2: 'Slow-stock clearance', soon3: 'Competitiveness index', soon4: 'Automatic settlement',
      trustline: 'Built by <b>Al Rayan IT</b> · in partnership with <b>Al Farouk Medical Supply</b>',
      close: 'Close', optional: '(optional)', fEmail: 'Email', fPhone: 'Phone / WhatsApp',
      hint: 'Email or phone — one is enough.', hintOk: 'Perfect — that’s all we need.',
      fine: 'We’ll only use your details to contact you about <span class="nw">Smart Bonus</span>.',
      back: 'Back to the page', doneTitle: 'You’re on the list!', dupTitle: 'You’re already on the list!', dupText: 'Good news — we already have your details. We’ll be in touch soon.',
      errors: {
        missing_contact: 'Please add your email or phone number.', bad_email: 'That email doesn’t look right.',
        bad_phone: 'Please enter a valid phone number (7–15 digits).', network: 'Can’t reach the server right now. Please try again in a moment.',
        server: 'Something went wrong while saving. Please try again.'
      },
      footTag: 'Buy smarter. Compare with confidence. Gain more.', footDesc: 'The smart procurement platform for healthcare.', footLinks: 'Quick links',
      credit: 'Developed by <b>Al Rayan Information Technology Co.</b> · in partnership with <b>Al Farouk Co. for Import & Supply of Medicines and Medical Supplies</b>',
      footGroup: 'An integrated corporate structure', footContact: 'Contact us', rights: 'All rights reserved.',
      orgRayan: 'Al Rayan Information Technology Co.', orgRayanRole: 'Technology arm · builds and runs the platform',
      orgFarouk: 'Al Farouk Co. for Import & Supply of Medicines and Medical Supplies', orgFaroukRole: 'Commercial & supply arm',
      legal: 'All legal procedures and documents for both companies have been completed.',
      addr1: 'Al Jaraba St., Tripoli, Libya', addr2: 'Ard Al Rahba, Benghazi, Libya',
      abEyebrow: 'About us',
      abTitle: 'Reinventing <span class="grad">how healthcare buys.</span>',
      abLead: '<b>Smart Bonus</b> is an integrated digital procurement platform that modernises how pharmacies, clinics and laboratories get the medicines and medical supplies they need.',
      who1: 'Pharmacies', who2: 'Clinics', who3: 'Laboratories', who4: 'Suppliers',
      howTitle: 'Three strengths in one platform',
      howLead: 'Helping healthcare providers compare offers, make better buying decisions and get the best value for their budgets.',
      p1t: 'Technology', p1d: 'Apps and digital systems that make ordering and tracking medicines faster and easier.',
      p2t: 'Price analytics', p2d: 'Smart comparison of prices, offers and bonuses to reach the best value.',
      p3t: 'Supplier network', p3d: 'Connecting buyers and suppliers in one more efficient, more transparent market.',
      orgTitle: 'An integrated corporate structure', orgLead: 'Smart Bonus is built on the integration of two specialised companies.',
      roleTech: 'Technology arm', roleSupply: 'Commercial & supply arm',
      orgRayanD: 'Develops the apps and digital systems, and runs the technical infrastructure and the smart comparison and analytics tools.',
      orgFaroukD: 'Specialised in importing and supplying medicines and medical supplies, and in building relationships with suppliers and pharmaceutical companies.',
      legalLong: 'All legal procedures and documents for both companies have been completed, ensuring a clear corporate and regulatory framework for each activity.',
      visionT: 'Our vision', visionD: 'To become a leading platform for modernising healthcare procurement and supply — towards a more efficient, more transparent market.',
      missionT: 'Our mission', missionD: 'Empowering healthcare providers to buy smart by comparing prices and offers, connecting buyers with suppliers and improving procurement efficiency.',
      closeT: 'Buy smarter. Compare with confidence. Gain more.', closeD: 'Towards a smarter future for healthcare procurement.',
      joinSupplier: 'Join as a supplier', joinPharmacy: 'Register your pharmacy'
    }
  };

  let lang = document.documentElement.lang === 'en' ? 'en' : 'ar';
  const t = (k) => T[lang][k];
  const isHome = !!$('#hero');
  let aud = 'supplier';
  const A = () => T[lang][aud];

  /* ================= shared ================= */
  $$('.js-year').forEach((e) => { e.textContent = new Date().getFullYear(); });

  const caps = $('#caps');
  if (caps) [[6, 20, 70, -30, 16], [88, 16, 56, 40, 19], [92, 76, 90, -60, 22], [4, 80, 100, 20, 18], [48, 8, 40, 70, 15], [70, 92, 60, -20, 20]]
    .forEach(([x, y, w, r, d], i) => {
      const s = document.createElement('span');
      s.style.cssText = `left:${x}%;top:${y}%;width:${w * 2.4}px;height:${w}px;--r:${r}deg;--t:${d}s;--x:${(i % 2 ? -1 : 1) * 30}px;--y:${(i % 3 ? -1 : 1) * 36}px;animation-delay:-${i * 2}s`;
      caps.appendChild(s);
    });

  // scroll reveal (about page)
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.15 }) : null;
  $$('.reveal-on-scroll').forEach((el) => (io && !reduceMotion ? io.observe(el) : el.classList.add('in')));

  function applyLang() {
    const html = document.documentElement;
    html.lang = lang; html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = isHome ? t('docHome') : t('docAbout');
    $$('[data-i18n]').forEach((el) => { const v = t(el.dataset.i18n); if (typeof v === 'string') el.textContent = v; });
    $$('[data-i18n-html]').forEach((el) => { const v = t(el.dataset.i18nHtml); if (typeof v === 'string') el.innerHTML = v; });
    $$('[data-i18n-aria]').forEach((el) => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
    $('#langLabel').textContent = t('langLabel');
    if (isHome) renderAud(false);
  }
  $('#langBtn').addEventListener('click', () => {
    lang = lang === 'ar' ? 'en' : 'ar';
    try { localStorage.setItem('sb_lang', lang); } catch (e) {}
    try { const u = new URL(location.href); u.searchParams.delete('lang'); history.replaceState(null, '', u); } catch (e) {}
    applyLang();
  });

  if (!isHome) { applyLang(); return; }

  /* ================= landing: audience + video ================= */
  const hero = $('#hero');
  const player = $('.player');
  const frame = $('#tilt');
  const bezel = $('.player__bezel');
  const video = $('#intro');
  const endCard = $('#endCard');
  const loaderText = $('.loader__text');

  function loadPoster(src) {
    frame.classList.add('is-loading');
    loaderText.textContent = t('loading');
    const img = new Image();
    const done = () => { if (video.getAttribute('poster') === src) frame.classList.remove('is-loading'); };
    video.setAttribute('poster', src);
    img.onload = done; img.onerror = done; img.src = src;
    if (img.complete) done();
  }

  function setVideo() {
    const cfg = AUD[aud];
    video.pause();
    video.removeAttribute('src'); video.load();
    video.controls = false;
    player.classList.remove('is-playing');
    frame.classList.remove('is-buffering');
    endCard.hidden = true;
    if (!cfg.video) {
      video.removeAttribute('poster');
      frame.classList.remove('is-loading');
      frame.classList.add('is-soon');
    } else {
      frame.classList.remove('is-soon');
      loadPoster(cfg.poster);
    }
  }

  function renderAud(animate) {
    const a = A();
    hero.dataset.aud = aud;
    $$('.aud__btn').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.aud === aud)));
    const title = $('#title'), sub = $('#sub');
    title.innerHTML = a.title; sub.textContent = a.sub;
    $$('.js-cta').forEach((e) => { e.textContent = a.cta; });
    $('#endTitle').textContent = a.end;
    $('#wlTitle').textContent = a.mTitle;
    const role = $('#wlRole'); role.textContent = a.role; role.classList.toggle('is-pharmacy', aud === 'pharmacy');
    $('#nameLabel').textContent = a.name;
    $('#name').placeholder = a.ph;
    if (animate && !reduceMotion) [title, sub].forEach((el) => { el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap'); });
    syncRequired();
  }

  function setAud(next, animate = true) {
    if (next !== 'supplier' && next !== 'pharmacy') next = 'supplier';
    const changed = next !== aud;
    aud = next;
    renderAud(animate && changed);
    if (changed) setVideo();
    try { history.replaceState(null, '', location.pathname + '#' + aud); } catch (e) {}
  }
  $$('.aud__btn').forEach((b) => b.addEventListener('click', () => setAud(b.dataset.aud)));
  window.addEventListener('hashchange', () => setAud(location.hash.slice(1)));

  function startVideo() {
    const cfg = AUD[aud];
    if (!cfg.video) return;
    endCard.hidden = true;
    bezel.style.transform = '';
    player.classList.add('is-playing');
    if (!video.getAttribute('src')) {
      loaderText.textContent = t('loadingVideo');
      frame.classList.add('is-loading');
      video.src = cfg.video;
    }
    video.controls = true;
    const p = video.play();
    if (p && p.catch) p.catch(() => { player.classList.remove('is-playing'); frame.classList.remove('is-loading'); });
  }
  video.addEventListener('playing', () => frame.classList.remove('is-loading', 'is-buffering'));
  video.addEventListener('waiting', () => { if (player.classList.contains('is-playing')) frame.classList.add('is-buffering'); });
  video.addEventListener('canplay', () => frame.classList.remove('is-buffering'));
  video.addEventListener('error', () => { if (!video.getAttribute('src')) return; frame.classList.remove('is-loading', 'is-buffering'); player.classList.remove('is-playing'); });
  video.addEventListener('play', () => player.classList.add('is-playing'));
  video.addEventListener('ended', () => { video.controls = false; endCard.hidden = false; });
  $('#playBtn').addEventListener('click', (e) => { e.stopPropagation(); startVideo(); });
  frame.addEventListener('click', (e) => {
    if (player.classList.contains('is-playing') || !endCard.hidden || e.target.closest('button')) return;
    startVideo();
  });
  $('#replay').addEventListener('click', () => { video.currentTime = 0; startVideo(); });

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
          const r = bezel.getBoundingClientRect();
          const dx = (mx - (r.left + r.width / 2)) / r.width, dy = (my - (r.top + r.height / 2)) / r.height;
          bezel.style.transform = `rotateX(${(-dy * 4).toFixed(2)}deg) rotateY(${(dx * 5).toFixed(2)}deg)`;
        }
      });
    }, { passive: true });
    document.addEventListener('pointerleave', () => { spot.style.opacity = '0'; bezel.style.transform = ''; });
  }

  /* ================= modal + form ================= */
  const modal = $('#waitlist'), form = $('#form'), wlForm = $('#wlForm'), wlDone = $('#wlDone');
  const email = $('#email'), phone = $('#phone'), nameI = $('#name');
  const hint = $('#hint'), err = $('#err'), submit = $('#submit');
  let lastFocus = null;

  function openModal() {
    lastFocus = document.activeElement;
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
  $$('[data-open-waitlist]').forEach((b) => b.addEventListener('click', openModal));
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

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const toLatin = (v) => v.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
  const cleanPhone = (v) => toLatin(v).replace(/[^\d+]/g, '');
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
    const payload = { role: aud, name: nameI.value.trim(), email: e1, phone: p1 ? cleanPhone(p1) : '', lang, website: form.website.value };
    submit.classList.add('is-loading'); submit.disabled = true;
    try {
      let res;
      try { res = await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); }
      catch (netErr) { return showError('network'); }
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) return showError(data.code || 'server', data.code === 'bad_phone' ? phone : data.code === 'bad_email' ? email : null);
      $('#doneTitle').textContent = data.duplicate ? t('dupTitle') : t('doneTitle');
      $('#doneText').innerHTML = data.duplicate ? t('dupText') : A().done;
      wlForm.hidden = true; wlDone.hidden = false;
      $('[data-close].btn', wlDone).focus();
      form.reset(); syncRequired();
    } finally {
      submit.classList.remove('is-loading'); submit.disabled = false;
    }
  });

  /* ================= init ================= */
  const params = new URLSearchParams(location.search);
  const join = params.get('join');
  const first = join || location.hash.slice(1);
  aud = first === 'pharmacy' ? 'pharmacy' : 'supplier';
  applyLang();
  setVideo();
  try { history.replaceState(null, '', location.pathname + '#' + aud); } catch (e) {}
  if (join) openModal();
})();
