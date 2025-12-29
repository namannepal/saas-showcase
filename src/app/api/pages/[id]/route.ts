import { NextRequest, NextResponse } from 'next/server';
import { samplePages } from '@/data/sampleData';

// GET /api/pages/[id] - Get a single page by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const page = samplePages.find(p => p.id === id);

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

// PUT /api/pages/[id] - Update a page (for future database integration)
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

// DELETE /api/pages/[id] - Delete a page (for future database integration)
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

