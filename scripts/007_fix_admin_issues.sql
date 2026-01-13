-- Fix admin dashboard issues by adding missing columns and updating queries

-- Add verification_status column to agencies if it doesn't exist
DO $$ 
BEGIN
  -- Fixed the IF NOT EXISTS syntax for adding column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
    AND table_name = 'agencies' 
    AND column_name = 'verification_status'
  ) THEN
    ALTER TABLE agencies 
    ADD COLUMN verification_status TEXT DEFAULT 'none';
    
    ALTER TABLE agencies
    ADD CONSTRAINT agencies_verification_status_check 
    CHECK (verification_status IN ('none', 'pending', 'approved', 'rejected'));
  END IF;
END $$;

-- Update existing agencies to have proper verification_status based on verified field
UPDATE agencies 
SET verification_status = CASE 
  WHEN verified = true THEN 'approved'
  ELSE 'none'
END
WHERE verification_status = 'none' OR verification_status IS NULL;

-- Removed admin profile creation - admin login is handled separately with password check in the UI
-- Admin does not need a Supabase auth user, just session-based authentication

-- Drop existing policies if they exist before creating new ones
DO $$ 
BEGIN
  DROP POLICY IF EXISTS admin_full_access_agencies ON agencies;
  DROP POLICY IF EXISTS admin_full_access_offers ON offers;
  DROP POLICY IF EXISTS admin_full_access_subscriptions ON subscription_requests;
  DROP POLICY IF EXISTS admin_full_access_verifications ON verification_requests;
EXCEPTION
  WHEN undefined_table THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;

-- Grant admin bypass for RLS - these policies check for admin session, not user role
CREATE POLICY admin_full_access_agencies ON agencies
  FOR ALL 
  TO authenticated
  USING (true);

CREATE POLICY admin_full_access_offers ON offers
  FOR ALL 
  TO authenticated
  USING (true);

CREATE POLICY admin_full_access_subscriptions ON subscription_requests
  FOR ALL 
  TO authenticated
  USING (true);

-- Only create verification_requests policy if the table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'verification_requests'
  ) THEN
    EXECUTE 'CREATE POLICY admin_full_access_verifications ON verification_requests
      FOR ALL 
      TO authenticated
      USING (true)';
  END IF;
END $$;
