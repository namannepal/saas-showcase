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
  format?: 'png' | 'jpg' | 'webp';
  quality?: number;
  blockAds?: boolean;
  blockCookieBanners?: boolean;
  blockBannersByHeuristics?: boolean;
  blockTrackers?: boolean;
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
    format = 'jpg',
    quality = 80,
    blockAds = true,
    blockCookieBanners = true,
    blockBannersByHeuristics = false,
    blockTrackers = true,
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
    .delay(delay)
    .timeout(timeout)
    .metadataFonts(true);

  // Generate signed URL
  const signedUrl = client.generateSignedTakeURL(screenshotOptions);

  return signedUrl;
}

/**
 * Take a screenshot and return the image buffer
 * @param options Screenshot configuration options
 * @returns Buffer containing the screenshot image
 */
export async function takeScreenshot(
  options: ScreenshotOptions
): Promise<Buffer> {
  const {
    url,
    fullPage = true,
    viewportWidth = 1920,
    viewportHeight = 1080,
    format = 'jpg',
    quality = 80,
    blockAds = true,
    blockCookieBanners = true,
    blockBannersByHeuristics = false,
    blockTrackers = true,
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
    .delay(delay)
    .timeout(timeout)
    .metadataFonts(true);

  // Take the screenshot
  const imageBlob = await client.take(screenshotOptions);

  // Convert blob to buffer
  const arrayBuffer = await imageBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return buffer;
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

