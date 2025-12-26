-- Create activities table for community events
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Basic Information
  title VARCHAR(200) NOT NULL,
  description TEXT,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('lecture', 'workshop', 'charity', 'community', 'youth', 'sports', 'other')),

  -- Location
  location_name VARCHAR(200) NOT NULL,
  address VARCHAR(300) NOT NULL,
  city VARCHAR(100) NOT NULL DEFAULT 'Gent',
  postal_code VARCHAR(10),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Date & Time
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,

  -- Recurrence
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern VARCHAR(50) CHECK (recurrence_pattern IN ('daily', 'weekly', 'weekdays', 'weekends')),
  recurrence_end_date DATE,

  -- Capacity & Pricing
  capacity INTEGER,
  is_free BOOLEAN DEFAULT TRUE,
  price VARCHAR(50),

  -- Target Audience
  for_men BOOLEAN DEFAULT TRUE,
  for_women BOOLEAN DEFAULT TRUE,
  for_families BOOLEAN DEFAULT TRUE,
  for_youth BOOLEAN DEFAULT FALSE,

  -- Organizer Information
  organizer_name VARCHAR(100) NOT NULL,
  organizer_email VARCHAR(255) NOT NULL,
  organizer_phone VARCHAR(20),

  -- Links
  registration_url VARCHAR(500),
  website_url VARCHAR(500),
  facebook_url VARCHAR(500),
  instagram_url VARCHAR(500),

  -- Images
  cover_image_url VARCHAR(500),

  -- Status & Approval
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approval_token UUID DEFAULT gen_random_uuid() NOT NULL,
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT
);

-- Create indexes for common queries
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_activity_type ON activities(activity_type);
CREATE INDEX idx_activities_event_date ON activities(event_date);
CREATE INDEX idx_activities_city ON activities(city);
CREATE INDEX idx_activities_approval_token ON activities(approval_token);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_activities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_activities_updated_at
    BEFORE UPDATE ON activities
    FOR EACH ROW
    EXECUTE FUNCTION update_activities_updated_at();

-- Enable Row Level Security
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read approved activities
CREATE POLICY "Anyone can read approved activities"
ON activities FOR SELECT
USING (status = 'approved');

-- Policy: Anyone can insert (submit) activities
CREATE POLICY "Anyone can submit activities"
ON activities FOR INSERT
WITH CHECK (true);

-- Policy: Service role can do everything
CREATE POLICY "Service role has full access"
ON activities FOR ALL
USING (auth.role() = 'service_role');
