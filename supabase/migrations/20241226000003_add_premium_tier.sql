-- Add 'premium' to partner_tier CHECK constraint
-- This requires dropping and recreating the constraint

-- Drop the existing check constraint
ALTER TABLE food_partners DROP CONSTRAINT IF EXISTS food_partners_partner_tier_check;

-- Add the new check constraint with premium tier
ALTER TABLE food_partners ADD CONSTRAINT food_partners_partner_tier_check
  CHECK (partner_tier IN ('free', 'partner', 'partner_plus', 'premium'));
