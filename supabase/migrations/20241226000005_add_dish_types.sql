-- Add dish_types column to food_partners table as a JSONB array
-- This allows filtering by dish type (e.g., burgers, pizza, kebab)
ALTER TABLE food_partners ADD COLUMN IF NOT EXISTS dish_types JSONB DEFAULT '[]'::jsonb;

-- Create index for dish_types queries
CREATE INDEX IF NOT EXISTS idx_food_partners_dish_types ON food_partners USING gin(dish_types);
