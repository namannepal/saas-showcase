'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthCheck } from '@/components/admin/AuthCheck';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

const categories = [
  'AI/ML',
  'Analytics',
  'CRM',
  'Developer Tools',
  'E-commerce',
  'Marketing',
  'Productivity',
  'Design',
  'Communication',
  'Finance',
  'Other',
];

const pageTypes = [
  { value: 'landing', label: 'Landing Page' },
  { value: 'pricing', label: 'Pricing Page' },
  { value: 'features', label: 'Features Page' },
  { value: 'about', label: 'About Us Page' },
  { value: 'blog', label: 'Blog Page' },
  { value: 'testimonials', label: 'Testimonials Page' },
  { value: 'faq', label: 'FAQ Page' },
  { value: 'contact', label: 'Contact Us Page' },
];

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function EditForm({ params }: PageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    category: 'Productivity',
    pageType: 'landing',
    tags: '',
    featured: false,
  });

  useEffect(() => {
    const fetchSaaS = async () => {
      const { id } = await params;
      const { data } = await supabase
        .from('saas_products')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setFormData({
          name: data.name,
          description: data.description,
          url: data.url,
          category: data.category,
          pageType: data.page_type || 'landing',
          tags: data.tags?.join(', ') || '',
          featured: data.featured || false,
        });
      }
      setFetchingData(false);
    };

    fetchSaaS();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { id } = await params;
      
      const response = await fetch(`/api/saas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          url: formData.url,
          category: formData.category,
          page_type: formData.pageType,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          featured: formData.featured,
        }),
      });

      if (response.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to update SaaS'}`);
      }
    } catch (error) {
      console.error('Error updating SaaS:', error);
      alert('Failed to update SaaS. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 size-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Edit SaaS Page</h1>
          <p className="text-muted-foreground">
            Update the details for this page.
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Page Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Stripe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border bg-background"
                  placeholder="Brief description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Website URL <span className="text-red-500">*</span>
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 rounded-md border bg-background"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Page Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Page Type <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 rounded-md border bg-background"
                  value={formData.pageType}
                  onChange={(e) => setFormData({ ...formData, pageType: e.target.value })}
                  required
                >
                  {pageTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tags
                </label>
                <Input
                  type="text"
                  placeholder="payments, fintech, api (comma-separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>

              {/* Featured */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                  Mark as featured
                </label>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Page'
                  )}
                </Button>
                <Link href="/admin">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function EditSaaSPage({ params }: PageProps) {
  return (
    <AuthCheck>
      <EditForm params={params} />
    </AuthCheck>
  );
}

