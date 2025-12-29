/**
 * Helper functions for integrating screenshots into the SaaS showcase workflow
 */

import { generateScreenshotUrl } from './screenshot';

/**
 * Generate screenshot for a SaaS landing page
 * @param url The URL to screenshot
 * @returns Screenshot URL
 */
export async function generateSaaSScreenshot(url: string): Promise<string> {
  try {
    const screenshotUrl = await generateScreenshotUrl({
      url,
      fullPage: true,
      viewportWidth: 1920,
      viewportHeight: 1080,
      format: 'jpg',
      quality: 80,
      blockAds: true,
      blockCookieBanners: true,
      blockBannersByHeuristics: false,
      blockTrackers: true,
      delay: 0,
      timeout: 60,
    });

    return screenshotUrl;
  } catch (error) {
    console.error('Failed to generate SaaS screenshot:', error);
    throw error;
  }
}

/**
 * Generate screenshots for multiple URLs (batch processing)
 * @param urls Array of URLs to screenshot
 * @returns Array of screenshot URLs
 */
export async function generateBatchScreenshots(
  urls: string[]
): Promise<Array<{ url: string; screenshotUrl: string; error?: string }>> {
  const results = await Promise.allSettled(
    urls.map(async (url) => {
      const screenshotUrl = await generateScreenshotUrl({
        url,
        fullPage: true,
        viewportWidth: 1920,
        viewportHeight: 1080,
        format: 'jpg',
        quality: 80,
        blockAds: true,
        blockCookieBanners: true,
        blockBannersByHeuristics: false,
        blockTrackers: true,
        delay: 0,
        timeout: 60,
      });

      return { url, screenshotUrl };
    })
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        url: urls[index],
        screenshotUrl: '',
        error: result.reason?.message || 'Failed to generate screenshot',
      };
    }
  });
}

/**
 * Generate screenshot with custom viewport (e.g., mobile view)
 * @param url The URL to screenshot
 * @param viewportWidth Viewport width in pixels
 * @param viewportHeight Viewport height in pixels
 * @returns Screenshot URL
 */
export async function generateResponsiveScreenshot(
  url: string,
  viewportWidth: number,
  viewportHeight: number
): Promise<string> {
  try {
    const screenshotUrl = await generateScreenshotUrl({
      url,
      fullPage: true,
      viewportWidth,
      viewportHeight,
      format: 'jpg',
      quality: 80,
      blockAds: true,
      blockCookieBanners: true,
      blockBannersByHeuristics: false,
      blockTrackers: true,
      delay: 0,
      timeout: 60,
    });

    return screenshotUrl;
  } catch (error) {
    console.error('Failed to generate responsive screenshot:', error);
    throw error;
  }
}

/**
 * Generate multiple screenshots with different viewports (desktop, tablet, mobile)
 * @param url The URL to screenshot
 * @returns Object with screenshots for different devices
 */
export async function generateMultiDeviceScreenshots(url: string): Promise<{
  desktop: string;
  tablet: string;
  mobile: string;
}> {
  const [desktop, tablet, mobile] = await Promise.all([
    generateScreenshotUrl({
      url,
      fullPage: true,
      viewportWidth: 1920,
      viewportHeight: 1080,
      format: 'jpg',
      quality: 80,
      blockAds: true,
      blockCookieBanners: true,
      blockBannersByHeuristics: false,
      blockTrackers: true,
      delay: 0,
      timeout: 60,
    }),
    generateScreenshotUrl({
      url,
      fullPage: true,
      viewportWidth: 768,
      viewportHeight: 1024,
      format: 'jpg',
      quality: 80,
      blockAds: true,
      blockCookieBanners: true,
      blockBannersByHeuristics: false,
      blockTrackers: true,
      delay: 0,
      timeout: 60,
    }),
    generateScreenshotUrl({
      url,
      fullPage: true,
      viewportWidth: 375,
      viewportHeight: 667,
      format: 'jpg',
      quality: 80,
      blockAds: true,
      blockCookieBanners: true,
      blockBannersByHeuristics: false,
      blockTrackers: true,
      delay: 0,
      timeout: 60,
    }),
  ]);

  return { desktop, tablet, mobile };
}

