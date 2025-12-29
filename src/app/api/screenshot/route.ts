import { NextRequest, NextResponse } from 'next/server';
import { generateScreenshotUrl, isScreenshotConfigured } from '@/lib/screenshot';

// POST /api/screenshot - Generate a screenshot URL for a given website
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
    const { url, fullPage, viewportWidth, viewportHeight, format, quality } = body;

    // Validate URL
    if (!url) {
      return NextResponse.json(
        {
          success: false,
          error: 'URL is required',
        },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid URL format',
        },
        { status: 400 }
      );
    }

    // Generate screenshot URL
    const screenshotUrl = await generateScreenshotUrl({
      url,
      fullPage: fullPage !== undefined ? fullPage : true,
      viewportWidth: viewportWidth || 1920,
      viewportHeight: viewportHeight || 1080,
      format: format || 'jpg',
      quality: quality || 80,
      blockAds: true,
      blockCookieBanners: true,
      blockBannersByHeuristics: false,
      blockTrackers: true,
      delay: 0,
      timeout: 60,
    });

    return NextResponse.json({
      success: true,
      data: {
        url,
        screenshotUrl,
        expiresIn: '1 hour',
      },
    });
  } catch (error) {
    console.error('Screenshot generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate screenshot',
      },
      { status: 500 }
    );
  }
}

// GET /api/screenshot?url=https://example.com - Quick screenshot URL generation via GET
export async function GET(request: NextRequest) {
  try {
    // Check if ScreenshotOne is configured
    if (!isScreenshotConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: 'ScreenshotOne API is not configured',
        },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        {
          success: false,
          error: 'URL parameter is required',
        },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid URL format',
        },
        { status: 400 }
      );
    }

    // Generate screenshot URL
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

    return NextResponse.json({
      success: true,
      data: {
        url,
        screenshotUrl,
        expiresIn: '1 hour',
      },
    });
  } catch (error) {
    console.error('Screenshot generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate screenshot',
      },
      { status: 500 }
    );
  }
}

