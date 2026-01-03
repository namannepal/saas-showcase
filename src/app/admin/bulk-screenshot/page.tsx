'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthCheck } from '@/components/admin/AuthCheck';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface CaptureResult {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  error?: string;
}

export default function BulkScreenshotPage() {
  const [capturing, setCapturing] = useState(false);
  const [results, setResults] = useState<CaptureResult[]>([]);
  const [pageType, setPageType] = useState<string>('resource');

  const handleBulkCapture = async () => {
    if (!confirm('This will capture screenshots for all products without images. Continue?')) {
      return;
    }

    setCapturing(true);
    setResults([]);

    try {
      // Fetch all products without screenshots for the selected page type
      const { data: products, error } = await supabase
        .from('saas_products')
        .select('id, name, image_url, page_type')
        .eq('page_type', pageType)
        .order('name', { ascending: true });

      if (error) throw error;

      const productsToCapture = products?.filter(p => !p.image_url) || [];

      if (productsToCapture.length === 0) {
        alert('No products without screenshots found!');
        setCapturing(false);
        return;
      }

      // Initialize results
      const initialResults: CaptureResult[] = productsToCapture.map(p => ({
        id: p.id,
        name: p.name,
        status: 'pending',
      }));
      setResults(initialResults);

      // Capture screenshots one by one
      for (let i = 0; i < productsToCapture.length; i++) {
        const product = productsToCapture[i];

        // Update status to processing
        setResults(prev => prev.map(r => 
          r.id === product.id ? { ...r, status: 'processing' } : r
        ));

        try {
          const response = await fetch(`/api/saas/${product.id}/screenshot`, {
            method: 'POST',
          });

          const result = await response.json();

          if (response.ok) {
            setResults(prev => prev.map(r => 
              r.id === product.id ? { ...r, status: 'success' } : r
            ));
          } else {
            setResults(prev => prev.map(r => 
              r.id === product.id 
                ? { ...r, status: 'error', error: result.error || 'Failed to capture' } 
                : r
            ));
          }
        } catch (error: any) {
          setResults(prev => prev.map(r => 
            r.id === product.id 
              ? { ...r, status: 'error', error: error.message || 'Network error' } 
              : r
          ));
        }

        // Small delay between captures to avoid rate limiting
        if (i < productsToCapture.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      alert('Bulk screenshot capture completed!');
    } catch (error: any) {
      console.error('Bulk capture error:', error);
      alert(`Error: ${error.message || 'Failed to start bulk capture'}`);
    } finally {
      setCapturing(false);
    }
  };

  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bulk Screenshot Capture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                This tool will capture screenshots for all products without images. The process may take several minutes depending on the number of products.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Page Type
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-md border bg-background"
                    value={pageType}
                    onChange={(e) => setPageType(e.target.value)}
                    disabled={capturing}
                  >
                    <option value="landing">Landing Page</option>
                    <option value="pricing">Pricing Page</option>
                    <option value="features">Features Page</option>
                    <option value="about">About Us Page</option>
                    <option value="blog">Blog Page</option>
                    <option value="testimonials">Testimonials Page</option>
                    <option value="faq">FAQ Page</option>
                    <option value="contact">Contact Us Page</option>
                    <option value="comparison">Comparison Page</option>
                    <option value="resource">Resource Page</option>
                  </select>
                </div>

                <Button 
                  onClick={handleBulkCapture} 
                  disabled={capturing}
                  className="w-full"
                >
                  {capturing ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Capturing Screenshots...
                    </>
                  ) : (
                    'Start Bulk Capture'
                  )}
                </Button>
              </div>
            </div>

            {results.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Capture Progress</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {results.map((result) => (
                    <div 
                      key={result.id}
                      className="flex items-center justify-between p-3 rounded-md border bg-card"
                    >
                      <span className="text-sm font-medium">{result.name}</span>
                      <div className="flex items-center gap-2">
                        {result.status === 'pending' && (
                          <span className="text-xs text-muted-foreground">Pending</span>
                        )}
                        {result.status === 'processing' && (
                          <>
                            <Loader2 className="size-4 animate-spin text-blue-500" />
                            <span className="text-xs text-blue-500">Processing...</span>
                          </>
                        )}
                        {result.status === 'success' && (
                          <>
                            <CheckCircle2 className="size-4 text-green-500" />
                            <span className="text-xs text-green-500">Success</span>
                          </>
                        )}
                        {result.status === 'error' && (
                          <>
                            <XCircle className="size-4 text-red-500" />
                            <span className="text-xs text-red-500" title={result.error}>
                              Failed
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 rounded-md bg-muted">
                  <div className="flex items-center justify-between text-sm">
                    <span>Total: {results.length}</span>
                    <span className="text-green-600">
                      Success: {results.filter(r => r.status === 'success').length}
                    </span>
                    <span className="text-red-600">
                      Failed: {results.filter(r => r.status === 'error').length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthCheck>
  );
}

