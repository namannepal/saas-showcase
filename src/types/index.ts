export interface SaaSShowcase {
  id: string;
  name: string;
  description: string;
  url: string;
  imageUrl: string;
  category: string;
  tags: string[];
  featured?: boolean;
  createdAt: string;
  metadata?: ScreenshotMetadata;
}

export interface ShowcasePage {
  id: string;
  saasId: string;
  slug: string;
  title: string;
  description: string;
  pageUrl: string;
  screenshotUrl: string;
  pageType: 'landing' | 'pricing' | 'features' | 'about' | 'dashboard' | 'other';
  tags: string[];
  createdAt: string;
  metadata?: ScreenshotMetadata;
}

export interface ScreenshotMetadata {
  fonts?: string[];
  colors?: string[];
  [key: string]: any;
}

export interface ScreenshotRequest {
  url: string;
  fullPage?: boolean;
  viewportWidth?: number;
  viewportHeight?: number;
  format?: 'png' | 'jpg' | 'webp';
  quality?: number;
}

export interface ScreenshotResponse {
  success: boolean;
  data?: {
    url: string;
    screenshotUrl: string;
    expiresIn: string;
  };
  error?: string;
}

export type Category = 
  | 'AI/ML'
  | 'Analytics'
  | 'CRM'
  | 'Developer Tools'
  | 'E-commerce'
  | 'Marketing'
  | 'Productivity'
  | 'Design'
  | 'Communication'
  | 'Finance'
  | 'Other';
