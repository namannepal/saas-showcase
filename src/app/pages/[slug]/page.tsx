import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShowcaseCard } from '@/components/showcase/ShowcaseCard';
import { ShareButtons } from '@/components/showcase/ShareButtons';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60; // Revalidate every 60 seconds

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { data: saas } = await supabase
    .from('saas_products')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (!saas) {
    return {
      title: 'Page Not Found',
    };
  }

  // Add page type suffix for comparison pages
  const titleSuffix = saas.page_type === 'comparison' ? ' Comparison Page' : '';

  return {
    title: `${saas.name}${titleSuffix} - SaaS Showcase`,
    description: saas.description,
    alternates: {
      canonical: `${BASE_URL}/pages/${slug}`,
    },
  };
}

export default async function ShowcasePageDetail({ params }: PageProps) {
  const { slug } = await params;
  
  // Fetch SaaS product
  const { data: saas } = await supabase
    .from('saas_products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!saas) {
    notFound();
  }

  // Get similar SaaS products (same category)
  const { data: similarSaasData } = await supabase
    .from('saas_products')
    .select('*')
    .eq('category', saas.category)
    .neq('slug', slug)
    .limit(3);
    
  const similarSaas = similarSaasData || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-4" />
            <Link 
              href={`/${saas.page_type || 'landing'}-pages`}
              className="hover:text-foreground transition-colors capitalize"
            >
              {saas.page_type?.replace('-', ' ') || 'Landing'} Page
            </Link>
            <ChevronRight className="size-4" />
            <span className="text-foreground">{saas.name}</span>
          </nav>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 mb-12">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-5">
            {/* Screenshot */}
            <div>
              {saas.image_url && (
                <img
                  src={saas.image_url}
                  alt={saas.name}
                  className="w-full rounded-sm"
                  loading="lazy"
                />
              )}
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

              {/* SaaS Info Card */}
              <Card className="border-0 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                <CardContent className="space-y-6">
                  {/* SaaS Info */}
                  <div>
                    <h1 className="text-2xl font-bold mb-3">{saas.name}</h1>
                    <p className="text-muted-foreground text-sm">
                      {saas.description}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="pt-4 border-t" />

                  {/* Page Type */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-sm text-muted-foreground">
                      Page Type
                    </div>
                    <div className="text-sm text-foreground/80 capitalize">
                      {saas.page_type?.replace('-', ' ') || 'Landing'} Page
                    </div>
                  </div>

                  {/* Fonts */}
                  {(() => {
                    const fonts = saas.metadata?.fonts || [];
                    const genericFonts = ['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-monospace'];
                    const uniqueFonts = [...new Set(
                      fonts
                        .map((f: any) => f.first)
                        .filter((name: string) => !genericFonts.includes(name?.toLowerCase()))
                        .map((name: string) => {
                          if (!name) return '';
                          
                          // Handle Next.js font format: __fontname_hash
                          // Example: __saans_cd5095 -> saans
                          if (name.startsWith('__')) {
                            // Remove the __ prefix and everything after the first underscore
                            name = name.substring(2); // Remove __
                            const underscoreIndex = name.indexOf('_');
                            if (underscoreIndex > 0) {
                              name = name.substring(0, underscoreIndex);
                            }
                          }
                          
                          // Remove "Variable" suffix (e.g., "interVariable" -> "inter")
                          name = name.replace(/Variable$/i, '');
                          
                          // Remove file format extensions (e.g., "Inter Woff2" -> "Inter")
                          name = name.replace(/\s+(woff2?|ttf|otf|eot|svg)$/gi, '');
                          
                          // Fix spacing issues FIRST: "P 22" -> "P22" (before removing numbers)
                          name = name.replace(/^P\s+(\d+)/i, 'P$1');
                          
                          // Remove numeric font weights at the end FIRST (e.g., "Lausanne 400" -> "Lausanne")
                          name = name.replace(/\s+\d{2,4}$/g, '');
                          
                          // Separate common font family suffixes: "Mackinacpro" -> "Mackinac Pro"
                          name = name.replace(/(pro|mono|sans|serif|display|text|condensed|extended|narrow|wide)$/i, ' $1');
                          
                          // Fix common font name spacing for camelCase: "InterBold" -> "Inter Bold"
                          name = name.replace(/([a-z])([A-Z])/g, '$1 $2');
                          
                          // Remove font weight/style keywords
                          name = name
                            .replace(/\s+(trial|medium|bold|regular|light|thin|black|heavy|extra|semibold|demi)\b/gi, '')
                            .trim();
                          
                          // Capitalize first letter of each word, but preserve short acronyms
                          return name.split(' ').map(word => {
                            const lowerWord = word.toLowerCase();
                            // Common font suffixes should NOT be treated as acronyms
                            const fontSuffixes = ['pro', 'neo', 'alt', 'jet', 'new', 'old', 'std', 'web'];
                            if (fontSuffixes.includes(lowerWord)) {
                              return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                            }
                            // If word is 2-3 chars and all letters, treat as acronym (e.g., VC, IBM, HP)
                            if (word.length >= 2 && word.length <= 3 && /^[a-zA-Z]+$/.test(word)) {
                              return word.toUpperCase();
                            }
                            // Otherwise, capitalize first letter
                            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                          }).join(' ');
                        })
                        .filter(Boolean)
                    )];
                    
                    return uniqueFonts.length > 0 ? (
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm text-muted-foreground">
                          Fonts
                        </div>
                        <div className="text-sm text-foreground/80 text-right">
                          {uniqueFonts.join(', ')}
                        </div>
                      </div>
                    ) : null;
                  })()}

                  {/* Tags */}
                  {saas.tags && saas.tags.length > 0 && (
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-sm text-muted-foreground">
                        Tags
                      </div>
                      <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                        {saas.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Added On
                    </div>
                    <div className="text-sm text-foreground/80">
                      {new Date(saas.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Similar SaaS - Full Width */}
        {similarSaas.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Similar {saas.category} Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarSaas.map((similar: any) => (
                <Link
                  key={similar.id}
                  href={`/pages/${similar.slug}`}
                  className="block group"
                >
                  <div className="overflow-hidden rounded-sm">
                    <div 
                      className="relative overflow-hidden bg-muted"
                      style={{ aspectRatio: '380/475' }}
                    >
                      {similar.image_url && (
                        <img
                          src={similar.image_url}
                          alt={similar.name}
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                        />
                      )}
                      
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="bg-white/90 backdrop-blur-sm rounded-sm p-2 shadow-lg">
                          <svg className="size-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <h3 className="text-sm font-medium text-foreground">
                        {similar.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

