-- =============================================
-- SCRIPT 017: Add Umrah & Hajj Support
-- =============================================
-- Add offer_type to support Travel, Umrah, and Hajj
-- Add additional fields for religious journeys
-- =============================================

-- Add offer_type enum and column
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'offer_type') THEN
    CREATE TYPE offer_type AS ENUM ('travel', 'umrah', 'hajj');
  END IF;
END $$;

ALTER TABLE public.offers
ADD COLUMN IF NOT EXISTS offer_type offer_type DEFAULT 'travel' NOT NULL;

-- Add Umrah/Hajj specific fields
ALTER TABLE public.offers
ADD COLUMN IF NOT EXISTS season TEXT,
ADD COLUMN IF NOT EXISTS accommodation_details TEXT,
ADD COLUMN IF NOT EXISTS transport_details TEXT,
ADD COLUMN IF NOT EXISTS religious_program TEXT[];

-- Add index for offer_type filtering
CREATE INDEX IF NOT EXISTS idx_offers_offer_type ON public.offers(offer_type);
CREATE INDEX IF NOT EXISTS idx_offers_type_active ON public.offers(offer_type, active) WHERE active = true;

-- Note: Verification of agencies for Umrah/Hajj is enforced by the trigger below
-- (CHECK constraints cannot use subqueries in PostgreSQL)

-- Update trigger to validate Umrah/Hajj requirements
CREATE OR REPLACE FUNCTION validate_umrah_hajj_offer()
RETURNS TRIGGER AS $$
BEGIN
  -- If offer is Umrah or Hajj, ensure agency is verified
  IF NEW.offer_type IN ('umrah', 'hajj') THEN
    IF NOT EXISTS (
      SELECT 1 FROM agencies 
      WHERE id = NEW.agency_id 
      AND verified = true
    ) THEN
      RAISE EXCEPTION 'Only verified agencies can create Umrah and Hajj offers';
    END IF;
    
    -- Ensure required fields are filled
    IF NEW.season IS NULL OR NEW.season = '' THEN
      RAISE EXCEPTION 'Season is required for Umrah and Hajj offers';
    END IF;
    
    IF NEW.accommodation_details IS NULL OR NEW.accommodation_details = '' THEN
      RAISE EXCEPTION 'Accommodation details are required for Umrah and Hajj offers';
    END IF;
    
    IF NEW.transport_details IS NULL OR NEW.transport_details = '' THEN
      RAISE EXCEPTION 'Transport details are required for Umrah and Hajj offers';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_umrah_hajj_trigger ON public.offers;
CREATE TRIGGER validate_umrah_hajj_trigger
  BEFORE INSERT OR UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION validate_umrah_hajj_offer();

-- Add comment for documentation
COMMENT ON COLUMN public.offers.offer_type IS 'Type of offer: travel (regular travel), umrah (Umrah pilgrimage), hajj (Hajj pilgrimage)';
COMMENT ON COLUMN public.offers.season IS 'Season/period for Umrah or Hajj (e.g., Ramadan, Hajj 2026)';
COMMENT ON COLUMN public.offers.accommodation_details IS 'Detailed accommodation information for religious journeys';
COMMENT ON COLUMN public.offers.transport_details IS 'Detailed transport information for religious journeys';
COMMENT ON COLUMN public.offers.religious_program IS 'Array of religious program activities and schedules';
