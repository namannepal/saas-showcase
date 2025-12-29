-- Backfill: Create showcase_pages for existing saas_products that don't have them
-- Run this in Supabase SQL Editor

INSERT INTO showcase_pages (saas_id, title, description, page_url, screenshot_url, page_type, tags, metadata)
SELECT 
  sp.id as saas_id,
  sp.name || ' Landing Page' as title,
  sp.description,
  sp.url as page_url,
  sp.image_url as screenshot_url,
  'landing' as page_type,
  sp.tags,
  sp.metadata
FROM saas_products sp
WHERE NOT EXISTS (
  -- Only insert if no showcase page exists for this SaaS
  SELECT 1 FROM showcase_pages p WHERE p.saas_id = sp.id
);

-- Check results
SELECT 
  sp.name as "SaaS Name",
  COUNT(p.id) as "Showcase Pages"
FROM saas_products sp
LEFT JOIN showcase_pages p ON p.saas_id = sp.id
GROUP BY sp.id, sp.name
ORDER BY sp.created_at DESC;


