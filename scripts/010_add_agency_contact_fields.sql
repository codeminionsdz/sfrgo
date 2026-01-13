-- Add contact fields to agencies table
-- This script adds phone, email, and website fields to the agencies table

ALTER TABLE public.agencies 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS website TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.agencies.phone IS 'Agency contact phone number';
COMMENT ON COLUMN public.agencies.email IS 'Agency contact email address';
COMMENT ON COLUMN public.agencies.website IS 'Agency website URL';
