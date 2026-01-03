# Resource Page Type Setup Guide

This guide explains how to add the new "Resource Page" type and populate it with 25 SaaS products.

## Step 1: Run Database Migrations

You need to run two SQL scripts in your Supabase SQL Editor (in order):

### 1.1 Add Resource Page Type to Database Constraint

Run the file: `add-resource-page-type.sql`

This will:
- Add 'resource' to the page_type constraint
- Update the slug generation function to handle resource pages (URLs will end with `-resource-page`)

### 1.2 Insert 25 Resource Pages

Run the file: `add-resource-pages.sql`

This will safely insert 25 SaaS products with the resource page type:
- Squarespace, Thinkific, BigCommerce, Figma, Asana, Keap, Mailchimp, Calendly, Leadpages, Canva, Tableau, Semrush, Carrd, PandaDoc, Unbounce, SurveyMonkey, Pipedrive, Bynder, Ghost, Ramp, ClickUp, Webflow, Jasper, Pitch, and Slack

**Important:** This script is safe to run multiple times. It will:
- ✅ Only insert NEW resource pages (won't create duplicates)
- ✅ NOT affect any existing entries with different page types
- ✅ Allow the same SaaS name with different page types (e.g., "Figma Landing Page" and "Figma Resource Page" can both exist)

The script uses a `WHERE NOT EXISTS` clause to check if a resource page with the same name already exists before inserting.

## Step 2: Application Code Updates

All application code has been updated automatically! ✅

### Updated Files:
1. **`src/app/[pageType]/page.tsx`** - Added 'resource-pages' route and labels
2. **`src/app/admin/add/page.tsx`** - Added "Resource Page" option in form
3. **`src/app/admin/edit/[id]/page.tsx`** - Added "Resource Page" option in form
4. **`src/components/showcase/Footer.tsx`** - Added "Resource Pages" link
5. **`src/app/pages/[slug]/page.tsx`** - Added "Resource Page" suffix to page titles

## Step 3: Generate Screenshots

After adding the pages to the database, you'll need to generate screenshots for each one:

### Option 1: Using the Admin Dashboard
1. Go to `/admin` (you must be logged in)
2. Click on each resource page
3. Click "Edit"
4. Click "Recapture Screenshot" button

### Option 2: Using the API (bulk screenshot generation)
You can create a simple script to generate screenshots for all resource pages at once. Here's an example:

```bash
# Get all resource pages without screenshots
curl -X GET "http://localhost:3000/api/saas"

# For each resource page, trigger screenshot
curl -X PUT "http://localhost:3000/api/saas/[id]" \
  -H "Content-Type: application/json" \
  -d '{"captureScreenshot": true}'
```

## What You'll Get

After completing these steps, you'll have:

✅ **New page type**: Resource Pages  
✅ **New route**: `/resource-pages` - Lists all resource page examples  
✅ **25 new products**: All with properly formatted slugs (e.g., `squarespace-resource-page`)  
✅ **Page titles**: "Squarespace Resource Page - SaaS Showcase"  
✅ **Footer link**: "Resource Pages" in the footer navigation  
✅ **Admin forms**: "Resource Page" option when adding/editing products  

## URL Format

Resource pages will have URLs like:
- `/resource-pages` - List all resource pages
- `/pages/squarespace-resource-page` - Individual resource page
- `/pages/figma-resource-page` - Individual resource page
- etc.

## Notes

- Screenshots need to be generated manually or via API since these are external resources
- The slug generation is automatic and will append `-resource-page` to each name
- All 25 products have been categorized appropriately (Design, Marketing, Productivity, etc.)
- Each product includes a proper description and resource URL

