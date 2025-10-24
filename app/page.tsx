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
import { formatDate, truncate, calculateReadingTime } from "@/lib/utils";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CategoryIcon from "@mui/icons-material/Category";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CreateIcon from "@mui/icons-material/Create";
import ExploreIcon from "@mui/icons-material/Explore";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

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

  // Filter posts by category
  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((post) =>
          post.categories.some((cat) => cat.id.toString() === selectedCategory)
        );

  if (postsLoading) {
    return (
      <div className="container py-12">
        <div className="text-center">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4" variant="secondary">
              Welcome to Blog Platform
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              Discover Insightful Stories & Articles
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore a world of knowledge through our carefully curated
              collection of blog posts. From technology to lifestyle, find
              content that inspires and informs.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/posts/new">
                <Button size="lg" className="gap-2">
                  <CreateIcon className="h-5 w-5" />
                  Start Writing
                </Button>
              </Link>
              <Link href="/posts">
                <Button size="lg" variant="outline" className="gap-2">
                  <ExploreIcon className="h-5 w-5" />
                  Explore Posts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 border-b">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CreateIcon className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Rich Text Editor</CardTitle>
                <CardDescription>
                  Create beautiful content with our powerful editor featuring
                  formatting, lists, and more
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CategoryIcon className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Category Management</CardTitle>
                <CardDescription>
                  Organize posts with categories and make content easy to
                  discover for your readers
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUpIcon className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Reading Analytics</CardTitle>
                <CardDescription>
                  Track word count and estimated reading time for every post
                  automatically
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container">

          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Latest Blog Posts
            </h2>
            <p className="text-muted-foreground">
              Browse our latest content and discover what's new
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[200px]">
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
          {filteredPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="line-clamp-2">
                        {post.title}
                      </CardTitle>
                      <Badge variant={post.published ? "default" : "secondary"}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <CardDescription className="flex items-center gap-1 text-xs">
                        <CalendarTodayIcon className="h-3 w-3" />
                        {formatDate(post.createdAt)}
                      </CardDescription>
                      <CardDescription className="flex items-center gap-1 text-xs">
                        <AccessTimeIcon className="h-3 w-3" />
                        {calculateReadingTime(post.content)} min read
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {truncate(post.content.replace(/<[^>]*>/g, ""), 150)}
                    </p>

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
                        Read More
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
                  Create your first post to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/posts/new">
                  <Button>Create First Post</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
      <section className="bg-primary/5 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Ready to Share Your Story?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join our community of writers and start creating amazing content
              today.
            </p>
            <Link href="/posts/new">
              <Button size="lg" className="gap-2">
                <CreateIcon className="h-5 w-5" />
                Create Your First Post
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
