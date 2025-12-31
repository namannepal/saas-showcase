-- Migration: Add "comparison" to page_type enum in saas_products table
-- Run this in your Supabase SQL Editor

-- Drop the existing constraint
ALTER TABLE saas_products 
DROP CONSTRAINT IF EXISTS saas_products_page_type_check;

-- Add the new constraint with "comparison" included
ALTER TABLE saas_products 
ADD CONSTRAINT saas_products_page_type_check 
CHECK (page_type IN ('landing', 'pricing', 'features', 'about', 'blog', 'testimonials', 'faq', 'contact', 'comparison'));

-- Verify the constraint
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'saas_products_page_type_check';


