import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/saas/[id] - Get a single SaaS product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: saas } = await supabase
      .from('saas_products')
      .select('*')
      .eq('id', id)
      .single();

    if (!saas) {
      return NextResponse.json(
        {
          success: false,
          error: 'SaaS product not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: saas,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch SaaS product',
      },
      { status: 500 }
    );
  }
}

// PUT /api/saas/[id] - Update a SaaS product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from('saas_products')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      message: 'SaaS product updated successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update SaaS product',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/saas/[id] - Delete a SaaS product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('saas_products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'SaaS product deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete SaaS product',
      },
      { status: 500 }
    );
  }
}

