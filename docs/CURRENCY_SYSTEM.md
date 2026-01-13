# نظام العملات المتعدد - SAFRGO

## نظرة عامة
تم تحديث نظام الأسعار في SAFRGO لدعم الدينار الجزائري (DZD) كعملة افتراضية، بالإضافة إلى العملات الأخرى.

## العملات المدعومة

### 1. الدينار الجزائري (DZD) - العملة الافتراضية ⭐
- الرمز: `DZD`
- الاسم بالعربية: **دج**
- التنسيق: `1,234 دج`
- مثال: `15,000 دج`

### 2. الدولار الأمريكي (USD)
- الرمز: `USD`
- الاسم بالعربية: **دولار**
- التنسيق: `$1,234`
- مثال: `$150`

### 3. الريال السعودي (SAR)
- الرمز: `SAR`
- الاسم بالعربية: **ريال سعودي**
- التنسيق: `1,234 ر.س`
- مثال: `5,000 ر.س`

### 4. الدرهم الإماراتي (AED)
- الرمز: `AED`
- الاسم بالعربية: **درهم إماراتي**
- التنسيق: `1,234 د.إ`
- مثال: `2,500 د.إ`

### 5. اليورو (EUR)
- الرمز: `EUR`
- الاسم بالعربية: **يورو**
- التنسيق: `€1,234`
- مثال: `€120`

## الاستخدام

### دالة formatPrice
دالة مساعدة لتنسيق الأسعار بشكل صحيح مع العملات المختلفة:

```typescript
import { formatPrice } from "@/lib/utils"

// استخدام مع الدينار الجزائري (الافتراضي)
formatPrice(15000) // ← "15,000 دج"
formatPrice(15000, 'DZD') // ← "15,000 دج"

// استخدام مع عملات أخرى
formatPrice(150, 'USD') // ← "$150"
formatPrice(5000, 'SAR') // ← "5,000 ر.س"
formatPrice(2500, 'AED') // ← "2,500 د.إ"
formatPrice(120, 'EUR') // ← "€120"
```

### في مكونات React

```tsx
import { formatPrice } from "@/lib/utils"

function OfferCard({ offer }) {
  return (
    <div>
      <p>{formatPrice(offer.price, offer.currency)}</p>
      
      {/* عرض السعر الأصلي والخصم */}
      {offer.original_price && (
        <>
          <span className="line-through">
            {formatPrice(offer.original_price, offer.currency)}
          </span>
          <span className="text-green-600">
            وفر {formatPrice(offer.original_price - offer.price, offer.currency)}
          </span>
        </>
      )}
    </div>
  )
}
```

## نموذج إنشاء العرض

تم تحديث نموذج إنشاء العرض لجعل الدينار الجزائري هو الخيار الأول:

```tsx
<select name="currency" defaultValue="DZD">
  <option value="DZD">دج (DZD)</option>
  <option value="USD">دولار (USD)</option>
  <option value="SAR">ريال سعودي (SAR)</option>
  <option value="AED">درهم إماراتي (AED)</option>
  <option value="EUR">يورو (EUR)</option>
</select>
```

## قاعدة البيانات

### تحديث العملة الافتراضية
```sql
-- تعيين DZD كعملة افتراضية للعروض الجديدة
ALTER TABLE public.offers 
ALTER COLUMN currency SET DEFAULT 'DZD';
```

### هيكل الجدول
```sql
CREATE TABLE offers (
  ...
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  currency TEXT DEFAULT 'DZD',
  ...
);
```

## الملفات المحدثة

### 1. دالة التنسيق
- ✅ `lib/utils.ts` - أضيفت دالة `formatPrice`

### 2. نموذج الإنشاء
- ✅ `components/agency/offer-form.tsx` - تحديث قائمة العملات

### 3. مكونات العرض
- ✅ `components/traveler/offer-details.tsx` - تفاصيل العرض
- ✅ `components/traveler/home.tsx` - الصفحة الرئيسية
- ✅ `components/traveler/explore.tsx` - صفحة الاستكشاف
- ✅ `components/traveler/saved.tsx` - العروض المحفوظة
- ✅ `components/traveler/agency-profile.tsx` - صفحة الوكالة
- ✅ `components/landing/featured-offers.tsx` - العروض المميزة
- ✅ `components/agency/offers-list.tsx` - قائمة عروض الوكالة
- ✅ `components/admin/offers-review.tsx` - مراجعة العروض للإدارة

### 4. قاعدة البيانات
- ✅ `scripts/013_update_currency_default.sql` - تحديث العملة الافتراضية

## أمثلة الاستخدام

### مثال 1: عرض سياحي بالدينار الجزائري
```typescript
const offer = {
  title: "رحلة إلى الصحراء الكبرى",
  price: 25000,
  currency: "DZD"
}

// العرض: "25,000 دج"
<p>{formatPrice(offer.price, offer.currency)}</p>
```

### مثال 2: عرض مع خصم
```typescript
const offer = {
  title: "عمرة رمضان",
  price: 150000,
  original_price: 180000,
  currency: "DZD"
}

// السعر الحالي: "150,000 دج"
// السعر الأصلي: "180,000 دج"
// الوفر: "30,000 دج"
```

### مثال 3: عروض بعملات مختلفة
```typescript
const offers = [
  { title: "رحلة داخلية", price: 20000, currency: "DZD" },
  { title: "دبي", price: 500, currency: "USD" },
  { title: "مكة", price: 3000, currency: "SAR" }
]

offers.map(offer => formatPrice(offer.price, offer.currency))
// ← ["20,000 دج", "$500", "3,000 ر.س"]
```

## التنسيق الإقليمي

تستخدم دالة `formatPrice` تنسيق `ar-DZ` (العربية - الجزائر) لعرض الأرقام:
- الفاصل الآلاف: `,` (فاصلة)
- مثال: `15000` ← `15,000`

## ملاحظات مهمة

1. **العملة الافتراضية**: DZD هو الخيار الافتراضي للعروض الجديدة
2. **التوافق**: جميع العروض القديمة بـ USD ستستمر في العمل
3. **التوسع**: يمكن إضافة عملات جديدة بسهولة في دالة `formatPrice`
4. **التنسيق**: الأرقام تُعرض دائمًا بتنسيق عربي (فاصلة للآلاف)

## الترحيل من USD إلى DZD

إذا أردت تحويل العروض الموجودة من USD إلى DZD:

```sql
-- تحويل جميع العروض بـ USD إلى DZD
-- (احذف التعليق فقط إذا كنت متأكداً)
UPDATE public.offers 
SET currency = 'DZD' 
WHERE currency = 'USD';
```

⚠️ **تحذير**: هذا التحويل لا يغير قيمة السعر، فقط العملة المعروضة.
