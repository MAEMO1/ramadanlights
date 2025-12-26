-- Create shop_partners table for Ramadan shop directory
CREATE TABLE shop_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Basic Information
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE,
  description TEXT,

  -- Location
  address VARCHAR(300) NOT NULL,
  city VARCHAR(100) NOT NULL DEFAULT 'Gent',
  postal_code VARCHAR(10),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Category
  category VARCHAR(50) NOT NULL CHECK (category IN ('decor', 'clothing', 'spiritual', 'gifts', 'beauty', 'kids', 'tech', 'other')),

  -- Partner Tier
  partner_tier VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (partner_tier IN ('free', 'partner', 'partner_plus', 'premium')),
  tier_expires_at TIMESTAMPTZ,

  -- Ramadan Special (voor betaalde tiers)
  ramadan_special TEXT,
  ramadan_special_discount VARCHAR(50),

  -- Contact Information
  contact_name VARCHAR(100) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20),

  -- Links
  website_url VARCHAR(500),
  facebook_url VARCHAR(500),
  instagram_url VARCHAR(500),

  -- Images
  logo_url VARCHAR(500),
  cover_image_url VARCHAR(500),

  -- Opening Hours (JSON format)
  opening_hours JSONB,

  -- Status & Approval
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approval_token UUID DEFAULT gen_random_uuid() NOT NULL,
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT
);

-- Create indexes for common queries
CREATE INDEX idx_shop_partners_status ON shop_partners(status);
CREATE INDEX idx_shop_partners_category ON shop_partners(category);
CREATE INDEX idx_shop_partners_partner_tier ON shop_partners(partner_tier);
CREATE INDEX idx_shop_partners_city ON shop_partners(city);
CREATE INDEX idx_shop_partners_approval_token ON shop_partners(approval_token);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_shop_partners_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_shop_partners_updated_at
    BEFORE UPDATE ON shop_partners
    FOR EACH ROW
    EXECUTE FUNCTION update_shop_partners_updated_at();

-- Enable Row Level Security
ALTER TABLE shop_partners ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read approved shop partners
CREATE POLICY "Anyone can read approved shop partners"
ON shop_partners FOR SELECT
USING (status = 'approved');

-- Policy: Anyone can insert (submit) shop partners
CREATE POLICY "Anyone can submit shop partners"
ON shop_partners FOR INSERT
WITH CHECK (true);

-- Policy: Service role can do everything
CREATE POLICY "Service role has full access to shop partners"
ON shop_partners FOR ALL
USING (auth.role() = 'service_role');
