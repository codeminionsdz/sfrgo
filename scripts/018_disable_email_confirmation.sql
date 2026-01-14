-- =============================================
-- DISABLE EMAIL CONFIRMATION REQUIREMENT
-- =============================================
-- This script ensures users are auto-confirmed upon signup
-- without requiring email verification clicks.

-- Update the trigger function to auto-confirm users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile automatically
  INSERT INTO public.profiles (id, email, name, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'traveler'),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- If agency role, create agency record
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'traveler') = 'agency' THEN
    INSERT INTO public.agencies (
      owner_id,
      name,
      slug,
      description,
      location,
      status,
      subscription_status,
      subscription_plan,
      offer_limit,
      offer_count,
      joined_date,
      created_at
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'agency_name', 'New Agency'),
      lower(regexp_replace(COALESCE(NEW.raw_user_meta_data->>'agency_name', 'agency-' || substr(NEW.id::text, 1, 8)), '[^a-z0-9]+', '-', 'gi')),
      'Welcome to our travel agency',
      'Not specified',
      'pending',
      'none',
      NULL,
      0,
      0,
      CURRENT_DATE,
      NOW()
    )
    ON CONFLICT (owner_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger is active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- INSTRUCTIONS FOR SUPABASE DASHBOARD
-- =============================================
-- To complete the setup, you must configure the following in your Supabase Dashboard:
--
-- 1. Go to Authentication > Settings
-- 2. Under "Email Auth", DISABLE "Enable email confirmations"
-- 3. This ensures users can sign in immediately without clicking an email link
--
-- URL: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/auth/providers
--
-- =============================================
-- SECURITY CONSIDERATIONS
-- =============================================
-- With email confirmation disabled:
-- - Users can create accounts with any email (even if they don't own it)
-- - Rely on other security measures:
--   * Admin approval for agencies
--   * Subscription validation
--   * Role-based access control (RLS policies)
--   * Rate limiting on signups (implement in middleware if needed)
-- 
-- This is intentional for frictionless UX, but consider:
-- - Adding additional verification for sensitive operations
-- - Implementing fraud detection
-- - Monitoring for abuse patterns
