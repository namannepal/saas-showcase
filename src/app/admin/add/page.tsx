'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  { value: 'comparison', label: 'Comparison Page' },
  { value: 'resource', label: 'Resource Page' },
  { value: 'demo', label: 'Demo Page' },
];

export default function AddSaaSPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    category: 'Productivity',
    pageType: 'landing',
    tags: '',
    featured: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/saas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          url: formData.url,
          category: formData.category,
          pageType: formData.pageType,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          featured: formData.featured,
        }),
      });

      if (response.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to add SaaS'}`);
      }
    } catch (error) {
      console.error('Error adding SaaS:', error);
      alert('Failed to add SaaS. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCheck>
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
          <h1 className="text-4xl font-bold mb-2">Add New SaaS</h1>
          <p className="text-muted-foreground">
            Add a new SaaS product to your showcase. Screenshot will be captured automatically.
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>SaaS Details</CardTitle>
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
                  placeholder="Brief description of the SaaS product..."
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
                <p className="text-xs text-muted-foreground mt-1">
                  Screenshot will be captured automatically from this URL
                </p>
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
                <p className="text-xs text-muted-foreground mt-1">
                  What type of page is this? (Landing, Pricing, Features, etc.)
                </p>
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
                <p className="text-xs text-muted-foreground mt-1">
                  Separate tags with commas
                </p>
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
                      Adding SaaS & Capturing Screenshot...
                    </>
                  ) : (
                    'Add SaaS Product'
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

        {/* Info Card */}
        <Card className="mt-6 border-blue-500/20 bg-blue-500/5">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">ℹ️ What happens when you add a SaaS?</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Full-page screenshot is automatically captured</li>
              <li>Image is uploaded to Cloudinary for fast delivery</li>
              <li>Font metadata is extracted (if available)</li>
              <li>A showcase page is automatically created</li>
              <li>Product appears on the homepage immediately</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
    </AuthCheck>
  );
}

