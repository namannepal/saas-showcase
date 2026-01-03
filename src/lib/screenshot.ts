import * as screenshotone from 'screenshotone-api-sdk';

// Initialize the ScreenshotOne client
const client = new screenshotone.Client(
  process.env.SCREENSHOTONE_ACCESS_KEY || '',
  process.env.SCREENSHOTONE_SECRET_KEY || ''
);

export interface ScreenshotOptions {
  url: string;
  fullPage?: boolean;
  viewportWidth?: number;
  viewportHeight?: number;
  format?: 'webp' | 'png' | 'jpg';
  quality?: number;
  blockAds?: boolean;
  blockCookieBanners?: boolean;
  blockBannersByHeuristics?: boolean;
  blockTrackers?: boolean;
  blockChats?: boolean;
  delay?: number;
  timeout?: number;
}

/**
 * Generate a signed screenshot URL using ScreenshotOne API
 * @param options Screenshot configuration options
 * @returns Signed URL to the screenshot
 */
export async function generateScreenshotUrl(
  options: ScreenshotOptions
): Promise<string> {
  const {
    url,
    fullPage = true,
    viewportWidth = 1920,
    viewportHeight = 1080,
    format = 'webp',
    quality = 95,
    blockAds = true,
    blockCookieBanners = true,
    blockBannersByHeuristics = true,
    blockTrackers = true,
    blockChats = true,
    delay = 0,
    timeout = 60,
  } = options;

  // Build the screenshot options
  const screenshotOptions = screenshotone.TakeOptions.url(url)
    .fullPage(fullPage)
    .viewportWidth(viewportWidth)
    .viewportHeight(viewportHeight)
    .format(format)
    .imageQuality(quality)
    .blockAds(blockAds)
    .blockCookieBanners(blockCookieBanners)
    .blockBannersByHeuristics(blockBannersByHeuristics)
    .blockTrackers(blockTrackers)
    .blockChats(blockChats)
    .delay(delay)
    .timeout(timeout)
    .metadataFonts(true);

  // Generate signed URL
  const signedUrl = client.generateSignedTakeURL(screenshotOptions);

  return signedUrl;
}

/**
 * Take a screenshot and return metadata with signed URL
 * @param url URL to screenshot or options object
 * @returns Object with screenshot URL and metadata
 */
export async function takeScreenshot(
  url: string | ScreenshotOptions
): Promise<{ url: string; fonts: string[]; colors: string[] }> {
  // Handle both string URL and options object
  const options: ScreenshotOptions = typeof url === 'string' ? { url } : url;
  
  const {
    url: targetUrl,
    fullPage = true,
    viewportWidth = 1920,
    viewportHeight = 1080,
    format = 'webp',
    quality = 95,
    blockAds = true,
    blockCookieBanners = true,
    blockBannersByHeuristics = true,
    blockTrackers = true,
    blockChats = true,
    delay = 0,
    timeout = 60,
  } = options;

  // Build the screenshot options with metadata
  const screenshotOptions = screenshotone.TakeOptions.url(targetUrl)
    .fullPage(fullPage)
    .viewportWidth(viewportWidth)
    .viewportHeight(viewportHeight)
    .format(format)
    .imageQuality(quality)
    .blockAds(blockAds)
    .blockCookieBanners(blockCookieBanners)
    .blockBannersByHeuristics(blockBannersByHeuristics)
    .blockTrackers(blockTrackers)
    .blockChats(blockChats)
    .delay(delay)
    .timeout(timeout)
    .metadataFonts(true);

  // Generate a signed URL (doesn't require actual screenshot capture)
  const signedUrl = await client.generateSignedTakeURL(screenshotOptions);

  // For metadata, we'll fetch it separately or return empty arrays
  // ScreenshotOne metadata is extracted from the actual screenshot
  return {
    url: signedUrl,
    fonts: [],
    colors: [],
  };
}

/**
 * Validate if ScreenshotOne API is configured
 * @returns Boolean indicating if API keys are configured
 */
export function isScreenshotConfigured(): boolean {
  return !!(
    process.env.SCREENSHOTONE_ACCESS_KEY &&
    process.env.SCREENSHOTONE_SECRET_KEY
  );
}

