"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/trpc/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { formatDate, truncate } from "@/lib/utils";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CategoryIcon from "@mui/icons-material/Category";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function PostsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [publishedFilter, setPublishedFilter] = useState<boolean | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState("");

  const { data: posts, isLoading: postsLoading } = trpc.post.getAll.useQuery({
    published: publishedFilter,
  });

  const { data: categories } = trpc.category.getAll.useQuery();

  // Filter posts by category and search
  let filteredPosts = posts || [];

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
      <div className="container py-12">
        <div className="text-center">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Blog Posts</h1>
          <p className="text-muted-foreground mt-2">
            Browse and manage all your blog posts
          </p>
        </div>
        <Link href="/posts/new">
          <Button>
            <AddCircleIcon className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
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
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Posts</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Drafts</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground">
          {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}{" "}
          found
        </p>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1 text-xs">
                  <CalendarTodayIcon className="h-3 w-3" />
                  {formatDate(post.createdAt)}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div
                  className="text-sm text-muted-foreground line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: truncate(post.content.replace(/<[^>]*>/g, ""), 150),
                  }}
                />

                {post.categories.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.categories.map((category) => (
                      <Badge
                        key={category.id}
                        variant="outline"
                        className="text-xs"
                      >
                        <CategoryIcon className="mr-1 h-3 w-3" />
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>

              <CardFooter className="gap-2">
                <Link href={`/posts/${post.slug}`} className="flex-1">
                  <Button variant="default" className="w-full gap-2">
                    <VisibilityIcon className="h-4 w-4" />
                    View
                  </Button>
                </Link>
                <Link href={`/posts/${post.slug}/edit`}>
                  <Button variant="outline" size="icon">
                    <EditIcon className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Posts Found</CardTitle>
            <CardDescription>
              {searchQuery
                ? `No posts match your search "${searchQuery}"`
                : "Create your first post to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {searchQuery ? (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            ) : (
              <Link href="/posts/new">
                <Button>
                  <AddCircleIcon className="mr-2 h-4 w-4" />
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
