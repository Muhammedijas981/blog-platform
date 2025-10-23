#!/bin/bash

# Blog Platform Project Structure Setup Script
# Run this script from the blog-platform directory
# This script only creates files/folders that don't already exist

echo "🚀 Setting up blog platform project structure..."

# Create directories only if they don't exist
echo "📁 Creating directory structure..."

# App Router directories
mkdir -p app/api/trpc/\[trpc\]
mkdir -p app/posts/\[slug\]/edit
mkdir -p app/posts/new
mkdir -p app/categories/\[slug\]
mkdir -p app/categories/manage

# Server directories (NEW)
mkdir -p server/db
mkdir -p server/trpc/routers

# tRPC client directories (NEW)
mkdir -p trpc

# Components directories (NEW)
mkdir -p components/ui
mkdir -p components/forms
mkdir -p components/posts
mkdir -p components/categories
mkdir -p components/layout

# Store directories (NEW)
mkdir -p store

# Lib directories (NEW)
mkdir -p lib

# Hooks directories (NEW)
mkdir -p hooks

# Types directories (NEW)
mkdir -p types

# Public directories (should exist, but ensure subdirectories)
mkdir -p public/images
mkdir -p public/icons

# Drizzle directory
mkdir -p drizzle

echo "📝 Creating new files (skipping existing ones)..."

# App Router files
[ ! -f app/api/trpc/\[trpc\]/route.ts ] && touch app/api/trpc/\[trpc\]/route.ts
[ ! -f app/posts/page.tsx ] && touch app/posts/page.tsx
[ ! -f app/posts/\[slug\]/page.tsx ] && touch app/posts/\[slug\]/page.tsx
[ ! -f app/posts/\[slug\]/edit/page.tsx ] && touch app/posts/\[slug\]/edit/page.tsx
[ ! -f app/posts/new/page.tsx ] && touch app/posts/new/page.tsx
[ ! -f app/categories/page.tsx ] && touch app/categories/page.tsx
[ ! -f app/categories/\[slug\]/page.tsx ] && touch app/categories/\[slug\]/page.tsx
[ ! -f app/categories/manage/page.tsx ] && touch app/categories/manage/page.tsx
[ ! -f app/loading.tsx ] && touch app/loading.tsx
[ ! -f app/error.tsx ] && touch app/error.tsx
[ ! -f app/not-found.tsx ] && touch app/not-found.tsx

# Server files (NEW)
[ ! -f server/db/schema.ts ] && touch server/db/schema.ts
[ ! -f server/db/index.ts ] && touch server/db/index.ts
[ ! -f server/trpc/trpc.ts ] && touch server/trpc/trpc.ts
[ ! -f server/trpc/root.ts ] && touch server/trpc/root.ts
[ ! -f server/trpc/routers/post.ts ] && touch server/trpc/routers/post.ts
[ ! -f server/trpc/routers/category.ts ] && touch server/trpc/routers/category.ts

# tRPC client files (NEW)
[ ! -f trpc/client.ts ] && touch trpc/client.ts
[ ! -f trpc/Provider.tsx ] && touch trpc/Provider.tsx

# UI Components (NEW)
[ ! -f components/ui/Button.tsx ] && touch components/ui/Button.tsx
[ ! -f components/ui/Input.tsx ] && touch components/ui/Input.tsx
[ ! -f components/ui/Card.tsx ] && touch components/ui/Card.tsx
[ ! -f components/ui/Badge.tsx ] && touch components/ui/Badge.tsx
[ ! -f components/ui/Modal.tsx ] && touch components/ui/Modal.tsx
[ ! -f components/ui/Toast.tsx ] && touch components/ui/Toast.tsx
[ ! -f components/ui/Spinner.tsx ] && touch components/ui/Spinner.tsx

# Form Components (NEW)
[ ! -f components/forms/PostForm.tsx ] && touch components/forms/PostForm.tsx
[ ! -f components/forms/CategoryForm.tsx ] && touch components/forms/CategoryForm.tsx
[ ! -f components/forms/RichTextEditor.tsx ] && touch components/forms/RichTextEditor.tsx
[ ! -f components/forms/CategorySelect.tsx ] && touch components/forms/CategorySelect.tsx

# Post Components (NEW)
[ ! -f components/posts/PostCard.tsx ] && touch components/posts/PostCard.tsx
[ ! -f components/posts/PostList.tsx ] && touch components/posts/PostList.tsx
[ ! -f components/posts/PostDetail.tsx ] && touch components/posts/PostDetail.tsx
[ ! -f components/posts/PostFilters.tsx ] && touch components/posts/PostFilters.tsx
[ ! -f components/posts/PostActions.tsx ] && touch components/posts/PostActions.tsx

# Category Components (NEW)
[ ! -f components/categories/CategoryCard.tsx ] && touch components/categories/CategoryCard.tsx
[ ! -f components/categories/CategoryList.tsx ] && touch components/categories/CategoryList.tsx
[ ! -f components/categories/CategoryBadge.tsx ] && touch components/categories/CategoryBadge.tsx
[ ! -f components/categories/CategoryManager.tsx ] && touch components/categories/CategoryManager.tsx

# Layout Components (NEW)
[ ! -f components/layout/Header.tsx ] && touch components/layout/Header.tsx
[ ! -f components/layout/Footer.tsx ] && touch components/layout/Footer.tsx
[ ! -f components/layout/Navbar.tsx ] && touch components/layout/Navbar.tsx
[ ! -f components/layout/Sidebar.tsx ] && touch components/layout/Sidebar.tsx

# Store files (NEW)
[ ! -f store/usePostStore.ts ] && touch store/usePostStore.ts
[ ! -f store/useUIStore.ts ] && touch store/useUIStore.ts
[ ! -f store/index.ts ] && touch store/index.ts

# Lib files (NEW)
[ ! -f lib/utils.ts ] && touch lib/utils.ts
[ ! -f lib/slugify.ts ] && touch lib/slugify.ts
[ ! -f lib/formatDate.ts ] && touch lib/formatDate.ts
[ ! -f lib/cn.ts ] && touch lib/cn.ts
[ ! -f lib/validators.ts ] && touch lib/validators.ts

# Hooks files (NEW)
[ ! -f hooks/useDebounce.ts ] && touch hooks/useDebounce.ts
[ ! -f hooks/useMediaQuery.ts ] && touch hooks/useMediaQuery.ts
[ ! -f hooks/useToast.ts ] && touch hooks/useToast.ts

# Types files (NEW)
[ ! -f types/index.ts ] && touch types/index.ts
[ ! -f types/post.types.ts ] && touch types/post.types.ts
[ ! -f types/category.types.ts ] && touch types/category.types.ts

# Config files (only if they don't exist)
[ ! -f .env.example ] && touch .env.example
[ ! -f drizzle.config.ts ] && touch drizzle.config.ts

echo ""
echo "✅ Project structure setup complete!"
echo ""
echo "📊 Summary:"
echo "   - All necessary directories created"
echo "   - New files created (existing files preserved)"
echo "   - Ready for development!"
echo ""
echo "📋 Next steps:"
echo "1. Install dependencies: npm install"
echo "2. Set up your .env.local file"
echo "3. Configure drizzle.config.ts"
echo "4. Start building your components!"
echo ""
echo "🎉 Happy coding!"