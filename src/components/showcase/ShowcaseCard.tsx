import { ShowcasePage } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { getOptimizedUrl } from '@/lib/cloudinary';

interface ShowcaseCardProps {
  page: ShowcasePage;
  saasName?: string;
}

export function ShowcaseCard({ page, saasName }: ShowcaseCardProps) {
  // Optimize image for card size (380x475)
  const optimizedUrl = getOptimizedUrl(page.screenshotUrl, {
    width: 760, // 2x for retina displays
    format: 'webp',
    quality: 'auto',
  });

  return (
    <Link href={`/pages/${page.slug}`} className="block group">
      <div className="overflow-hidden rounded-sm">
        {/* Image - 380x475px aspect ratio */}
        <div 
          className="relative overflow-hidden bg-muted"
          style={{ aspectRatio: '380/475' }}
        >
          <Image
            src={optimizedUrl}
            alt={page.title}
            width={760}
            height={950}
            className="w-full h-full object-cover object-top"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
