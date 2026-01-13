-- Function to automatically create profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'traveler'),
    NOW()
  );
  
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
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to increment offer views
CREATE OR REPLACE FUNCTION public.increment_offer_views(offer_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE offers
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = offer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update agency offer count
CREATE OR REPLACE FUNCTION public.update_agency_offer_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE agencies
    SET offer_count = COALESCE(offer_count, 0) + 1
    WHERE id = NEW.agency_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE agencies
    SET offer_count = GREATEST(COALESCE(offer_count, 1) - 1, 0)
    WHERE id = OLD.agency_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and create offer count triggers
DROP TRIGGER IF EXISTS on_offer_created ON offers;
CREATE TRIGGER on_offer_created
  AFTER INSERT ON offers
  FOR EACH ROW EXECUTE FUNCTION public.update_agency_offer_count();

DROP TRIGGER IF EXISTS on_offer_deleted ON offers;
CREATE TRIGGER on_offer_deleted
  AFTER DELETE ON offers
  FOR EACH ROW EXECUTE FUNCTION public.update_agency_offer_count();
