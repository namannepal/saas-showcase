import { NextResponse } from 'next/server';
import { sampleSaaS } from '@/data/sampleData';
import type { Category } from '@/types';

const categories: Category[] = [
  'AI/ML',
  'Analytics',
  'CRM',
  'Developer Tools',
  'E-commerce',
  'Marketing',
  'Productivity',
  'Design',
  'Communication',
  'Finance',
  'Other',
];

// GET /api/categories - Get all categories with counts
export async function GET() {
  try {
    // Count SaaS products per category
    const categoriesWithCounts = categories.map(category => ({
      name: category,
      count: sampleSaaS.filter(s => s.category === category).length,
    }));

    return NextResponse.json({
      success: true,
      data: categoriesWithCounts,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}

