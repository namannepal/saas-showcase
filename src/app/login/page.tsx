'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    // Check if already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const redirectTo = searchParams.get('redirectTo') || '/admin';
        router.push(redirectTo);
      }
    };
    checkUser();
  }, [router, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    console.log('Attempting login with:', formData.email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      console.log('Login response:', { data, error });

      if (error) throw error;

      if (data.user) {
        console.log('Login successful! User:', data.user.email);
        setSuccess('Login successful! Redirecting...');
        
        // Get redirect URL from query params or default to /admin
        const redirectTo = searchParams.get('redirectTo') || '/admin';
        
        // Small delay to show success message
        setTimeout(() => {
          router.push(redirectTo);
          router.refresh();
        }, 500);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 items-center justify-center text-white font-bold text-xl mb-4">
            S
          </div>
          <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
          <p className="text-muted-foreground">
            Sign in to manage your SaaS showcase
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20 text-green-500 text-sm">
                  {success}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  autoComplete="current-password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account? Contact your administrator.
        </p>
      </div>
    </div>
  );
}

