import { generateScreenshotUrl } from './screenshot';
import { uploadToCloudinary } from './cloudinary';

/**
 * Generate a safe public ID from name and page type for Cloudinary
 * @param name The SaaS product name
 * @param pageType The page type (landing, pricing, etc.)
 * @returns Safe public ID string
 */
function generatePublicId(name: string, pageType: string): string {
  // Sanitize name - remove special characters
  const sanitizedName = name
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .substring(0, 50); // Limit length

  // Format: name-pageType-page (e.g., "stripe-pricing-page")
  const publicId = `${sanitizedName}-${pageType}-page`;
  
  return publicId;
}

/**
 * Fallback: Generate a safe public ID from URL (for backward compatibility)
 * @param url The URL to convert to public ID
 * @returns Safe public ID string
 */
function generatePublicIdFromUrl(url: string): string {
  const sanitized = url
    .replace(/^https?:\/\//, '')
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
    .substring(0, 100);

  const timestamp = Date.now();
  return `${sanitized}-${timestamp}`;
}

/**
 * Download screenshot from ScreenshotOne and upload to Cloudinary
 * @param url The website URL to screenshot
 * @param options Optional screenshot options including name and pageType for filename
 * @returns Object with Cloudinary URL and metadata
 */
export async function downloadAndSaveScreenshot(
  url: string,
  options?: {
    name?: string;
    pageType?: string;
    fullPage?: boolean;
    viewportWidth?: number;
    viewportHeight?: number;
  }
): Promise<{ screenshotPath: string; metadata?: any }> {
  try {
    // Generate screenshot URL from ScreenshotOne
    const screenshotUrl = await generateScreenshotUrl({
      url,
      fullPage: options?.fullPage ?? true,
      viewportWidth: options?.viewportWidth ?? 1920,
      viewportHeight: options?.viewportHeight ?? 1080,
      format: 'jpg',
      quality: 80,
      blockAds: true,
      blockCookieBanners: true,
      blockBannersByHeuristics: false,
      blockTrackers: true,
      delay: 0,
      timeout: 60,
    });

    // Download the image
    const response = await fetch(screenshotUrl);
    if (!response.ok) {
      throw new Error(`Failed to download screenshot: ${response.statusText}`);
    }

    // Extract font metadata from headers (URL-encoded JSON)
    const fontsHeader = response.headers.get('x-screenshotone-fonts');
    const fonts = fontsHeader ? JSON.parse(decodeURIComponent(fontsHeader)) : undefined;

    const imageBuffer = Buffer.from(await response.arrayBuffer());

    // Upload to Cloudinary
    // Use name and pageType if provided, otherwise fallback to URL-based ID
    const publicId = options?.name && options?.pageType 
      ? generatePublicId(options.name, options.pageType)
      : generatePublicIdFromUrl(url);
    
    const cloudinaryResult = await uploadToCloudinary(imageBuffer, {
      folder: 'saas-showcase',
      publicId,
    });

    // Log upload success and metadata
    console.log(`Screenshot uploaded to Cloudinary: ${cloudinaryResult.url}`);
    if (fonts) {
      console.log(`Font metadata for ${url}:`, fonts);
    }

    // Return Cloudinary URL and metadata
    return {
      screenshotPath: cloudinaryResult.url,
      metadata: fonts ? { fonts } : undefined,
    };
  } catch (error) {
    console.error('Error downloading and saving screenshot:', error);
    throw error;
  }
}

/**
 * Download and save multiple screenshots to Cloudinary
 * @param urls Array of URLs to screenshot
 * @returns Array of Cloudinary URLs and metadata
 */
export async function downloadAndSaveBatchScreenshots(
  urls: string[]
): Promise<Array<{ url: string; screenshotPath: string; metadata?: any; error?: string }>> {
  const results = await Promise.allSettled(
    urls.map(async (url) => {
      const result = await downloadAndSaveScreenshot(url);
      return { url, ...result };
    })
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        url: urls[index],
        screenshotPath: '',
        error: result.reason?.message || 'Failed to download screenshot',
      };
    }
  });
}
