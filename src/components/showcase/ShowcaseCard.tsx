import { ShowcasePage } from '@/types';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface ShowcaseCardProps {
  page: ShowcasePage;
  saasName?: string;
}

export function ShowcaseCard({ page, saasName }: ShowcaseCardProps) {
  return (
    <Link href={`/pages/${page.slug}`} className="block group">
      <div className="overflow-hidden rounded-sm">
        {/* Image - 380x475px aspect ratio */}
        <div 
          className="relative overflow-hidden bg-muted"
          style={{ aspectRatio: '380/475' }}
        >
          <img
            src={page.screenshotUrl}
            alt={page.title}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
          
          {/* Link icon on hover - top right */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-white/90 backdrop-blur-sm rounded-sm p-2 shadow-lg">
              <ExternalLink className="size-4 text-gray-900" />
            </div>
          </div>
        </div>
        
        {/* Name below image */}
        <div className="mt-3">
          <h3 className="text-sm font-medium text-foreground">
            {saasName || page.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
