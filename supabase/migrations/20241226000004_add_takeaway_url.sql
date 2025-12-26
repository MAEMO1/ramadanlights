-- Add takeaway_url column to food_partners table
ALTER TABLE food_partners ADD COLUMN IF NOT EXISTS takeaway_url VARCHAR(500);
