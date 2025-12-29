'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    console.log('Logging out...');
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      
      console.log('Logout successful, redirecting...');
      
      // Use window.location for full page reload
      window.location.href = '/login';
    } catch (error) {
      console.error('Failed to logout:', error);
      alert('Failed to logout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout} disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Logging out...
        </>
      ) : (
        <>
          <LogOut className="mr-2 size-4" />
          Logout
        </>
      )}
    </Button>
  );
}

