-- Add page_type field to saas_products
-- Run this in Supabase SQL Editor

-- Add page_type column with default 'landing'
ALTER TABLE saas_products 
ADD COLUMN IF NOT EXISTS page_type TEXT DEFAULT 'landing';

-- Add check constraint for valid page types
ALTER TABLE saas_products
DROP CONSTRAINT IF EXISTS saas_products_page_type_check;

ALTER TABLE saas_products
ADD CONSTRAINT saas_products_page_type_check 
CHECK (page_type IN ('landing', 'pricing', 'features', 'about', 'blog', 'testimonials', 'faq', 'contact'));

-- Update existing entries to 'landing' if null
UPDATE saas_products 
SET page_type = 'landing' 
WHERE page_type IS NULL;

-- Verify
SELECT name, page_type FROM saas_products ORDER BY created_at DESC;



