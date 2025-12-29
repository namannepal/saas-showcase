-- Add slug field to saas_products table
-- Run this in Supabase SQL Editor

-- Add slug column
ALTER TABLE saas_products 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create function to generate slug (reuse from showcase_pages)
-- (This function already exists if you ran the previous migration, but adding here for completeness)
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
BEGIN
  slug := lower(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'));
  slug := regexp_replace(slug, '\s+', '-', 'g');
  slug := regexp_replace(slug, '-+', '-', 'g');
  slug := trim(both '-' from slug);
  RETURN slug;
END;
$$ LANGUAGE plpgsql;

-- Update existing rows to have slugs based on name
UPDATE saas_products 
SET slug = generate_slug(name)
WHERE slug IS NULL;

-- Make slug NOT NULL and UNIQUE after populating
ALTER TABLE saas_products 
ALTER COLUMN slug SET NOT NULL;

-- Create unique index
CREATE UNIQUE INDEX IF NOT EXISTS idx_saas_products_slug ON saas_products(slug);

-- Create trigger to auto-generate slug on insert if not provided
CREATE OR REPLACE FUNCTION set_saas_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    base_slug := generate_slug(NEW.name);
    final_slug := base_slug;
    
    -- Check for uniqueness and add counter if needed
    WHILE EXISTS (SELECT 1 FROM saas_products WHERE slug = final_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    END LOOP;
    
    NEW.slug := final_slug;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS trigger_set_saas_slug ON saas_products;

-- Create trigger
CREATE TRIGGER trigger_set_saas_slug
  BEFORE INSERT OR UPDATE ON saas_products
  FOR EACH ROW
  EXECUTE FUNCTION set_saas_slug();

-- Verify results
SELECT id, name, slug FROM saas_products ORDER BY created_at DESC;


