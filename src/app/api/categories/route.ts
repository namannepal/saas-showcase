import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
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
    // Fetch all SaaS products from Supabase
    const { data: saasProducts } = await supabase
      .from('saas_products')
      .select('category');

    // Count SaaS products per category
    const categoriesWithCounts = categories.map(category => ({
      name: category,
      count: saasProducts?.filter(s => s.category === category).length || 0,
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

