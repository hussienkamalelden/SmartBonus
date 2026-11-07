# Smart Bonus — Waitlist website

صفحة الـ waitlist (إنجليزي) + صفحة أدمن + قاعدة بيانات مجانية على Cloudflare.

```
SmartBonus_Website/
├── public/                  ← ده الموقع نفسه (HTML / CSS / JS)
│   ├── index.html           الصفحة الرئيسية (الفيديو + زرار التسجيل)
│   ├── admin/index.html     صفحة الأدمن  →  yoursite.com/admin
│   ├── css/  js/            الستايل والأنيميشن والكود
│   └── assets/              الخطوط، اللوجو، الفيديو، صورة الغلاف
├── functions/api/           الباك إند (Cloudflare Pages Functions)
│   ├── waitlist.js          POST /api/waitlist   ← بيحفظ التسجيل
│   └── admin/entries.js     GET  /api/admin/entries ← بيعرض التسجيلات للأدمن بس
├── lib/util.js              دوال مشتركة (التحقق من البيانات وتسجيل دخول الأدمن)
└── schema.sql               جدول قاعدة البيانات
```

## اللغة
- الموقع **عربي افتراضيًا** (من اليمين للشمال)، وفيه زرار **English** فوق يقلب الصفحة كلها إنجليزي.
- الموقع بيفتكر اختيار الزائر. وتقدر تبعت لينك إنجليزي مباشرة: `yoursite.com/?lang=en`
- كل النصوص في ملف واحد: `public/js/main.js` (أول جزء اسمه `T`)، `ar` للعربي و`en` للإنجليزي.

## قاعدة البيانات: Cloudflare D1 (مجانية)
- SQLite جوه Cloudflare نفسها، فمش محتاج أي خدمة تانية.
- الخطة المجانية: 5GB تخزين، و100 ألف عملية كتابة في اليوم، و5 مليون قراءة في اليوم. أكتر بكتير من اللي محتاجينه.
- كل تسجيل بيتحفظ فيه: النوع (صيدلية/مورد)، الاسم، الإيميل، التليفون، الدولة (من Cloudflare)، والتاريخ.
- نفس الإيميل أو نفس الرقم مينفعش يتسجل مرتين. لو اتكرر، الشخص بيشوف رسالة "You're already on the list".

## خطوات الرفع (مرة واحدة)

**1) GitHub**
اعمل repo جديد، وارفع فيه **محتويات** فولدر `SmartBonus_Website` (يعني `public` و`functions` و`lib` وباقي الملفات تبقى في أول الـ repo).

**2) اعمل قاعدة البيانات**
Cloudflare Dashboard ← **Storage & Databases** ← **D1** ← **Create database**
- الاسم: `smartbonus-waitlist`
- افتح الداتابيز ← تبويب **Console** ← الصق محتوى `schema.sql` ← **Execute**

**3) اربط الموقع**
**Workers & Pages** ← **Create** ← **Pages** ← **Connect to Git** ← اختار الـ repo
- Framework preset: **None**
- Build command: سيبه فاضي
- Build output directory: `public`
- ← **Save and Deploy**

**4) اربط قاعدة البيانات بالموقع**
مشروع الـ Pages ← **Settings** ← **Bindings** ← **Add** ← **D1 database**
- Variable name: `DB` (لازم بالظبط كده)
- اختار `smartbonus-waitlist`

**5) يوزر وباسورد الأدمن**
**Settings** ← **Variables and Secrets** ← **Add**
- `ADMIN_USER` = `admin`
- `ADMIN_PASS` = `SmartBonus@2026` ← خليه **Secret**، ويُفضّل تغيّره لباسورد خاص بيك

**6) أعد النشر**
**Deployments** ← آخر deployment ← **Retry deployment**، علشان الـ binding والمتغيرات يشتغلوا.

**7) جرّب**
- افتح الموقع وسجّل بإيميل تجريبي
- افتح `yoursite.com/admin` وادخل باليوزر والباسورد، هتلاقي التسجيل، وتقدر تنزّل الكل CSV
- وتقدر كمان تشوف البيانات من Cloudflare نفسها: D1 ← `smartbonus-waitlist` ← **Console** ← اكتب:
  `SELECT * FROM waitlist ORDER BY id DESC;`

## الفيديو
- الفيديو جوه الموقع نفسه: `public/assets/video/smartbonus-intro.mp4` (حجمه 3.5MB، 720p).
- لحد ما صورة الفيديو تظهر، بتظهر شاشة تحميل فيها اللوجو بيلف. ولما الزائر يدوس تشغيل، بتفضل ظاهرة لحد ما الفيديو يبدأ.
- الملفات الثابتة على Cloudflare Pages مش بتتحسب عليها باندويدث، والحد الأقصى للملف الواحد 25MB، فمش محتاج R2 دلوقتي.
- لو حبيت تحطه على R2 بعدين (لو بقى عندك أكتر من نسخة أو جودة أعلى): ارفعه على bucket عام، وغيّر سطر واحد في `public/index.html`:
  `data-src="/assets/video/smartbonus-intro.mp4"` ← حط لينك الـ R2.
- لتغيير الفيديو: بدّل الملف بنفس الاسم، وبدّل `poster.jpg` (صورة الغلاف).

## اللوجو
اللوجو الحالي (الكبسولة) مؤقت. بدّل الملفين دول بلوجو Smart Bonus الحقيقي (SVG):
- `public/assets/img/logo-mark.svg`
- `public/assets/img/favicon.svg`

## الحماية
- بيانات الأدمن مش موجودة في الكود خالص، بتتقرا من متغيرات Cloudflare بس.
- صفحة `/admin` و`/api/` مقفولين قدام محركات البحث (`robots.txt` و`_headers`).
- فيه حقل مخفي (honeypot) بيصطاد البوتات، والسيرفر بيتحقق من الإيميل والرقم تاني حتى لو حد تخطّى الصفحة.
