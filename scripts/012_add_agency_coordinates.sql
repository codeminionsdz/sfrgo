-- Add latitude and longitude fields to agencies table
-- This enables real location selection and display on maps

ALTER TABLE agencies 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add index for location queries (optional, for future geo queries)
CREATE INDEX IF NOT EXISTS idx_agencies_coordinates ON agencies(latitude, longitude);

-- Add comment for documentation
COMMENT ON COLUMN agencies.latitude IS 'Agency physical location latitude (set by agency owner)';
COMMENT ON COLUMN agencies.longitude IS 'Agency physical location longitude (set by agency owner)';
