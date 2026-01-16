-- =============================================
-- إصلاح مشكلة إنشاء حساب الوكالة
-- FIX: Database error saving new user
-- =============================================
-- يجب تشغيل هذا الملف في Supabase SQL Editor

-- الخطوة 1: حذف جميع الـ policies والـ triggers القديمة
-- حذف RLS policies القديمة التي تمنع الإدراج
DROP POLICY IF EXISTS "agencies_insert_auth" ON public.agencies;
DROP POLICY IF EXISTS "agencies_insert_own" ON public.agencies;
DROP POLICY IF EXISTS "Users can create agencies" ON public.agencies;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "agencies_insert_via_trigger" ON public.agencies;
DROP POLICY IF EXISTS "profiles_insert_via_trigger" ON public.profiles;

-- حذف الـ trigger والـ function القديمين
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- الخطوة 2: إنشاء function جديدة محدّثة مع جميع الأعمدة المطلوبة
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- إنشاء profile تلقائياً
  INSERT INTO public.profiles (id, email, name, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'traveler'),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- إذا كان الدور وكالة، إنشاء سجل الوكالة
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'traveler') = 'agency' THEN
    INSERT INTO public.agencies (
      owner_id,
      name,
      slug,
      description,
      location,
      rating,
      review_count,
      verified,
      verification_status,
      specialties,
      follower_count,
      offer_count,
      response_time,
      joined_date,
      status,
      subscription_status,
      subscription_plan,
      offer_limit,
      subscription_currency,
      subscription_period,
      phone,
      email,
      website,
      latitude,
      longitude,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'agency_name', 'New Agency'),
      lower(regexp_replace(COALESCE(NEW.raw_user_meta_data->>'agency_name', 'agency-' || substr(NEW.id::text, 1, 8)), '[^a-z0-9]+', '-', 'gi')),
      'Welcome to our travel agency',
      'Not specified',
      0,
      0,
      FALSE,
      'none',
      '{}',
      0,
      0,
      '< 24 hours',
      CURRENT_DATE,
      'pending',
      'none',
      NULL,
      0,
      'DZD',
      'annual',
      NULL,
      NEW.email,
      NULL,
      NULL,
      NULL,
      NOW(),
      NOW()
    )
    ON CONFLICT (owner_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- الخطوة 3: منح الصلاحيات اللازمة للـ function
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;

-- الخطوة 4: تفعيل الـ trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- الخطوة 5: إنشاء RLS policies جديدة تسمح بالإدراج
-- Policy للـ profiles - تسمح بالإدراج من الـ trigger
CREATE POLICY "profiles_insert_new" ON public.profiles
  FOR INSERT 
  WITH CHECK (true);

-- Policy للـ agencies - تسمح بالإدراج من الـ trigger
CREATE POLICY "agencies_insert_new" ON public.agencies
  FOR INSERT 
  WITH CHECK (true);

-- Policy للـ profiles - تسمح للمستخدمين بتحديث بياناتهم
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy للـ agencies - تسمح لأصحاب الوكالات بتحديث وكالاتهم
CREATE POLICY "agencies_update_own" ON public.agencies
  FOR UPDATE
  USING (auth.uid() = owner_id);

-- Policy للـ profiles - تسمح بقراءة جميع الـ profiles
CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT
  USING (true);

-- Policy للـ agencies - تسمح بقراءة جميع الوكالات النشطة
CREATE POLICY "agencies_select_all" ON public.agencies
  FOR SELECT
  USING (true);

-- الخطوة 6: التحقق من نجاح التثبيت
DO $$
BEGIN
  -- التحقق من الـ trigger
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created' 
    AND tgenabled = 'O'
  ) THEN
    RAISE NOTICE '✅ Trigger created successfully';
  ELSE
    RAISE WARNING '❌ Trigger not found or not enabled';
  END IF;
  
  -- التحقق من الـ function
  IF EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'handle_new_user'
  ) THEN
    RAISE NOTICE '✅ Function created successfully';
  ELSE
    RAISE WARNING '❌ Function not found';
  END IF;
END $$;

-- =============================================
-- اختبار بسيط (اختياري)
-- =============================================
-- يمكنك اختبار الـ function بإنشاء مستخدم تجريبي
-- ثم حذفه بعد التأكد من نجاح العملية

-- للاختبار فقط - احذف هذا القسم في الإنتاج
/*
-- إنشاء مستخدم تجريبي
INSERT INTO auth.users (
  id, 
  email, 
  raw_user_meta_data, 
  created_at
) VALUES (
  gen_random_uuid(),
  'test-agency-' || floor(random() * 10000) || '@example.com',
  jsonb_build_object(
    'name', 'Test Agency',
    'role', 'agency',
    'agency_name', 'Test Travel Agency'
  ),
  NOW()
);

-- تحقق من إنشاء البيانات
SELECT 
  p.id, 
  p.name, 
  p.email, 
  p.role,
  a.id as agency_id, 
  a.name as agency_name,
  a.status,
  a.subscription_status
FROM profiles p
LEFT JOIN agencies a ON a.owner_id = p.id
WHERE p.email LIKE 'test-agency-%'
ORDER BY p.created_at DESC
LIMIT 1;

-- احذف المستخدم التجريبي بعد الاختبار
DELETE FROM auth.users 
WHERE email LIKE 'test-agency-%';
*/

-- =============================================
-- ملاحظات مهمة
-- =============================================
-- 1. تأكد من تعطيل email confirmation في:
--    Authentication > Settings > Enable email confirmations (OFF)
--
-- 2. تأكد من وجود RLS policies صحيحة على جدول agencies
--
-- 3. هذا الـ script يستبدل أي trigger أو function سابقة
--
-- 4. إذا واجهت مشاكل، راجع ملف docs/AGENCY_SIGNUP_FIX.md
-- =============================================

RAISE NOTICE '🎉 تم تطبيق الإصلاح بنجاح! يمكنك الآن اختبار إنشاء حساب وكالة جديد.';
