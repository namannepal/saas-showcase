-- Add 'resource' to the page_type constraint
ALTER TABLE saas_products
DROP CONSTRAINT IF EXISTS saas_products_page_type_check;

ALTER TABLE saas_products
ADD CONSTRAINT saas_products_page_type_check 
CHECK (page_type IN ('landing', 'pricing', 'features', 'about', 'blog', 'testimonials', 'faq', 'contact', 'comparison', 'resource'));

-- Update the slug generation function to handle resource pages
CREATE OR REPLACE FUNCTION set_saas_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug text;
  page_type_suffix text;
  final_slug text;
  slug_exists boolean;
  counter int := 0;
BEGIN
  -- Only set slug if it's not already set or if name/page_type changed
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND (OLD.name != NEW.name OR OLD.page_type != NEW.page_type)) THEN
    -- Convert name to lowercase and replace spaces/special chars with hyphens
    base_slug := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := trim(both '-' from base_slug);
    
    -- Determine page type suffix
    CASE NEW.page_type
      WHEN 'landing' THEN page_type_suffix := 'landing-page';
      WHEN 'pricing' THEN page_type_suffix := 'pricing-page';
      WHEN 'features' THEN page_type_suffix := 'features-page';
      WHEN 'about' THEN page_type_suffix := 'about-page';
      WHEN 'blog' THEN page_type_suffix := 'blog-page';
      WHEN 'testimonials' THEN page_type_suffix := 'testimonials-page';
      WHEN 'faq' THEN page_type_suffix := 'faq-page';
      WHEN 'contact' THEN page_type_suffix := 'contact-page';
      WHEN 'comparison' THEN page_type_suffix := 'comparison-page';
      WHEN 'resource' THEN page_type_suffix := 'resource-page';
      ELSE page_type_suffix := 'landing-page';
    END CASE;
    
    -- Combine base slug with page type suffix
    final_slug := base_slug || '-' || page_type_suffix;
    
    -- Check if slug exists and add counter if needed
    LOOP
      IF counter > 0 THEN
        final_slug := base_slug || '-' || page_type_suffix || '-' || counter;
      END IF;
      
      SELECT EXISTS(
        SELECT 1 FROM saas_products 
        WHERE slug = final_slug 
        AND id != NEW.id
      ) INTO slug_exists;
      
      EXIT WHEN NOT slug_exists;
      counter := counter + 1;
    END LOOP;
    
    NEW.slug := final_slug;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

