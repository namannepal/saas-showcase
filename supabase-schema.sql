-- SaaS Showcase Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create saas_products table
CREATE TABLE IF NOT EXISTS saas_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL UNIQUE,
  image_url TEXT, -- Cloudinary URL
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}', -- Store fonts, colors, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create showcase_pages table
CREATE TABLE IF NOT EXISTS showcase_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  saas_id UUID NOT NULL REFERENCES saas_products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  page_url TEXT NOT NULL,
  screenshot_url TEXT, -- Cloudinary URL
  page_type TEXT NOT NULL CHECK (page_type IN ('landing', 'pricing', 'features', 'about', 'dashboard', 'other')),
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}', -- Store fonts, colors, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(saas_id, page_url)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_saas_products_category ON saas_products(category);
CREATE INDEX IF NOT EXISTS idx_saas_products_featured ON saas_products(featured);
CREATE INDEX IF NOT EXISTS idx_saas_products_created_at ON saas_products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saas_products_tags ON saas_products USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_showcase_pages_saas_id ON showcase_pages(saas_id);
CREATE INDEX IF NOT EXISTS idx_showcase_pages_page_type ON showcase_pages(page_type);
CREATE INDEX IF NOT EXISTS idx_showcase_pages_created_at ON showcase_pages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_showcase_pages_tags ON showcase_pages USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_showcase_pages_slug ON showcase_pages(slug);

-- Create function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
BEGIN
  -- Convert to lowercase, replace spaces and special chars with hyphens
  slug := lower(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'));
  slug := regexp_replace(slug, '\s+', '-', 'g');
  slug := regexp_replace(slug, '-+', '-', 'g');
  slug := trim(both '-' from slug);
  RETURN slug;
END;
$$ LANGUAGE plpgsql;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to auto-generate slug on insert if not provided
CREATE OR REPLACE FUNCTION set_showcase_page_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    base_slug := generate_slug(NEW.title);
    final_slug := base_slug;
    
    -- Check for uniqueness and add counter if needed
    WHILE EXISTS (SELECT 1 FROM showcase_pages WHERE slug = final_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    END LOOP;
    
    NEW.slug := final_slug;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_saas_products_updated_at
  BEFORE UPDATE ON saas_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_showcase_pages_updated_at
  BEFORE UPDATE ON showcase_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to auto-generate slug
CREATE TRIGGER trigger_set_showcase_page_slug
  BEFORE INSERT OR UPDATE ON showcase_pages
  FOR EACH ROW
  EXECUTE FUNCTION set_showcase_page_slug();

-- Enable Row Level Security (RLS)
ALTER TABLE saas_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcase_pages ENABLE ROW LEVEL SECURITY;

-- Create policies (allow public read access, you can restrict writes later)
CREATE POLICY "Allow public read access on saas_products"
  ON saas_products FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on showcase_pages"
  ON showcase_pages FOR SELECT
  USING (true);

-- For now, allow all operations (you can restrict this later with auth)
CREATE POLICY "Allow all operations on saas_products"
  ON saas_products FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on showcase_pages"
  ON showcase_pages FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert some initial sample data (optional - remove if you want to start fresh)
-- Using CTE to insert products and get their IDs for pages
WITH inserted_products AS (
  INSERT INTO saas_products (name, description, url, image_url, category, tags, featured, metadata, created_at) VALUES
    ('Ballpark', 'Automated pricing estimation tool for agencies and freelancers. Visitors get instant estimates, you get qualified leads that know your budget before the first call.', 'https://www.ballpark.ing/', '/screenshots/www-ballpark-ing--1766912332896.jpg', 'Productivity', ARRAY['pricing', 'estimation', 'freelance', 'agency', 'lead-qualification'], true, '{"fonts": ["Geist", "Antarica", "ui-monospace"]}', '2025-12-28T08:58:52.902Z'),
    ('Gladia', 'Speech-to-text API with sub-300ms latency. Real-time transcription in 100+ languages with leading accuracy.', 'https://gladia.io/', '/screenshots/gladia-io--1766912093679.jpg', 'AI/ML', ARRAY['speech-to-text', 'ai', 'transcription', 'api'], true, '{}', '2025-12-28T08:54:53.690Z'),
    ('Hera', 'Permet aux agences de voyage d''augmenter leurs ventes grâce à des devis inspirants et personnalisés, créés 5x plus rapidement', 'https://hera.travel/', '/screenshots/hera-travel--1766909780443.jpg', 'Productivity', ARRAY['travel', 'ai', 'automation', 'quotes'], true, '{}', '2025-12-28T08:16:20.449Z')
  ON CONFLICT (url) DO NOTHING
  RETURNING id, url
)
INSERT INTO showcase_pages (saas_id, title, description, page_url, screenshot_url, page_type, tags, metadata, created_at)
SELECT 
  ip.id,
  CASE 
    WHEN ip.url = 'https://www.ballpark.ing/' THEN 'Ballpark Landing Page'
    WHEN ip.url = 'https://gladia.io/' THEN 'Gladia Landing Page'
    WHEN ip.url = 'https://hera.travel/' THEN 'Hera Landing Page'
  END,
  CASE 
    WHEN ip.url = 'https://www.ballpark.ing/' THEN 'Innovative pricing widget tool for freelancers and agencies. Features interactive demo, customer testimonials, and clear ROI messaging. Founder-led narrative.'
    WHEN ip.url = 'https://gladia.io/' THEN 'Speech-to-text API landing page showcasing real-time transcription capabilities, sub-300ms latency, and 100+ language support with clear CTAs.'
    WHEN ip.url = 'https://hera.travel/' THEN 'Beautiful French travel agency tool with AI-powered quote generation. Features automated quote creation, PDF conversion, and photo library.'
  END,
  ip.url,
  CASE 
    WHEN ip.url = 'https://www.ballpark.ing/' THEN '/screenshots/www-ballpark-ing--1766912332896.jpg'
    WHEN ip.url = 'https://gladia.io/' THEN '/screenshots/gladia-io--1766912093679.jpg'
    WHEN ip.url = 'https://hera.travel/' THEN '/screenshots/hera-travel--1766909780443.jpg'
  END,
  'landing',
  CASE 
    WHEN ip.url = 'https://www.ballpark.ing/' THEN ARRAY['saas', 'b2b', 'freelance', 'interactive', 'founder-story']
    WHEN ip.url = 'https://gladia.io/' THEN ARRAY['api', 'dark-mode', 'developer-focused', 'technical']
    WHEN ip.url = 'https://hera.travel/' THEN ARRAY['ai', 'travel', 'french', 'modern', 'gradient']
  END,
  CASE 
    WHEN ip.url = 'https://www.ballpark.ing/' THEN '{"fonts": ["Geist", "Antarica", "ui-monospace"]}'::jsonb
    ELSE '{}'::jsonb
  END,
  CASE 
    WHEN ip.url = 'https://www.ballpark.ing/' THEN '2025-12-28T08:58:52.902Z'::timestamptz
    WHEN ip.url = 'https://gladia.io/' THEN '2025-12-28T08:54:53.690Z'::timestamptz
    WHEN ip.url = 'https://hera.travel/' THEN '2025-12-28T08:16:20.449Z'::timestamptz
  END
FROM inserted_products ip
ON CONFLICT (saas_id, page_url) DO NOTHING;

