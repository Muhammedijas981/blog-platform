# 📝 Multi-User Blogging Platform

**Full-Stack Developer Position Submission - Kapybara HQ**

A production-ready blogging platform built with Next.js 16, featuring type-safe APIs, rich text editing, category management, and image uploads. Developed as part of the technical assessment for the Full-Stack Developer position at Kapybara HQ.

---

## 🚀 Live Demo

**[View Live Application →](your-deployment-url-here)**

> Deployed on Vercel with Neon PostgreSQL database

---

## 📋 Table of Contents

1. [Quick Start](#-quick-start)
2. [Tech Stack](#️-tech-stack)
3. [Features Implemented](#-features-implemented)
4. [Project Structure](#-project-structure)
5. [Architecture Decisions](#-architecture-decisions)
6. [Environment Setup](#-environment-setup)
7. [Time Breakdown](#-time-breakdown)
8. [Time Breakdown](#-time-breakdown)


---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Neon PostgreSQL** account (free tier works)
- **Cloudinary** account (free tier works)

### Installation (5 minutes)

1. Clone the repository
    cd blog-platform
2. Install dependencies
   npm install
3. Create .env file (see Environment Setup section)
   Edit .env with your credentials 
4. Push database schema to Neon
    npx drizzle-kit push
5. Start development server
   npm run dev
6. Open browser at http://localhost:3000
   text

### That's it! 🎉

The application is now running locally with a connected PostgreSQL database.

---

## 🛠️ Tech Stack

### Core Requirements (As Specified)

| Technology       | Version | Purpose                                    |
| ---------------- | ------- | ------------------------------------------ |
| **Next.js**      | 16.0.0  | Full-stack React framework with App Router |
| **TypeScript**   | 5.0+    | Type safety across entire codebase         |
| **PostgreSQL**   | Latest  | Relational database (hosted on Neon)       |
| **Drizzle ORM**  | Latest  | Type-safe database ORM                     |
| **tRPC**         | 11.0+   | End-to-end type-safe API layer             |
| **Zod**          | 3.22+   | Schema validation for tRPC                 |
| **React Query**  | 5.0+    | Server state management (via tRPC)         |
| **Zustand**      | 4.4+    | Client-side global state                   |
| **Tailwind CSS** | 3.4+    | Utility-first CSS framework                |

### Additional Libraries (For Better UX)

| Library               | Purpose                         | Time Saved |
| --------------------- | ------------------------------- | ---------- |
| **shadcn/ui**         | Pre-built accessible components | ~3-4 hours |
| **Tiptap**            | Rich text editor (WYSIWYG)      | Better UX  |
| **Cloudinary**        | Image CDN and storage           | ~2 hours   |
| **Material-UI Icons** | Outlined icon set               | ~1 hour    |
| **React Hot Toast**   | Toast notifications             | ~30 min    |
| **next-themes**       | Dark mode support               | ~1 hour    |

### Why These Choices?

1. **Neon PostgreSQL**: Serverless, auto-scaling, generous free tier, instant setup
2. **Tiptap over Markdown**: Better UX for content creators (trade-off: +2 hours dev time)
3. **shadcn/ui**: Reduced UI development time by 70%
4. **Cloudinary**: No server storage management, global CDN, free tier sufficient
5. **Monorepo**: Single deployment, shared types, faster development

---

## ✅ Features Implemented

### 🔴 Priority 1 - Core Requirements (100% Complete)

- [x] **Blog Post CRUD** - Create, read, update, delete with full validation
- [x] **Category CRUD** - Full category management system
- [x] **Multi-Category Assignment** - Assign multiple categories per post
- [x] **Blog Listing Page** - All posts with pagination and filters
- [x] **Individual Post View** - Detailed post page with full content
- [x] **Category Filtering** - Real-time filtering by category
- [x] **Responsive Navigation** - Mobile drawer menu, desktop horizontal nav
- [x] **Clean Professional UI** - Minimalist design, consistent spacing

**Status:** ✅ All Priority 1 features fully implemented and tested

### 🟡 Priority 2 - Expected Features (100% Complete)

- [x] **Landing Page** - 5 sections (Header, Hero, Features, Posts, CTA)
- [x] **Dashboard Page** - Post management with search and filters
- [x] **Draft vs Published** - Save drafts, publish when ready
- [x] **Loading States** - Animated spinners throughout app
- [x] **Error Handling** - User-friendly toast notifications
- [x] **Mobile Responsive** - Fully responsive across all devices
- [x] **Rich Text Editor** - Tiptap with formatting toolbar

**Status:** ✅ All Priority 2 features fully implemented

### 🟢 Priority 3 - Bonus Features (90% Complete)

- [x] **Full 5-Section Landing Page** - Complete with all sections
- [x] **Search Functionality** - Search by title and content
- [x] **Post Statistics** - Word count and reading time
- [x] **Dark Mode** - System-aware with manual toggle
- [x] **Image Upload** - Cloudinary integration for post images
- [x] **Post Preview** - Live preview before publishing
- [x] **Pagination** - Server-side pagination for efficiency
- [x] **Advanced Editor Features** - Bold, italic, lists, formatting
- [ ] **SEO Meta Tags** - Not implemented (time constraint)

**Status:** ✅ 8/9 bonus features implemented

---
## 📁 Project Structure

```text
blog-platform/
├── app/                          # Next.js 16 App Router
│   ├── page.tsx                  # Landing page (Hero + Features)
│   ├── posts/
│   │   ├── page.tsx              # All posts listing (with search/filter)
│   │   ├── new/page.tsx          # Create new post
│   │   └── [slug]/
│   │       ├── page.tsx          # View individual post
│   │       └── edit/page.tsx     # Edit post
│   ├── categories/
│   │   ├── manage/page.tsx       # Category CRUD dashboard
│   │   └── [slug]/page.tsx       # Posts by category
│   ├── api/trpc/[trpc]/route.ts  # tRPC API handler
│   ├── layout.tsx                # Root layout (theme provider)
│   └── globals.css               # Global Tailwind styles
│
├── components/
│   ├── forms/
│   │   ├── PostForm.tsx          # Post create/edit form
│   │   ├── RichTextEditor.tsx    # Tiptap editor wrapper
│   │   └── PostPreview.tsx       # Preview dialog
│   ├── layout/
│   │   ├── Header.tsx            # Navigation with mobile drawer
│   │   ├── Footer.tsx            # Footer component
│   │   └── ThemeToggle.tsx       # Dark mode toggle
│   ├── posts/
│   │   ├── PostCard.tsx          # Post card component
│   │   └── PostStats.tsx         # Word count & reading time
│   └── ui/                       # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── sheet.tsx             # Mobile drawer
│       └── ... (20+ components)
│
├── server/
│   ├── db/
│   │   ├── index.ts              # Drizzle database connection
│   │   └── schema.ts             # Database schema definitions
│   └── trpc/
│       ├── trpc.ts               # tRPC initialization & context
│       └── routers/
│           ├── index.ts          # Root router (aggregates all)
│           ├── post.ts           # Post CRUD procedures
│           └── category.ts       # Category CRUD procedures
│
├── lib/
│   └── utils.ts                  # Utility functions (date format, etc.)
│
├── trpc/
│   └── client.ts                 # tRPC React client setup
│
├── .env                          # Environment variables (not in git)
├── drizzle.config.ts             # Drizzle ORM configuration
├── tailwind.config.ts            # Tailwind CSS config
└── tsconfig.json                 # TypeScript configuration

```

### Why This Structure?

1. **App Router Organization**: Feature-based routing matches Next.js 16 conventions
2. **Server/Client Separation**: Clear boundary between server code and client components
3. **Component Co-location**: Related components grouped by feature
4. **Single tRPC Router**: All API routes aggregated in one place for discoverability
5. **Flat Hierarchy**: Minimal nesting for easier navigation

---

## 🏗 Architecture Decisions

### 1. Monorepo Approach (Single Project)

**Decision:** Full-stack in one Next.js project

**Why:**

- ✅ Next.js 16 App Router is designed for full-stack
- ✅ Shared TypeScript types between frontend/backend
- ✅ Single deployment (Vercel optimized for this)
- ✅ Faster development (no API versioning issues)
- ✅ tRPC requires monorepo for type inference

### 2. Neon PostgreSQL

**Decision:** Chose Neon over Supabase or local PostgreSQL

**Why:**

- ✅ **Serverless**: Auto-scales to zero (cost-effective)
- ✅ **Instant setup**: Database ready in 30 seconds
- ✅ **Generous free tier**: 3GB storage, 100 hours compute
- ✅ **Branch database**: Each git branch can have its own DB
- ✅ **Connection pooling**: Built-in, no extra setup

**Benefits of Neon:**

- ✅ Serverless (no server management)
- ✅ Auto-scaling (scales to zero when idle)
- ✅ Branch databases (test schema changes safely)
- ✅ Fast setup (30 seconds)

**Free Tier Limits:** Perfect for demo projects

- Storage: 3 GB
- Compute: 100 hours/month
- Projects: Unlimited

### 3. Cloudinary for Images

**Decision:** Client-side upload to Cloudinary CDN

**Why:**

- ✅ **No server storage**: Offload to CDN
- ✅ **Global delivery**: Fast worldwide
- ✅ **Free tier**: 10GB storage, 25GB bandwidth/month
- ✅ **Automatic optimization**: WebP conversion, resizing
- ✅ **Simple setup**: Unsigned upload preset

**Benefits of Cloudinary:**

- ✅ No server storage needed
- ✅ Automatic image optimization
- ✅ Global CDN delivery
- ✅ Free tier: 10GB storage

**Alternative Considered:** Next.js /public folder

- ❌ Would require file system handling
- ❌ No CDN benefits
- ❌ Slower for users far from server

## 🔐 Environment Setup

### 1. Create `.env` File

Create a `.env` file in the project root:

```bash
# Database Connection (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Cloudinary Configuration (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="blog_uploads"
```


### 2. Neon PostgreSQL Setup (2 minutes)

1. **Sign up** at [neon.tech](https://neon.tech) (free, no credit card)
2. **Create project** → Name it "blog-platform"
3. **Copy connection string** from dashboard
4. **Paste** into `.env` as `DATABASE_URL`

### 3. Cloudinary Setup (3 minutes)

1. **Sign up** at [cloudinary.com](https://cloudinary.com) (free)
2. Go to **Settings → Upload → Upload Presets**
3. Click **"Add upload preset"**
4. Configure:
   - **Preset name:** `blog_uploads`
   - **Signing Mode:** Select **"Unsigned"** (important!)
   - **Folder:** `blog-platform/posts` (optional)
   - **Allowed formats:** `jpg, png, webp`
   - **Max file size:** `2 MB`
5. **Copy** Cloud Name and Preset Name to `.env`

### 4. Initialize Database Schema

npx drizzle-kit push

This creates all tables in your Neon database based on `server/db/schema.ts`.

---

## ⏱ Time Breakdown

**Total Time Invested:** ~15 hours

| Phase                          | Tasks                                                                         | Time Spent |
| ------------------------------ | ----------------------------------------------------------------------------- | ---------- |
| **Day 1-2: Setup & Backend**   | Project init, Neon setup, Drizzle schema, tRPC routers, CRUD operations       | ~4 hours   |
| **Day 3-4: Core Features**     | Post listing, individual post view, post form, category management, filtering | ~5 hours   |
| **Day 5-6: Priority 2 & UI**   | Landing page, rich text editor, mobile responsive, loading states, dark mode  | ~4 hours   |
| **Day 7: Polish & Deployment** | Image upload, search, pagination, bug fixes, README, Vercel deployment        | ~2 hours   |

### Time-Saving Decisions

| Decision                             | Time Saved     |
| ------------------------------------ | -------------- |
| Used shadcn/ui components            | ~3-4 hours     |
| Neon (vs local PostgreSQL setup)     | ~1 hour        |
| Cloudinary (vs custom file handling) | ~2 hours       |
| tRPC (vs REST API boilerplate)       | ~2 hours       |
| **Total Saved:**                     | **~8-9 hours** |

## Acknowledgments

This project was built as part of the technical assessment for the **Full-Stack Developer** position at **Kapybara HQ**.

## 📄 License

This project was created for assessment purposes. All rights reserved.

