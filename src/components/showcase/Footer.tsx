import Link from 'next/link';

const pageTypes = [
  { label: 'Landing Pages', href: '/landing-pages' },
  { label: 'Pricing Pages', href: '/pricing-pages' },
  { label: 'Features Pages', href: '/features-pages' },
  { label: 'About Us Pages', href: '/about-pages' },
  { label: 'Comparison Pages', href: '/comparison-pages' },
  { label: 'Blog Pages', href: '/blog-pages' },
  { label: 'Testimonials Pages', href: '/testimonials-pages' },
  { label: 'FAQ Pages', href: '/faq-pages' },
  { label: 'Contact Us Pages', href: '/contact-pages' },
  { label: 'Resource Pages', href: '/resource-pages' },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left: Logo and Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="font-bold text-xl text-foreground">SaaS Showcase</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Discover and explore the best SaaS landing pages, pricing pages, and design inspiration from leading software companies.
            </p>
          </div>

          {/* Right: Page Types */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Page Types</h3>
            <ul className="space-y-2">
              {pageTypes.map((type) => (
                <li key={type.href}>
                  <Link 
                    href={type.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {type.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} SaaS Showcase. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

