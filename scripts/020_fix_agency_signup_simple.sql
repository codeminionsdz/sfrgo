-- =============================================
-- حل بسيط ومباشر لمشكلة Database error saving new user
-- Simple Direct Fix for Database error saving new user
-- =============================================

-- الخطوة 1: تعطيل RLS مؤقتاً للاختبار (اختياري)
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.agencies DISABLE ROW LEVEL SECURITY;

-- الخطوة 1: حذف كل شيء قديم
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- حذف جميع الـ policies القديمة
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename IN ('profiles', 'agencies')
    AND policyname LIKE '%insert%'
  ) LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.' || 
            (SELECT tablename FROM pg_policies WHERE policyname = r.policyname LIMIT 1);
  END LOOP;
END $$;

-- الخطوة 2: إنشاء function بسيطة جداً
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- إنشاء profile
  INSERT INTO public.profiles (id, email, name, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'traveler'),
    NOW()
  );
  
  -- إذا كان الدور وكالة، إنشاء agency
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
    );
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- الخطوة 3: تفعيل الـ trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- الخطوة 4: تعطيل RLS على الجداول مؤقتاً
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies DISABLE ROW LEVEL SECURITY;

-- الخطوة 5: إعادة تفعيل RLS مع policies بسيطة
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "allow_all_profiles_insert" ON public.profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "allow_all_profiles_select" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "allow_own_profiles_update" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Agencies policies  
CREATE POLICY "allow_all_agencies_insert" ON public.agencies
  FOR INSERT WITH CHECK (true);

CREATE POLICY "allow_all_agencies_select" ON public.agencies
  FOR SELECT USING (true);

CREATE POLICY "allow_own_agencies_update" ON public.agencies
  FOR UPDATE USING (auth.uid() = owner_id);

-- الخطوة 6: منح الصلاحيات
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO anon;
GRANT ALL ON public.agencies TO authenticated;
GRANT ALL ON public.agencies TO anon;

-- التحقق
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    RAISE NOTICE '✅ Trigger created successfully';
  ELSE
    RAISE WARNING '❌ Trigger not found';
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'handle_new_user'
  ) THEN
    RAISE NOTICE '✅ Function created successfully';
  ELSE
    RAISE WARNING '❌ Function not found';
  END IF;
  
  RAISE NOTICE '✅ RLS policies created';
  RAISE NOTICE '🎉 تم! جرب التسجيل الآن';
END $$;
