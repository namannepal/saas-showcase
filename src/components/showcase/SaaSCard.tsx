import { SaaSShowcase } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface SaaSCardProps {
  saas: SaaSShowcase;
}

export function SaaSCard({ saas }: SaaSCardProps) {
  return (
    <Link href={`/saas/${saas.id}`} className="block group">
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:shadow-blue-500/10 h-full border-border">
        <div className="aspect-video bg-gradient-to-br from-blue-500/10 to-purple-500/10 relative overflow-hidden">
          {saas.featured && (
            <Badge className="absolute top-2 right-2 z-10" variant="default">
              Featured
            </Badge>
          )}
          <img
            src={saas.imageUrl}
            alt={`${saas.name} screenshot`}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        </div>
        <CardHeader>
          <CardTitle className="group-hover:text-blue-400 transition-colors">
            {saas.name}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {saas.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{saas.category}</Badge>
            {saas.tags.slice(0, 2).map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

