# حل سريع لمشكلة "database error saving new user"

## المشكلة
عند محاولة إنشاء حساب وكالة، تظهر رسالة خطأ: **"database error saving new user"**

## الحل السريع (3 دقائق)

### 1️⃣ تشغيل SQL Script
افتح **Supabase SQL Editor** ونفّذ:
```bash
scripts/019_fix_agency_signup.sql
```

أو انسخ والصق المحتوى مباشرة في SQL Editor واضغط RUN.

### 2️⃣ تعطيل Email Confirmation
1. اذهب إلى: `Authentication → Settings`
2. ابحث عن: **"Enable email confirmations"**
3. تأكد من أنها **معطّلة (OFF)**

### 3️⃣ اختبار التسجيل
جرّب إنشاء حساب وكالة جديد:
1. اذهب إلى صفحة التسجيل
2. اختر **Agency**
3. أدخل البيانات
4. اضغط **Create account**

يجب أن يتم:
- ✅ إنشاء المستخدم تلقائياً
- ✅ إنشاء Profile تلقائياً
- ✅ إنشاء Agency تلقائياً
- ✅ التحويل إلى dashboard الوكالة

## ما الذي تم إصلاحه؟

### قبل الإصلاح ❌
- الكود يحاول إنشاء agency من مكانين مختلفين
- الـ trigger لا يتضمن جميع الأعمدة المطلوبة
- حدوث race condition وتعارض في البيانات

### بعد الإصلاح ✅
- الـ trigger فقط يُنشئ profile و agency
- جميع الأعمدة المطلوبة موجودة
- إزالة الكود المتكرر من signup form
- إزالة الكود المتكرر من auth callback

## الملفات المعدّلة

### Frontend
- ✅ `components/auth/signup-form.tsx` - إزالة إنشاء agency يدوياً
- ✅ `app/auth/callback/route.ts` - إزالة إنشاء agency يدوياً

### Database
- ✅ `scripts/003_create_triggers.sql` - إضافة إنشاء agency للـ trigger
- ✅ `scripts/008_create_auth_functions.sql` - تحديث جميع الأعمدة
- ✅ `scripts/018_disable_email_confirmation.sql` - تحديث جميع الأعمدة
- ✅ `scripts/019_fix_agency_signup.sql` - الإصلاح النهائي الكامل

## التحقق من نجاح الإصلاح

في Supabase SQL Editor:

```sql
-- التحقق من الـ trigger
SELECT tgname, tgenabled 
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- التحقق من آخر وكالة تم إنشاؤها
SELECT 
  p.id, p.name, p.email, p.role,
  a.id as agency_id, a.name as agency_name, 
  a.status, a.subscription_status
FROM profiles p
LEFT JOIN agencies a ON a.owner_id = p.id
WHERE p.role = 'agency'
ORDER BY p.created_at DESC
LIMIT 5;
```

## المساعدة

إذا استمرت المشكلة:
1. راجع ملف التوثيق الكامل: `docs/AGENCY_SIGNUP_FIX.md`
2. تأكد من تشغيل script الإصلاح بنجاح
3. تحقق من console logs في المتصفح
4. تحقق من Supabase logs

## ملاحظات
- **الأمان**: مع تعطيل email confirmation، أضف verification إضافية للعمليات الحساسة
- **RLS Policies**: تأكد من أن policies تسمح بإنشاء السجلات
- **Testing**: اختبر مع emails جديدة لتجنب conflicts
