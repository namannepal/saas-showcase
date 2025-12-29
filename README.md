# SaaS Showcase

A modern web application for showcasing and discovering the best SaaS landing pages, pricing pages, and design patterns. Built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

## ✨ Features

- 🎨 **Beautiful Dark Mode UI** - Modern, responsive design with Tailwind CSS and shadcn/ui
- 🔍 **Browse & Discover** - Explore SaaS products and their pages by category and tags
- 📸 **Auto Screenshots** - Automatic full-page screenshot capture via ScreenshotOne API
- ☁️ **Cloud Storage** - Images hosted on Cloudinary with automatic optimization
- 🗄️ **Supabase Backend** - PostgreSQL database with real-time capabilities
- 🔗 **SEO-Friendly URLs** - Clean slug-based URLs (e.g., `/pages/stripe-landing-page`)
- ⚡ **Fast & Performant** - Built with Next.js 14 App Router with SSR
- 🎯 **Type-Safe** - Full TypeScript support throughout

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui + Radix UI
- **Database:** Supabase (PostgreSQL)
- **Image Hosting:** Cloudinary
- **Screenshot API:** ScreenshotOne
- **Font:** Geist Sans & Geist Mono

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier works great!)
- Cloudinary account (free tier: 25GB storage, 25 credits/month)
- ScreenshotOne API key (for screenshots)

### Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd saas-showcase
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

Create a `.env.local` file in the root directory:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ScreenshotOne
SCREENSHOTONE_ACCESS_KEY=your_access_key
SCREENSHOTONE_SECRET_KEY=your_secret_key

# App URL (for metadata)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Where to find these keys:**

- **Supabase:** Dashboard → Project Settings → API
  - URL: Found in "Project URL"
  - Anon Key: Found in "Project API keys" (use `anon` `public` key)
- **Cloudinary:** Dashboard → Account Details
  - Cloud Name, API Key, API Secret all visible there
- **ScreenshotOne:** Dashboard → API Access

4. **Set up the database:**

Go to your Supabase SQL Editor and run the `supabase-schema.sql` file. This will:
- Create `saas_products` and `showcase_pages` tables
- Set up indexes for performance
- Add slug generation functions and triggers
- Insert sample data (Stripe, Ballpark, Gladia, Hera)

5. **Run the development server:**
```bash
npm run dev
```

6. **Open your browser:**
```
http://localhost:3000
```

## 📁 Project Structure

```
saas-showcase/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   │   ├── saas/            # SaaS CRUD endpoints
│   │   │   ├── pages/           # Pages CRUD endpoints
│   │   │   ├── categories/      # Categories endpoint
│   │   │   └── screenshot/      # Screenshot generation
│   │   ├── pages/[slug]/        # Individual showcase page
│   │   ├── saas/[id]/           # Individual SaaS product page
│   │   ├── layout.tsx           # Root layout (navbar, footer)
│   │   ├── page.tsx             # Homepage
│   │   └── globals.css          # Global styles (dark mode colors)
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   └── showcase/            # Custom components
│   │       ├── Navbar.tsx
│   │       ├── Footer.tsx
│   │       ├── ShowcaseCard.tsx
│   │       └── ShareButtons.tsx
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client
│   │   ├── cloudinary.ts       # Cloudinary upload/delete
│   │   ├── screenshot.ts       # ScreenshotOne API
│   │   ├── screenshotStorage.ts # Screenshot download & upload
│   │   └── utils.ts            # Utilities
│   └── types/
│       └── index.ts            # TypeScript interfaces
├── public/
│   └── screenshots/            # Local screenshots (deprecated)
└── supabase-schema.sql         # Database schema
```

## 🔌 API Endpoints

### SaaS Products

**GET** `/api/saas`
- Get all SaaS products
- Query params: `category`, `featured`, `search`

**POST** `/api/saas`
- Create new SaaS product
- Automatically captures screenshot if `imageUrl` not provided
- Body:
```json
{
  "name": "Stripe",
  "description": "Payment infrastructure for the internet",
  "url": "https://stripe.com",
  "category": "Finance",
  "tags": ["payments", "fintech"],
  "featured": true
}
```

**GET** `/api/saas/[id]` - Get single SaaS product

**PUT** `/api/saas/[id]` - Update SaaS product

**DELETE** `/api/saas/[id]` - Delete SaaS product (and its Cloudinary image)

### Showcase Pages

**GET** `/api/pages`
- Get all showcase pages
- Query params: `saasId`, `pageType`, `search`

**POST** `/api/pages`
- Create new showcase page
- Automatically captures screenshot and generates slug
- Body:
```json
{
  "saasId": "uuid-here",
  "title": "Stripe Landing Page",
  "description": "Clean, modern landing page...",
  "pageUrl": "https://stripe.com",
  "pageType": "landing",
  "tags": ["fintech", "payments"]
}
```

**GET** `/api/pages/[id]` - Get single page

**PUT** `/api/pages/[id]` - Update page

**DELETE** `/api/pages/[id]` - Delete page

### Categories

**GET** `/api/categories` - Get all categories with counts

## 📸 How Screenshots Work

1. **Automatic Capture:** When you add a new SaaS or page, the system automatically:
   - Calls ScreenshotOne API with optimized settings
   - Captures full-page screenshot (1920x1080 viewport)
   - Downloads the image buffer
   - Uploads to Cloudinary
   - Stores the Cloudinary URL in Supabase

2. **ScreenshotOne Settings:**
   - Full page: ✅
   - Format: JPG (optimized for web)
   - Quality: 80
   - Block ads, cookie banners, trackers: ✅
   - Capture font metadata: ✅

3. **Cloudinary Benefits:**
   - Automatic image optimization
   - WebP/AVIF conversion
   - CDN delivery worldwide
   - 25GB free storage

## 🗄️ Database Schema

### `saas_products` table
- `id` (UUID, primary key)
- `name` (text)
- `description` (text)
- `url` (text, unique)
- `image_url` (text) - Cloudinary URL
- `category` (text)
- `tags` (text array)
- `featured` (boolean)
- `metadata` (jsonb) - Stores fonts, etc.
- `created_at`, `updated_at` (timestamps)

### `showcase_pages` table
- `id` (UUID, primary key)
- `saas_id` (UUID, foreign key)
- `title` (text)
- `slug` (text, unique) - Auto-generated from title
- `description` (text)
- `page_url` (text)
- `screenshot_url` (text) - Cloudinary URL
- `page_type` (enum: landing, pricing, features, about, dashboard, other)
- `tags` (text array)
- `metadata` (jsonb)
- `created_at`, `updated_at` (timestamps)

**Slug generation:** Automatically creates SEO-friendly slugs:
- "Stripe Landing Page" → `stripe-landing-page`
- Handles duplicates: `landing-page`, `landing-page-2`, etc.

## 🎨 Design System

### Colors (Dark Mode)
- Background: `#2E2E2E` (soft dark grey, not pure black)
- Card: `#383838`
- Accents: `#474747`
- Text: White/grey shades

### Components
- Buttons: `rounded-sm` (subtle corners)
- Cards: `rounded-sm`, no border, subtle shadow
- Images: `rounded-sm`

## 🧪 Adding New Content

### Via API (Recommended)

Add a new SaaS product:
```bash
curl -X POST http://localhost:3000/api/saas \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Stripe",
    "description": "Payment infrastructure for the internet",
    "url": "https://stripe.com",
    "category": "Finance",
    "tags": ["payments", "fintech"],
    "featured": true
  }'
```

The system will automatically:
1. Capture a screenshot of the URL
2. Upload to Cloudinary
3. Save to Supabase
4. Create a showcase page entry

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy!

### Environment Variables for Production

Make sure to add all the same env vars from `.env.local` to your deployment platform.

## 📝 Development Notes

### Adding shadcn/ui Components
```bash
npx shadcn@latest add [component-name]
```

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## 🔐 Security Notes

- RLS (Row Level Security) is enabled on Supabase tables
- Currently allows public read and write (change in production!)
- API routes use server-side Supabase client
- Cloudinary credentials are server-side only

## 📊 Free Tier Limits

- **Supabase:** 500MB database, 1GB file storage, 2GB bandwidth
- **Cloudinary:** 25GB storage, 25 credits/month (≈25k transformations)
- **ScreenshotOne:** Check your plan

## 🤝 Contributing

Contributions welcome! Feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🆘 Common Issues

**"Supabase connection error"**
- Check your Supabase URL and anon key
- Make sure you ran the schema SQL

**"Cloudinary upload failed"**
- Verify your cloud name, API key, and secret
- Check free tier limits

**"Screenshot failed"**
- Verify ScreenshotOne API keys
- Check the URL is accessible
- Some sites block automated screenshots

**"Slug already exists"**
- The system auto-handles duplicates
- If issues persist, check the trigger is created

## 📞 Support

Need help? Open an issue on GitHub!

---

Built with ❤️ using Next.js, Supabase, and Cloudinary
