-- Update activities table to include 'shopping' activity type
-- This requires dropping and recreating the constraint

-- Drop the existing check constraint
ALTER TABLE activities DROP CONSTRAINT IF EXISTS activities_activity_type_check;

-- Add the new check constraint with shopping type
ALTER TABLE activities ADD CONSTRAINT activities_activity_type_check
  CHECK (activity_type IN ('lecture', 'workshop', 'charity', 'community', 'youth', 'sports', 'shopping', 'other'));
