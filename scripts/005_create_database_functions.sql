-- Function to increment offer view count
CREATE OR REPLACE FUNCTION increment_offer_views(offer_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE offers
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = offer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can create offer (agency subscription limits)
CREATE OR REPLACE FUNCTION can_create_offer(p_agency_id UUID)
RETURNS boolean AS $$
DECLARE
  v_offer_count INTEGER;
  v_offer_limit INTEGER;
  v_subscription_status TEXT;
BEGIN
  SELECT offer_count, offer_limit, subscription_status
  INTO v_offer_count, v_offer_limit, v_subscription_status
  FROM agencies
  WHERE id = p_agency_id;
  
  -- Check if agency has active subscription
  IF v_subscription_status != 'active' THEN
    RETURN FALSE;
  END IF;
  
  -- Check if within limit
  IF v_offer_count >= v_offer_limit THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment agency offer count after creating offer
CREATE OR REPLACE FUNCTION increment_agency_offer_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE agencies
  SET offer_count = COALESCE(offer_count, 0) + 1
  WHERE id = NEW.agency_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for offer creation
DROP TRIGGER IF EXISTS trigger_increment_offer_count ON offers;
CREATE TRIGGER trigger_increment_offer_count
AFTER INSERT ON offers
FOR EACH ROW
EXECUTE FUNCTION increment_agency_offer_count();

-- Function to decrement agency offer count after deleting offer
CREATE OR REPLACE FUNCTION decrement_agency_offer_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE agencies
  SET offer_count = GREATEST(COALESCE(offer_count, 1) - 1, 0)
  WHERE id = OLD.agency_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for offer deletion
DROP TRIGGER IF EXISTS trigger_decrement_offer_count ON offers;
CREATE TRIGGER trigger_decrement_offer_count
AFTER DELETE ON offers
FOR EACH ROW
EXECUTE FUNCTION decrement_agency_offer_count();

-- Function to update follower count
CREATE OR REPLACE FUNCTION update_agency_follower_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE agencies
    SET follower_count = COALESCE(follower_count, 0) + 1
    WHERE id = NEW.agency_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE agencies
    SET follower_count = GREATEST(COALESCE(follower_count, 1) - 1, 0)
    WHERE id = OLD.agency_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for follower count
DROP TRIGGER IF EXISTS trigger_update_follower_count ON followed_agencies;
CREATE TRIGGER trigger_update_follower_count
AFTER INSERT OR DELETE ON followed_agencies
FOR EACH ROW
EXECUTE FUNCTION update_agency_follower_count();

-- Function to check admin role
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS boolean AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role
  FROM profiles
  WHERE id = user_id;
  
  RETURN v_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user owns agency
CREATE OR REPLACE FUNCTION owns_agency(user_id UUID, p_agency_id UUID)
RETURNS boolean AS $$
DECLARE
  v_owner_id UUID;
BEGIN
  SELECT owner_id INTO v_owner_id
  FROM agencies
  WHERE id = p_agency_id;
  
  RETURN v_owner_id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_offer_views TO authenticated;
GRANT EXECUTE ON FUNCTION can_create_offer TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION owns_agency TO authenticated;
