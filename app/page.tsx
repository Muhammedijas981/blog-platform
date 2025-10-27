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
import { formatDate, truncate, calculateReadingTime } from "@/lib/utils";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import CircularProgress from "@mui/icons-material/Loop";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [publishedFilter, setPublishedFilter] = useState<boolean | undefined>(
    true
  );

  const { data, isLoading: postsLoading } = trpc.post.getAll.useQuery({
    published: publishedFilter,
    limit: 9,
    page: 1,
  });

  const { data: categories } = trpc.category.getAll.useQuery();

  const posts = data?.posts || [];

  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((post) =>
          post.categories.some((cat) => cat.id.toString() === selectedCategory)
        );

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
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-3" variant="secondary">
              Welcome to Blog Platform
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Discover Insightful Stories & Articles
            </h1>
            <p className="text-base text-muted-foreground mb-6 max-w-xl mx-auto">
              Explore a world of knowledge through our carefully curated
              collection of blog posts. From technology to lifestyle, find
              content that inspires and informs.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/posts/new">
                <Button size="default" className="gap-2">
                  <CreateOutlinedIcon className="h-4 w-4" />
                  Start Writing
                </Button>
              </Link>
              <Link href="/posts">
                <Button size="default" variant="outline" className="gap-2">
                  <ExploreOutlinedIcon className="h-4 w-4" />
                  Explore Posts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 border-b">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid gap-5 md:grid-cols-3">
            <Card className="border">
              <CardHeader className="pb-3">
                <CreateOutlinedIcon className="h-7 w-7 mb-2 text-primary" />
                <CardTitle className="text-base">Rich Text Editor</CardTitle>
                <CardDescription className="text-sm">
                  Create beautiful content with our powerful editor featuring
                  formatting, lists, and more
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border">
              <CardHeader className="pb-3">
                <CategoryOutlinedIcon className="h-7 w-7 mb-2 text-primary" />
                <CardTitle className="text-base">Category Management</CardTitle>
                <CardDescription className="text-sm">
                  Organize posts with categories and make content easy to
                  discover for your readers
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border">
              <CardHeader className="pb-3">
                <TrendingUpOutlinedIcon className="h-7 w-7 mb-2 text-primary" />
                <CardTitle className="text-base">Reading Analytics</CardTitle>
                <CardDescription className="text-sm">
                  Track word count and estimated reading time for every post
                  automatically
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-10">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Latest Blog Posts
            </h2>
            <p className="text-sm text-muted-foreground">
              Browse our latest content and discover what's new
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
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
              {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}{" "}
              found
            </p>
          </div>

          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/posts/${post.slug}`}>
                  <Card className="flex flex-col overflow-hidden border cursor-pointer hover:shadow-md transition-shadow h-full">
                    {/* Show image or placeholder */}
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

                      {/* Categories without icons */}
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
          ) : (
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-lg">No Posts Found</CardTitle>
                <CardDescription className="text-sm">
                  Create your first post to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/posts/new">
                  <Button size="sm">Create First Post</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight mb-3">
              Ready to Share Your Story?
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              Join our community of writers and start creating amazing content
              today.
            </p>
            <Link href="/posts/new">
              <Button size="default" className="gap-2">
                <CreateOutlinedIcon className="h-4 w-4" />
                Create Your First Post
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

