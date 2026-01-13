# دليل سريع - نظام مشاركة العروض

## البدء السريع

### 1. تثبيت المكتبات المطلوبة ✅
```bash
pnpm add @vercel/og
```

### 2. إعداد متغيرات البيئة
أضف إلى `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

للإنتاج:
```env
NEXT_PUBLIC_SITE_URL=https://safrgo.com
```

### 3. اختبار النظام

#### اختبار توليد الصورة
افتح في المتصفح:
```
http://localhost:3000/api/og/offer/{offer-id}
```

يجب أن تظهر صورة 1200x630 بكسل.

#### اختبار Open Graph
1. افتح صفحة عرض: `/offers/{id}`
2. في Chrome DevTools → Network → Doc
3. ابحث عن `<meta property="og:image">`
4. انسخ الرابط واختبره في [Facebook Debugger](https://developers.facebook.com/tools/debug/)

---

## الاستخدام

### للوكالات
```tsx
// في لوحة التحكم
<ShareOfferButton
  offerId={offer.id}
  offerTitle={offer.title}
  variant="ghost"
  size="sm"
/>
```

### للمسافرين
```tsx
// في صفحة العرض
<ShareOfferButton
  offerId={offer.id}
  offerTitle={offer.title}
  variant="outline"
  size="icon"
/>
```

---

## الملفات المُحدَّثة

✅ **جديد**:
- `app/api/og/offer/[id]/route.tsx` - API لتوليد الصور
- `components/agency/share-offer-button.tsx` - مكون زر المشاركة
- `docs/OFFER_SHARING.md` - توثيق شامل
- `.env.example` - مثال لمتغيرات البيئة

✅ **مُحدَّث**:
- `app/(app)/offers/[id]/page.tsx` - Open Graph meta tags
- `components/agency/offers-list.tsx` - زر المشاركة في القائمة
- `components/traveler/offer-details.tsx` - زر المشاركة في التفاصيل
- `components/icons.tsx` - أيقونات Facebook و Instagram

---

## المنصات المدعومة

✅ **فيسبوك** - مشاركة مباشرة مع معاينة
✅ **واتساب** - رابط + عنوان
✅ **إنستغرام** - نسخ الرابط
✅ **Native Share** - للأجهزة المحمولة
✅ **نسخ الرابط** - للاستخدام العام
✅ **تحميل الصورة** - PNG عالي الدقة

---

## حل المشاكل السريع

### الصورة لا تظهر؟
```bash
# 1. تأكد من NEXT_PUBLIC_SITE_URL
echo $NEXT_PUBLIC_SITE_URL

# 2. أعد تشغيل dev server
pnpm dev

# 3. اختبر API يدوياً
curl http://localhost:3000/api/og/offer/{id}
```

### خطأ في النشر؟
```bash
# تأكد من build success
pnpm build

# اختبر production mode
pnpm start
```

---

## الخطوات التالية

📋 **لإكمال النظام**:
1. ✅ نشر التطبيق على Vercel
2. ✅ تحديث NEXT_PUBLIC_SITE_URL في Vercel
3. ✅ اختبار المشاركة على المنصات المختلفة
4. ⏳ إضافة إحصائيات المشاركة (قريباً)
5. ⏳ تخصيص تصميم الصور (قريباً)

---

## للمزيد

راجع التوثيق الشامل في: [`docs/OFFER_SHARING.md`](./OFFER_SHARING.md)
