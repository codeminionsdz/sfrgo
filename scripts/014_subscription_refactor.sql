-- =============================================
-- SUBSCRIPTION SYSTEM REFACTOR
-- Professional pricing with annual plans in DZD
-- =============================================

-- Update subscription plan values
ALTER TABLE public.agencies 
DROP CONSTRAINT IF EXISTS agencies_subscription_plan_check;

ALTER TABLE public.agencies 
ADD CONSTRAINT agencies_subscription_plan_check 
CHECK (subscription_plan IN ('starter', 'pro', 'business'));

-- Add new subscription fields
ALTER TABLE public.agencies 
ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS subscription_currency TEXT DEFAULT 'DZD',
ADD COLUMN IF NOT EXISTS subscription_period TEXT DEFAULT 'annual';

-- Update offer limits for new plans
-- Starter: 10 offers
-- Pro: 50 offers  
-- Business: 999 offers (effectively unlimited)

-- Create subscription history table for audit trail
CREATE TABLE IF NOT EXISTS public.subscription_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'DZD',
  period TEXT DEFAULT 'annual',
  status TEXT NOT NULL,
  receipt_url TEXT,
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id),
  review_notes TEXT,
  started_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_subscription_history_agency ON public.subscription_history(agency_id);
CREATE INDEX IF NOT EXISTS idx_subscription_history_status ON public.subscription_history(status);

-- Update existing agencies with default values if needed
UPDATE public.agencies 
SET subscription_currency = 'DZD',
    subscription_period = 'annual'
WHERE subscription_currency IS NULL 
   OR subscription_period IS NULL;

-- Function to get offer limit based on plan
CREATE OR REPLACE FUNCTION get_offer_limit(plan_name TEXT)
RETURNS INTEGER AS $$
BEGIN
  CASE plan_name
    WHEN 'starter' THEN RETURN 10;
    WHEN 'pro' THEN RETURN 50;
    WHEN 'business' THEN RETURN 999;
    ELSE RETURN 0;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update offer_limit when subscription_plan changes
CREATE OR REPLACE FUNCTION update_offer_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.subscription_plan IS DISTINCT FROM OLD.subscription_plan THEN
    NEW.offer_limit := get_offer_limit(NEW.subscription_plan);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_offer_limit ON public.agencies;
CREATE TRIGGER trigger_update_offer_limit
  BEFORE UPDATE ON public.agencies
  FOR EACH ROW
  EXECUTE FUNCTION update_offer_limit();
