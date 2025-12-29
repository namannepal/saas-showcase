import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Navbar() {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="font-bold text-xl text-foreground">SaaS Showcase</span>
            </Link>
            
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <Input
                type="search"
                placeholder="Search SaaS..."
                className="w-64"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

