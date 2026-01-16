-- Triggers and Functions for SAFRGO

-- =============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar, role, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar', '/placeholder.svg?height=100&width=100'),
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
      rating,
      review_count,
      verified,
      specialties,
      follower_count,
      offer_count,
      response_time,
      joined_date,
      status,
      subscription_status,
      subscription_plan,
      offer_limit,
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
      '{}',
      0,
      0,
      '< 24 hours',
      CURRENT_DATE,
      'pending',
      'none',
      NULL,
      0,
      NOW(),
      NOW()
    )
    ON CONFLICT (owner_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- UPDATE TIMESTAMPS
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply to tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_agencies_updated_at ON public.agencies;
CREATE TRIGGER update_agencies_updated_at
  BEFORE UPDATE ON public.agencies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_offers_updated_at ON public.offers;
CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- UPDATE OFFER COUNT ON AGENCY
-- =============================================
CREATE OR REPLACE FUNCTION public.update_agency_offer_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.agencies SET offer_count = offer_count + 1 WHERE id = NEW.agency_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.agencies SET offer_count = offer_count - 1 WHERE id = OLD.agency_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS update_offer_count ON public.offers;
CREATE TRIGGER update_offer_count
  AFTER INSERT OR DELETE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_agency_offer_count();

-- =============================================
-- UPDATE SAVED COUNT ON OFFER
-- =============================================
CREATE OR REPLACE FUNCTION public.update_offer_saved_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.offers SET saved_count = saved_count + 1 WHERE id = NEW.offer_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.offers SET saved_count = saved_count - 1 WHERE id = OLD.offer_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS update_saved_count ON public.saved_offers;
CREATE TRIGGER update_saved_count
  AFTER INSERT OR DELETE ON public.saved_offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_offer_saved_count();

-- =============================================
-- UPDATE FOLLOWER COUNT ON AGENCY
-- =============================================
CREATE OR REPLACE FUNCTION public.update_agency_follower_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.agencies SET follower_count = follower_count + 1 WHERE id = NEW.agency_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.agencies SET follower_count = follower_count - 1 WHERE id = OLD.agency_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS update_follower_count ON public.followed_agencies;
CREATE TRIGGER update_follower_count
  AFTER INSERT OR DELETE ON public.followed_agencies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_agency_follower_count();
