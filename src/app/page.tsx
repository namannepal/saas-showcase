import { Button } from '@/components/ui/button';
import { ShowcaseCard } from '@/components/showcase/ShowcaseCard';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'SaaS Showcase - Best SaaS Web Design & UI Inspiration',
  description: 'Explore landing pages, pricing pages, and design patterns from the world\'s leading SaaS companies. Get inspired and learn from the best.',
  alternates: {
    canonical: BASE_URL,
  },
};

export const revalidate = 0; // Always fetch fresh data

export default async function Home() {
  // Fetch SaaS products from Supabase
  const { data: saasProducts } = await supabase
    .from('saas_products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(12);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
          Best SaaS Web Design & UI Inspiration
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore landing pages, pricing pages, and design patterns from the world&apos;s leading SaaS companies. Get inspired and learn from the best.
        </p>
      </section>

      {/* Featured SaaS Products Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {saasProducts && saasProducts.length > 0 ? (
            saasProducts.map((saas: any) => (
              <Link
                key={saas.id}
                href={`/pages/${saas.slug}`}
                className="block group"
              >
                <div className="overflow-hidden rounded-sm">
                  {/* Image - 380x475px aspect ratio */}
                  <div 
                    className="relative overflow-hidden bg-muted"
                    style={{ aspectRatio: '380/475' }}
                  >
                    {saas.image_url && (
                      <img
                        src={saas.image_url}
                        alt={saas.name}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                    )}
                    
                    {/* Link icon on hover - top right */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-white/90 backdrop-blur-sm rounded-sm p-2 shadow-lg">
                        <svg className="size-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Name below image */}
                  <div className="mt-3">
                    <h3 className="text-sm font-medium text-foreground">
                      {saas.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-muted-foreground col-span-3 text-center py-8">
              No SaaS products yet. Add some through the admin!
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
