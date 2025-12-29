import { NextRequest, NextResponse } from 'next/server';
import { generateScreenshotUrl, isScreenshotConfigured } from '@/lib/screenshot';

// POST /api/screenshot/batch - Generate screenshot URLs for multiple websites
export async function POST(request: NextRequest) {
  try {
    // Check if ScreenshotOne is configured
    if (!isScreenshotConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: 'ScreenshotOne API is not configured. Please add SCREENSHOTONE_ACCESS_KEY and SCREENSHOTONE_SECRET_KEY to your .env.local file.',
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { urls } = body;

    // Validate URLs array
    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'URLs array is required and must not be empty',
        },
        { status: 400 }
      );
    }

    if (urls.length > 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'Maximum 10 URLs allowed per batch request',
        },
        { status: 400 }
      );
    }

    // Generate screenshot URLs for all provided URLs
    const results = await Promise.allSettled(
      urls.map(async (urlData: string | { url: string; fullPage?: boolean }) => {
        const url = typeof urlData === 'string' ? urlData : urlData.url;
        const fullPage = typeof urlData === 'object' ? urlData.fullPage : true;

        // Validate URL format
        try {
          new URL(url);
        } catch {
          throw new Error(`Invalid URL format: ${url}`);
        }

        const screenshotUrl = await generateScreenshotUrl({
          url,
          fullPage: fullPage !== undefined ? fullPage : true,
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

        return {
          url,
          screenshotUrl,
        };
      })
    );

    // Process results
    const screenshots = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return {
          success: true,
          ...result.value,
        };
      } else {
        const url = typeof urls[index] === 'string' ? urls[index] : urls[index].url;
        return {
          success: false,
          url,
          error: result.reason?.message || 'Failed to generate screenshot',
        };
      }
    });

    const successCount = screenshots.filter(s => s.success).length;
    const failureCount = screenshots.filter(s => !s.success).length;

    return NextResponse.json({
      success: true,
      data: {
        screenshots,
        summary: {
          total: urls.length,
          successful: successCount,
          failed: failureCount,
        },
      },
    });
  } catch (error) {
    console.error('Batch screenshot generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate screenshots',
      },
      { status: 500 }
    );
  }
}

