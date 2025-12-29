import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/pages/[id] - Get a single page by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: page } = await supabase
      .from('showcase_pages')
      .select('*')
      .eq('id', id)
      .single();

    if (!page) {
      return NextResponse.json(
        {
          success: false,
          error: 'Page not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: page,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch page',
      },
      { status: 500 }
    );
  }
}

// PUT /api/pages/[id] - Update a page
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from('showcase_pages')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      message: 'Page updated successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update page',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/pages/[id] - Delete a page
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('showcase_pages')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Page deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete page',
      },
      { status: 500 }
    );
  }
}

