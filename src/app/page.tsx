import { Button } from '@/components/ui/button';
import { ShowcaseCard } from '@/components/showcase/ShowcaseCard';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  // Fetch recent showcase pages from Supabase
  const { data: featuredPages } = await supabase
    .from('showcase_pages')
    .select('*, saas_products(*)')
    .order('created_at', { ascending: false })
    .limit(12);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Discover the Best SaaS Design
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Explore landing pages, pricing pages, and design patterns from the world&apos;s leading SaaS companies. Get inspired and learn from the best.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/browse">Browse Showcase</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/submit">Submit Your SaaS</Link>
          </Button>
        </div>
      </section>

      {/* Featured Pages Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPages && featuredPages.length > 0 ? (
            featuredPages.map((page: any) => (
              <ShowcaseCard
                key={page.id}
                page={{
                  id: page.id,
                  saasId: page.saas_id,
                  slug: page.slug,
                  title: page.title,
                  description: page.description,
                  pageUrl: page.page_url,
                  screenshotUrl: page.screenshot_url,
                  pageType: page.page_type,
                  tags: page.tags,
                  createdAt: page.created_at,
                }}
                saasName={page.saas_products?.name}
              />
            ))
          ) : (
            <p className="text-muted-foreground col-span-3 text-center py-8">
              No pages yet. Add some through the API!
            </p>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-foreground">Browse by Category</h2>
          <p className="text-muted-foreground">
            Find SaaS products in your industry
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {['AI/ML', 'Analytics', 'CRM', 'Developer Tools', 'E-commerce', 'Marketing', 'Productivity', 'Design', 'Communication', 'Finance'].map((category: string) => (
            <Link
              key={category}
              href={`/categories/${category.toLowerCase().replace('/', '-')}`}
              className="p-6 text-center rounded-lg border border-border hover:border-blue-500 hover:bg-accent transition-all"
            >
              <div className="font-semibold text-foreground">{category}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
