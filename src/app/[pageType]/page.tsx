import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface PageProps {
  params: Promise<{
    pageType: string;
  }>;
}

const PAGE_TYPE_MAP: Record<string, string> = {
  'landing-pages': 'landing',
  'pricing-pages': 'pricing',
  'features-pages': 'features',
  'about-pages': 'about',
  'blog-pages': 'blog',
  'testimonials-pages': 'testimonials',
  'faq-pages': 'faq',
  'contact-pages': 'contact',
};

const PAGE_TYPE_LABELS: Record<string, string> = {
  'landing': 'Landing Pages',
  'pricing': 'Pricing Pages',
  'features': 'Features Pages',
  'about': 'About Us Pages',
  'blog': 'Blog Pages',
  'testimonials': 'Testimonials Pages',
  'faq': 'FAQ Pages',
  'contact': 'Contact Us Pages',
};

export const revalidate = 0; // Always fetch fresh data

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function generateMetadata({ params }: PageProps) {
  const { pageType } = await params;
  const dbType = PAGE_TYPE_MAP[pageType];
  
  if (!dbType) {
    return { title: 'Page Not Found' };
  }

  const label = PAGE_TYPE_LABELS[dbType];
  
  return {
    title: `${label} - SaaS Showcase`,
    description: `Explore the best ${label.toLowerCase()} from leading SaaS companies`,
    alternates: {
      canonical: `${BASE_URL}/${pageType}`,
    },
  };
}

export default async function PageTypePage({ params }: PageProps) {
  const { pageType } = await params;
  const dbType = PAGE_TYPE_MAP[pageType];

  // If not a valid page type, return 404
  if (!dbType) {
    notFound();
  }

  const label = PAGE_TYPE_LABELS[dbType];

  // Fetch pages of this type from Supabase
  const { data: pages } = await supabase
    .from('saas_products')
    .select('*')
    .eq('page_type', dbType)
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-4" />
            <span className="text-foreground">{label}</span>
          </nav>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{label}</h1>
          <p className="text-lg text-muted-foreground">
            Discover the best {label.toLowerCase()} from leading SaaS companies
          </p>
        </div>

        {/* Pages Grid */}
        {pages && pages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page: any) => (
              <Link
                key={page.id}
                href={`/pages/${page.slug}`}
                className="block group"
              >
                <div className="overflow-hidden rounded-sm">
                  {/* Image */}
                  <div 
                    className="relative overflow-hidden bg-muted"
                    style={{ aspectRatio: '380/475' }}
                  >
                    {page.image_url && (
                      <img
                        src={page.image_url}
                        alt={page.name}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                    )}
                    
                    {/* Link icon on hover */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-white/90 backdrop-blur-sm rounded-sm p-2 shadow-lg">
                        <svg className="size-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Name */}
                  <div className="mt-3">
                    <h3 className="text-sm font-medium text-foreground">
                      {page.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">
              No {label.toLowerCase()} yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Check back soon for more examples!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Generate static params for all page types
export async function generateStaticParams() {
  return Object.keys(PAGE_TYPE_MAP).map((pageType) => ({
    pageType,
  }));
}

