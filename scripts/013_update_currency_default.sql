-- =============================================
-- Update Currency Default to DZD
-- =============================================

-- Change default currency to DZD (Algerian Dinar)
ALTER TABLE public.offers 
ALTER COLUMN currency SET DEFAULT 'DZD';

-- Update existing offers that have USD to DZD if needed
-- (Optional - uncomment if you want to convert existing data)
-- UPDATE public.offers 
-- SET currency = 'DZD' 
-- WHERE currency = 'USD';
