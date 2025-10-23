"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import CategoryIcon from "@mui/icons-material/Category";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <ArticleIcon className="h-6 w-6" />
          <span className="text-xl font-bold">Blog Platform</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              isActive("/") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <HomeIcon className="h-4 w-4" />
            Home
          </Link>
          <Link
            href="/posts"
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              isActive("/posts") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <ArticleIcon className="h-4 w-4" />
            Posts
          </Link>
          <Link
            href="/categories/manage"
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              isActive("/categories/manage")
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <CategoryIcon className="h-4 w-4" />
            Categories
          </Link>
        </nav>
        <Link href="/posts/new">
          <Button className="gap-2">
            <AddCircleIcon className="h-4 w-4" />
            <span className="hidden sm:inline">New Post</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
