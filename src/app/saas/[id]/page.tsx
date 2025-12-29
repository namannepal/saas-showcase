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
    id: string;
  }>;
}

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const { data: saas } = await supabase
    .from('saas_products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (!saas) {
    return {
      title: 'SaaS Not Found',
    };
  }

  return {
    title: `${saas.name} - SaaS Showcase`,
    description: saas.description,
  };
}

export default async function SaaSDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  // Fetch SaaS product
  const { data: saas } = await supabase
    .from('saas_products')
    .select('*')
    .eq('id', id)
    .single();

  if (!saas) {
    notFound();
  }

  // Get all pages related to this SaaS
  const { data: relatedPagesData } = await supabase
    .from('showcase_pages')
    .select('*')
    .eq('saas_id', id)
    .order('created_at', { ascending: false});
  
  const relatedPages = relatedPagesData || [];

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
            <span className="text-foreground">{saas.name}</span>
          </nav>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 mb-12">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-5">
            {/* Screenshot */}
            <div>
              <img
                src={saas.image_url}
                alt={`${saas.name} landing page`}
                className="w-full rounded-sm"
                loading="lazy"
              />
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              {/* Visit Website Button */}
              <Button asChild size="lg" className="w-full">
                <a href={saas.url} target="_blank" rel="noopener noreferrer">
                  Visit Website →
                </a>
              </Button>

              {/* Product Info Card */}
              <Card className="border-0 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                <CardContent className="space-y-6">
                  {/* Product Info */}
                  <div>
                    <h1 className="text-2xl font-bold mb-3">{saas.name}</h1>
                    <p className="text-muted-foreground text-sm">
                      {saas.description}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        Category
                      </div>
                      <Badge variant="outline">{saas.category}</Badge>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        Tags
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {saas.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {saas.featured && (
                      <div>
                        <Badge variant="default">Featured</Badge>
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Date Added
                    </div>
                    <div className="text-sm">
                      {new Date(saas.createdAt).toLocaleDateString('en-US', {
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

        {/* Related Pages Section - Full Width */}
        {relatedPages.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              More Pages from {saas.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPages.map((page: any) => (
                <ShowcaseCard
                  key={page.id}
                  page={{
                    id: page.id,
                    saasId: page.saas_id,
                    title: page.title,
                    description: page.description,
                    pageUrl: page.page_url,
                    screenshotUrl: page.screenshot_url,
                    pageType: page.page_type,
                    tags: page.tags,
                    createdAt: page.created_at,
                  }}
                  saasName={saas.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

