import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isScreenshotConfigured } from '@/lib/screenshot';
import { downloadAndSaveScreenshot } from '@/lib/screenshotStorage';

// GET /api/pages - Get all showcase pages
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const saasId = searchParams.get('saasId');
    const pageType = searchParams.get('pageType');
    const search = searchParams.get('search');

    // Start building query
    let query = supabase
      .from('showcase_pages')
      .select('*, saas_products(*)')
      .order('created_at', { ascending: false });

    // Filter by SaaS product
    if (saasId) {
      query = query.eq('saas_id', saasId);
    }

    // Filter by page type
    if (pageType) {
      query = query.eq('page_type', pageType);
    }

    // Search by title or description
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Error fetching showcase pages:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch showcase pages',
      },
      { status: 500 }
    );
  }
}

// POST /api/pages - Create a new showcase page with automatic screenshot capture
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['saasId', 'title', 'pageUrl', 'pageType'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    // Automatically capture and upload screenshot to Cloudinary if configured
    let screenshotUrl = body.screenshotUrl || null;
    let metadata = body.metadata || {};
    
    if (isScreenshotConfigured() && !body.screenshotUrl) {
      try {
        // Download screenshot and upload to Cloudinary
        const result = await downloadAndSaveScreenshot(body.pageUrl, {
          fullPage: true,
          viewportWidth: 1920,
          viewportHeight: 1080,
        });
        screenshotUrl = result.screenshotPath;
        
        // Merge font metadata
        if (result.metadata) {
          metadata = { ...metadata, ...result.metadata };
        }
        
        console.log(`Screenshot uploaded to Cloudinary: ${screenshotUrl}`);
        if (metadata) {
          console.log(`Metadata captured:`, metadata);
        }
      } catch (error) {
        console.error('Failed to capture and save screenshot:', error);
        // Continue without screenshot
      }
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('showcase_pages')
      .insert([
        {
          saas_id: body.saasId,
          title: body.title,
          description: body.description || null,
          page_url: body.pageUrl,
          screenshot_url: screenshotUrl,
          page_type: body.pageType,
          tags: body.tags || [],
          metadata: metadata,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        data,
        message: 'Showcase page created successfully',
        screenshotCaptured: !!screenshotUrl,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating showcase page:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create showcase page',
      },
      { status: 500 }
    );
  }
}

// PUT /api/pages/:id - Update a showcase page
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing page ID',
        },
        { status: 400 }
      );
    }

    // Build update object
    const updates: any = {};
    if (body.title) updates.title = body.title;
    if (body.description) updates.description = body.description;
    if (body.pageUrl) updates.page_url = body.pageUrl;
    if (body.pageType) updates.page_type = body.pageType;
    if (body.tags) updates.tags = body.tags;
    if (body.metadata) updates.metadata = body.metadata;

    // Optionally re-capture screenshot
    if (body.recaptureScreenshot && isScreenshotConfigured()) {
      try {
        const result = await downloadAndSaveScreenshot(body.pageUrl || body.currentPageUrl, {
          fullPage: true,
          viewportWidth: 1920,
          viewportHeight: 1080,
        });
        updates.screenshot_url = result.screenshotPath;
        if (result.metadata) {
          updates.metadata = { ...updates.metadata, ...result.metadata };
        }
      } catch (error) {
        console.error('Failed to re-capture screenshot:', error);
      }
    } else if (body.screenshotUrl) {
      updates.screenshot_url = body.screenshotUrl;
    }

    // Update in Supabase
    const { data, error } = await supabase
      .from('showcase_pages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Showcase page updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating showcase page:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update showcase page',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/pages/:id - Delete a showcase page
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing page ID',
        },
        { status: 400 }
      );
    }

    // Delete from Supabase
    const { error } = await supabase
      .from('showcase_pages')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Showcase page deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting showcase page:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete showcase page',
      },
      { status: 500 }
    );
  }
}
