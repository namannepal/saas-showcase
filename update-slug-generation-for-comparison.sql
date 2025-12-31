-- Migration: Update slug generation to append page type suffix
-- Run this in your Supabase SQL Editor

-- Update the slug generation function to include page type suffix
CREATE OR REPLACE FUNCTION set_saas_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
  suffix TEXT := '';
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    -- Generate base slug from name
    base_slug := generate_slug(NEW.name);
    
    -- Add page type suffix for comparison pages
    IF NEW.page_type = 'comparison' THEN
      suffix := '-comparison-page';
    END IF;
    
    -- Combine base slug with suffix
    final_slug := base_slug || suffix;
    
    -- Check for uniqueness and add counter if needed
    WHILE EXISTS (SELECT 1 FROM saas_products WHERE slug = final_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
      counter := counter + 1;
      final_slug := base_slug || suffix || '-' || counter;
    END LOOP;
    
    NEW.slug := final_slug;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update existing comparison pages to have the correct slug format
-- (This will regenerate slugs for any existing comparison pages)
UPDATE saas_products 
SET slug = NULL 
WHERE page_type = 'comparison';

-- The trigger will automatically regenerate slugs with the correct format

-- Verify results
SELECT id, name, page_type, slug 
FROM saas_products 
WHERE page_type = 'comparison'
ORDER BY created_at DESC;


