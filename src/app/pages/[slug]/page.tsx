import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShowcaseCard } from '@/components/showcase/ShowcaseCard';
import { ShareButtons } from '@/components/showcase/ShareButtons';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { data: page } = await supabase
    .from('showcase_pages')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: `${page.title} - SaaS Showcase`,
    description: page.description,
  };
}

export default async function ShowcasePageDetail({ params }: PageProps) {
  const { slug } = await params;
  
  // Fetch showcase page with SaaS product
  const { data: page } = await supabase
    .from('showcase_pages')
    .select('*, saas_products(*)')
    .eq('slug', slug)
    .single();

  if (!page) {
    notFound();
  }

  const saas = page.saas_products;

  // Get other pages from the same SaaS
  const { data: relatedPagesData } = await supabase
    .from('showcase_pages')
    .select('*')
    .eq('saas_id', page.saas_id)
    .neq('slug', slug)
    .limit(3);
  
  const relatedPages = relatedPagesData || [];

  // Get similar pages (same type)
  const { data: similarPagesData } = await supabase
    .from('showcase_pages')
    .select('*, saas_products(*)')
    .eq('page_type', page.page_type)
    .neq('slug', slug)
    .limit(3);
    
  const similarPages = similarPagesData || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/browse" className="hover:text-foreground transition-colors">
              Browse
            </Link>
            <span>/</span>
            {saas && (
              <>
                <Link 
                  href={`/saas/${saas.id}`}
                  className="hover:text-foreground transition-colors"
                >
                  {saas.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground">{page.title}</span>
          </nav>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 mb-12">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-5">
            {/* Screenshot */}
            <div>
              <img
                src={page.screenshot_url}
                alt={page.title}
                className="w-full rounded-sm"
                loading="lazy"
              />
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              {/* Visit Live Page Button */}
              <Button asChild size="lg" className="w-full">
                <a href={page.page_url} target="_blank" rel="noopener noreferrer">
                  Visit Live Page →
                </a>
              </Button>

              {/* Page Info Card */}
              <Card className="border-0 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                <CardContent className="space-y-6">
                  {/* Page Info */}
                  <div>
                    <h1 className="text-2xl font-bold mb-3">{saas?.name || page.title}</h1>
                    <p className="text-muted-foreground text-sm">
                      {page.description}
                    </p>
                  </div>

                  {/* Page Type */}
                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Page Type
                    </div>
                      <Badge variant="outline" className="capitalize">
                        {page.page_type}
                      </Badge>
                  </div>

                  {/* Tags */}
                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Tags
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {page.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Date Added
                    </div>
                    <div className="text-sm">
                      {new Date(page.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Pages - Full Width */}
        {relatedPages.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              More from {saas?.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPages.map((relatedPage: any) => (
                <ShowcaseCard
                  key={relatedPage.id}
                  page={{
                    id: relatedPage.id,
                    saasId: relatedPage.saas_id,
                    slug: relatedPage.slug,
                    title: relatedPage.title,
                    description: relatedPage.description,
                    pageUrl: relatedPage.page_url,
                    screenshotUrl: relatedPage.screenshot_url,
                    pageType: relatedPage.page_type,
                    tags: relatedPage.tags,
                    createdAt: relatedPage.created_at,
                  }}
                  saasName={saas?.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Similar Pages - Full Width */}
        {similarPages.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Similar {page.page_type} Pages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarPages.map((similarPage: any) => (
                <ShowcaseCard
                  key={similarPage.id}
                  page={{
                    id: similarPage.id,
                    saasId: similarPage.saas_id,
                    slug: similarPage.slug,
                    title: similarPage.title,
                    description: similarPage.description,
                    pageUrl: similarPage.page_url,
                    screenshotUrl: similarPage.screenshot_url,
                    pageType: similarPage.page_type,
                    tags: similarPage.tags,
                    createdAt: similarPage.created_at,
                  }}
                  saasName={similarPage.saas_products?.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

