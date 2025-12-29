'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  description?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ShareButtons({ title, description, size = 'default' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = description ? `${title} - ${description}` : title;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        size={size}
        className="w-full justify-start"
        onClick={handleCopyLink}
      >
        {copied ? '✓ Copied!' : '📋 Copy Link'}
      </Button>
      <Button
        variant="outline"
        size={size}
        className="w-full justify-start"
        onClick={shareOnTwitter}
      >
        🐦 Share on Twitter
      </Button>
      <Button
        variant="outline"
        size={size}
        className="w-full justify-start"
        onClick={shareOnLinkedIn}
      >
        💼 Share on LinkedIn
      </Button>
    </div>
  );
}

