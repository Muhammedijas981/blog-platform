"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/trpc/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/pagination";
import { formatDate, truncate, calculateReadingTime } from "@/lib/utils";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CircularProgress from "@mui/icons-material/Loop";

export default function PostsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [publishedFilter, setPublishedFilter] = useState<boolean | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading: postsLoading } = trpc.post.getAll.useQuery({
    published: publishedFilter,
    limit: 9,
    page: currentPage,
  });

  const { data: categories } = trpc.category.getAll.useQuery();

  const posts = data?.posts || [];
  const pagination = data?.pagination;

  // Filter posts by category and search
  let filteredPosts = posts;

  // Filter by category
  if (selectedCategory !== "all") {
    filteredPosts = filteredPosts.filter((post) =>
      post.categories.some((cat) => cat.id.toString() === selectedCategory)
    );
  }

  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
    );
  }

  if (postsLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center gap-3">
          <CircularProgress className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 md:py-10 px-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">All Blog Posts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse and manage all your blog posts
          </p>
        </div>
        <Link href="/posts/new">
          <Button size="sm">
            <AddCircleOutlineIcon className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>
      <div className="mb-5">
        <div className="relative">
          <SearchOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={
              publishedFilter === undefined
                ? "all"
                : publishedFilter
                ? "published"
                : "draft"
            }
            onValueChange={(value) => {
              if (value === "all") setPublishedFilter(undefined);
              else if (value === "published") setPublishedFilter(true);
              else setPublishedFilter(false);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Posts</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-xs text-muted-foreground">
          {filteredPosts.length} of {pagination?.total || 0} post
          {pagination?.total !== 1 ? "s" : ""}
        </p>
      </div>
      {filteredPosts.length > 0 ? (
        <>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Link key={post.id} href={`/posts/${post.slug}`}>
                <Card className="flex flex-col overflow-hidden border cursor-pointer hover:shadow-md transition-shadow h-full">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <ImageOutlinedIcon className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base line-clamp-2">
                        {post.title}
                      </CardTitle>
                      <Badge
                        variant={post.published ? "default" : "secondary"}
                        className="text-xs shrink-0"
                      >
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <CardDescription className="flex items-center gap-1 text-xs">
                        <CalendarTodayOutlinedIcon className="h-3 w-3" />
                        {formatDate(post.createdAt)}
                      </CardDescription>
                      <CardDescription className="flex items-center gap-1 text-xs">
                        <AccessTimeOutlinedIcon className="h-3 w-3" />
                        {calculateReadingTime(post.content)} min read
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 pt-0 pb-4">
                    <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
                      {truncate(post.content.replace(/<[^>]*>/g, ""), 120)}
                    </p>
                    {post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {post.categories.map((category) => (
                          <Badge
                            key={category.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {category.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <Card className="border">
          <CardHeader>
            <CardTitle className="text-lg">No Posts Found</CardTitle>
            <CardDescription className="text-sm">
              {searchQuery
                ? `No posts match your search "${searchQuery}"`
                : "Create your first post to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {searchQuery ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            ) : (
              <Link href="/posts/new">
                <Button size="sm">
                  <AddCircleOutlineIcon className="mr-2 h-4 w-4" />
                  Create First Post
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
