-- =============================================
-- FIX OFFER COUNT TRACKING
-- Auto-update offer_count in agencies table
-- =============================================

-- Function to update offer count
CREATE OR REPLACE FUNCTION update_agency_offer_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update offer_count for the affected agency
  UPDATE public.agencies
  SET offer_count = (
    SELECT COUNT(*)
    FROM public.offers
    WHERE agency_id = COALESCE(NEW.agency_id, OLD.agency_id)
      AND active = true
  )
  WHERE id = COALESCE(NEW.agency_id, OLD.agency_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trigger_offer_count_insert ON public.offers;
DROP TRIGGER IF EXISTS trigger_offer_count_update ON public.offers;
DROP TRIGGER IF EXISTS trigger_offer_count_delete ON public.offers;

-- Trigger for INSERT
CREATE TRIGGER trigger_offer_count_insert
AFTER INSERT ON public.offers
FOR EACH ROW
EXECUTE FUNCTION update_agency_offer_count();

-- Trigger for UPDATE (when active status changes)
CREATE TRIGGER trigger_offer_count_update
AFTER UPDATE OF active ON public.offers
FOR EACH ROW
WHEN (OLD.active IS DISTINCT FROM NEW.active)
EXECUTE FUNCTION update_agency_offer_count();

-- Trigger for DELETE
CREATE TRIGGER trigger_offer_count_delete
AFTER DELETE ON public.offers
FOR EACH ROW
EXECUTE FUNCTION update_agency_offer_count();

-- Fix existing counts (one-time correction)
UPDATE public.agencies
SET offer_count = (
  SELECT COUNT(*)
  FROM public.offers
  WHERE offers.agency_id = agencies.id
    AND offers.active = true
);

-- Helper functions for manual count updates (fallback)
CREATE OR REPLACE FUNCTION increment_offer_count(agency_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.agencies
  SET offer_count = offer_count + 1
  WHERE id = agency_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_offer_count(agency_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.agencies
  SET offer_count = GREATEST(offer_count - 1, 0)
  WHERE id = agency_id;
END;
$$ LANGUAGE plpgsql;

-- Refresh all counts to ensure accuracy
CREATE OR REPLACE FUNCTION refresh_all_offer_counts()
RETURNS void AS $$
BEGIN
  UPDATE public.agencies
  SET offer_count = (
    SELECT COUNT(*)
    FROM public.offers
    WHERE offers.agency_id = agencies.id
      AND offers.active = true
  );
END;
$$ LANGUAGE plpgsql;
