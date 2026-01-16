# إصلاح مشكلة "database error saving new user" عند إنشاء حساب وكالة

## المشكلة
عند محاولة إنشاء حساب وكالة، كان يظهر خطأ "database error saving new user" بسبب:

1. **تعارض في إنشاء البيانات**: كان الكود يحاول إنشاء profile و agency بطريقتين مختلفتين:
   - من خلال database trigger تلقائي
   - من خلال الكود في signup form يدوياً
   
2. **أعمدة مفقودة**: الـ trigger لم يكن يتضمن جميع الأعمدة المطلوبة في جدول agencies

3. **Race Condition**: محاولة إنشاء نفس السجل من مكانين في نفس الوقت

## الحل المطبق

### 1. تحديث Database Triggers
تم تحديث جميع ملفات SQL triggers لتشمل جميع الأعمدة المطلوبة:

**الملفات المحدثة:**
- ✅ `scripts/018_disable_email_confirmation.sql`
- ✅ `scripts/008_create_auth_functions.sql`  
- ✅ `scripts/003_create_triggers.sql`

**الأعمدة المضافة:**
```sql
rating, review_count, verified, specialties, 
follower_count, offer_count, response_time, 
joined_date, status, subscription_status, 
subscription_plan, offer_limit, created_at, updated_at
```

### 2. تبسيط Signup Form
تم تبسيط `components/auth/signup-form.tsx` ليعتمد على الـ trigger فقط:

**قبل:**
```typescript
// كان يحاول إنشاء profile و agency يدوياً
if (!profile) {
  await supabase.from("profiles").insert(...)
  if (accountType === "agency") {
    await supabase.from("agencies").insert(...)
  }
}
```

**بعد:**
```typescript
// الآن فقط ينتظر قليلاً للسماح بتنفيذ الـ trigger
await new Promise(resolve => setTimeout(resolve, 1000))
router.push(redirectTo)
```

### 3. تنظيف Auth Callback
تم إزالة محاولة إنشاء agency يدوياً من `app/auth/callback/route.ts`

## كيفية تطبيق الإصلاح

### الخطوة 1: تشغيل SQL Scripts المحدثة
قم بتشغيل الـ scripts المحدثة في Supabase Dashboard بالترتيب:

```bash
# في Supabase SQL Editor
1. scripts/003_create_triggers.sql
2. scripts/008_create_auth_functions.sql  
3. scripts/018_disable_email_confirmation.sql
```

### الخطوة 2: التحقق من الإعدادات
تأكد من:
- ✅ Email confirmation معطل في Supabase Dashboard
- ✅ الـ trigger مفعّل على `auth.users`
- ✅ RLS policies مفعّلة بشكل صحيح

### الخطوة 3: اختبار التسجيل
1. جرّب إنشاء حساب وكالة جديد
2. يجب أن يتم إنشاء:
   - User في `auth.users`
   - Profile في `profiles`
   - Agency في `agencies`
3. التحويل التلقائي إلى `/agency` dashboard

## التحقق من نجاح الإصلاح

```sql
-- تحقق من الـ trigger
SELECT tgname, tgenabled 
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- تحقق من الـ function
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- تحقق من البيانات بعد التسجيل
SELECT 
  p.id, p.name, p.email, p.role,
  a.id as agency_id, a.name as agency_name, a.status
FROM profiles p
LEFT JOIN agencies a ON a.owner_id = p.id
WHERE p.role = 'agency'
ORDER BY p.created_at DESC
LIMIT 5;
```

## الفوائد
- ✅ لا مزيد من "database error saving new user"
- ✅ إنشاء تلقائي وموثوق للـ profiles و agencies
- ✅ كود أبسط وأسهل في الصيانة
- ✅ تجنب race conditions
- ✅ اتساق في البيانات

## ملاحظات مهمة
- الـ trigger يعمل تلقائياً عند إنشاء user جديد في `auth.users`
- لا حاجة لإنشاء profile أو agency يدوياً في الكود
- جميع البيانات الافتراضية تأتي من الـ trigger
- يمكن تحديث بيانات الوكالة لاحقاً من صفحة agency-setup

## التاريخ
- **التاريخ**: 16 يناير 2026
- **المشكلة**: database error عند إنشاء حساب وكالة
- **الحل**: توحيد إنشاء البيانات عبر database trigger فقط
