-- =============================================
-- CLEANUP: Remove demo/test agencies and offers
-- Run this to clean up test data
-- =============================================

-- Delete test offers first (due to foreign key)
DELETE FROM public.offers 
WHERE agency_id IN (
  SELECT id FROM public.agencies 
  WHERE slug LIKE '%demo%' 
     OR slug LIKE '%test%'
     OR name LIKE '%Test%'
     OR name LIKE '%Demo%'
);

-- Delete test agencies
DELETE FROM public.agencies 
WHERE slug LIKE '%demo%' 
   OR slug LIKE '%test%'
   OR name LIKE '%Test%'
   OR name LIKE '%Demo%';

-- Refresh offer counts after cleanup
SELECT refresh_all_offer_counts();
