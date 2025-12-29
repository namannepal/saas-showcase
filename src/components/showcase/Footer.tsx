import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center mb-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-bold text-xl text-foreground">SaaS Showcase</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
            Discover and explore the best SaaS landing pages, pricing pages, and design inspiration from leading software companies.
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SaaS Showcase. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

