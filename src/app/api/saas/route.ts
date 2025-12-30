import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isScreenshotConfigured } from '@/lib/screenshot';
import { downloadAndSaveScreenshot } from '@/lib/screenshotStorage';

// GET /api/saas - Get all SaaS products
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    // Start building query
    let query = supabase
      .from('saas_products')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by category
    if (category) {
      query = query.eq('category', category);
    }

    // Filter by featured
    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    // Search by name or description (using ilike for case-insensitive)
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
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
    console.error('Error fetching SaaS products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch SaaS products',
      },
      { status: 500 }
    );
  }
}

// POST /api/saas - Create a new SaaS product with automatic screenshot capture
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'description', 'url', 'category'];
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
    let imageUrl = body.imageUrl || null;
    let metadata = body.metadata || {};
    
    if (isScreenshotConfigured() && !body.imageUrl) {
      try {
        // Download screenshot and upload to Cloudinary
        const result = await downloadAndSaveScreenshot(body.url, {
          name: body.name,
          pageType: body.pageType || 'landing',
          fullPage: true,
          viewportWidth: 1920,
          viewportHeight: 1080,
        });
        imageUrl = result.screenshotPath;
        
        // Merge font metadata
        if (result.metadata) {
          metadata = { ...metadata, ...result.metadata };
        }
        
        console.log(`Screenshot uploaded to Cloudinary: ${imageUrl}`);
        if (metadata) {
          console.log(`Metadata captured:`, metadata);
        }
      } catch (error) {
        console.error('Failed to capture and save screenshot:', error);
        // Continue without screenshot
      }
    }

    // Insert into Supabase
    const { data: saasData, error: saasError } = await supabase
      .from('saas_products')
      .insert([
        {
          name: body.name,
          description: body.description,
          url: body.url,
          image_url: imageUrl,
          category: body.category,
          page_type: body.pageType || 'landing',
          tags: body.tags || [],
          featured: body.featured || false,
          metadata: metadata,
        },
      ])
      .select()
      .single();

    if (saasError) {
      throw saasError;
    }

    // Also create a showcase page for the landing page
    const { data: pageData, error: pageError } = await supabase
      .from('showcase_pages')
      .insert([
        {
          saas_id: saasData.id,
          title: `${body.name} Landing Page`,
          description: body.description,
          page_url: body.url,
          screenshot_url: imageUrl,
          page_type: 'landing',
          tags: body.tags || [],
          metadata: metadata,
        },
      ])
      .select()
      .single();

    if (pageError) {
      console.error('Failed to create showcase page:', pageError);
      // Don't fail the whole request, just log it
    }

    return NextResponse.json(
      {
        success: true,
        data: saasData,
        showcasePage: pageData,
        message: 'SaaS product and showcase page created successfully',
        screenshotCaptured: !!imageUrl,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating SaaS product:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create SaaS product',
      },
      { status: 500 }
    );
  }
}

// PUT /api/saas/:id - Update a SaaS product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing product ID',
        },
        { status: 400 }
      );
    }

    // Build update object
    const updates: any = {};
    if (body.name) updates.name = body.name;
    if (body.description) updates.description = body.description;
    if (body.url) updates.url = body.url;
    if (body.category) updates.category = body.category;
    if (body.tags) updates.tags = body.tags;
    if (body.featured !== undefined) updates.featured = body.featured;
    if (body.metadata) updates.metadata = body.metadata;

    // Optionally re-capture screenshot
    if (body.recaptureScreenshot && isScreenshotConfigured()) {
      try {
        const result = await downloadAndSaveScreenshot(body.url || body.currentUrl, {
          name: body.name || 'untitled',
          pageType: body.page_type || body.pageType || 'landing',
          fullPage: true,
          viewportWidth: 1920,
          viewportHeight: 1080,
        });
        updates.image_url = result.screenshotPath;
        if (result.metadata) {
          updates.metadata = { ...updates.metadata, ...result.metadata };
        }
      } catch (error) {
        console.error('Failed to re-capture screenshot:', error);
      }
    } else if (body.imageUrl) {
      updates.image_url = body.imageUrl;
    }

    // Update in Supabase
    const { data, error } = await supabase
      .from('saas_products')
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
      message: 'SaaS product updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating SaaS product:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update SaaS product',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/saas/:id - Delete a SaaS product
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing product ID',
        },
        { status: 400 }
      );
    }

    // Delete from Supabase (cascade will delete related pages)
    const { error } = await supabase
      .from('saas_products')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'SaaS product deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting SaaS product:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete SaaS product',
      },
      { status: 500 }
    );
  }
}
