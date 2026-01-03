import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { takeScreenshot } from '@/lib/screenshot';
import { downloadAndSaveScreenshot } from '@/lib/screenshotStorage';

// POST /api/saas/[id]/screenshot - Capture a new screenshot for a SaaS product
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch the SaaS product
    const { data: saas, error: fetchError } = await supabase
      .from('saas_products')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !saas) {
      return NextResponse.json(
        {
          success: false,
          error: 'SaaS product not found',
        },
        { status: 404 }
      );
    }

    // Take screenshot and upload to Cloudinary
    const result = await downloadAndSaveScreenshot(saas.url, {
      name: saas.name,
      pageType: saas.page_type || 'landing',
    });

    // Update the database with new screenshot URL and metadata
    const { data: updatedSaas, error: updateError } = await supabase
      .from('saas_products')
      .update({
        image_url: result.screenshotPath,
        metadata: result.metadata || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      data: updatedSaas,
      message: 'Screenshot captured successfully',
    });
  } catch (error: any) {
    console.error('Screenshot capture error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to capture screenshot',
      },
      { status: 500 }
    );
  }
}

