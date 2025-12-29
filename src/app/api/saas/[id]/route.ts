import { NextRequest, NextResponse } from 'next/server';
import { sampleSaaS } from '@/data/sampleData';

// GET /api/saas/[id] - Get a single SaaS product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const saas = sampleSaaS.find(s => s.id === id);

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

// PUT /api/saas/[id] - Update a SaaS product (for future database integration)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // In a real app, this would update the database
    // For now, just return success with the updated data
    return NextResponse.json({
      success: true,
      data: { id, ...body },
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

// DELETE /api/saas/[id] - Delete a SaaS product (for future database integration)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // In a real app, this would delete from the database
    // For now, just return success
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

