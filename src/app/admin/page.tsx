import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Trash2, Edit, Plus } from 'lucide-react';

export const revalidate = 0; // Don't cache admin page

export default async function AdminPage() {
  // Fetch all SaaS products
  const { data: saasProducts } = await supabase
    .from('saas_products')
    .select('*')
    .order('created_at', { ascending: false });

  // Fetch all showcase pages
  const { data: showcasePages } = await supabase
    .from('showcase_pages')
    .select('*, saas_products(*)')
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your SaaS showcase products and pages
            </p>
          </div>
          <Link href="/admin/add">
            <Button size="lg">
              <Plus className="mr-2 size-4" />
              Add New SaaS
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total SaaS Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{saasProducts?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{showcasePages?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Featured Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {saasProducts?.filter(s => s.featured).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SaaS Products List */}
        <Card>
          <CardHeader>
            <CardTitle>SaaS Products</CardTitle>
          </CardHeader>
          <CardContent>
            {saasProducts && saasProducts.length > 0 ? (
              <div className="space-y-4">
                {saasProducts.map((saas: any) => (
                  <div
                    key={saas.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {saas.image_url && (
                        <img
                          src={saas.image_url}
                          alt={saas.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{saas.name}</h3>
                          {saas.featured && (
                            <Badge variant="secondary">Featured</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {saas.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{saas.category}</Badge>
                          <a
                            href={saas.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:underline"
                          >
                            {saas.url}
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/edit/${saas.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="size-4" />
                        </Button>
                      </Link>
                      <form action={`/api/saas/${saas.id}`} method="POST">
                        <input type="hidden" name="_method" value="DELETE" />
                        <Button variant="destructive" size="sm" type="submit">
                          <Trash2 className="size-4" />
                        </Button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No SaaS products yet. Add your first one!
                </p>
                <Link href="/admin/add">
                  <Button>
                    <Plus className="mr-2 size-4" />
                    Add New SaaS
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

