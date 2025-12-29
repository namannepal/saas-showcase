import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase-server';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Page types for dynamic routes
const PAGE_TYPES = [
  'landing-pages',
  'pricing-pages',
  'about-us-pages',
  'contact-pages',
  'feature-pages',
  'testimonial-pages',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  // Fetch all SaaS products
  const { data: saasProducts } = await supabase
    .from('saas_products')
    .select('slug, updated_at')
    .order('created_at', { ascending: false });

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // Page type category pages
  const pageTypePages: MetadataRoute.Sitemap = PAGE_TYPES.map((pageType) => ({
    url: `${BASE_URL}/${pageType}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Individual SaaS product pages
  const saasPages: MetadataRoute.Sitemap = (saasProducts || []).map((saas) => ({
    url: `${BASE_URL}/pages/${saas.slug}`,
    lastModified: new Date(saas.updated_at),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticPages, ...pageTypePages, ...saasPages];
}

