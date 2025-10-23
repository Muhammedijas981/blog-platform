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
import { formatDate, truncate } from "@/lib/utils";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CategoryIcon from "@mui/icons-material/Category";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [publishedFilter, setPublishedFilter] = useState<boolean | undefined>(
    true
  );

  const { data: posts, isLoading: postsLoading } = trpc.post.getAll.useQuery({
    published: publishedFilter,
  });

  const { data: categories } = trpc.category.getAll.useQuery();

  // Filter posts by category
  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts?.filter((post) =>
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
    <div className="container py-8 md:py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Welcome to Blog Platform
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover insightful articles, tutorials, and stories from our
          community
        </p>
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
          {filteredPosts?.length || 0} post
          {filteredPosts?.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Posts Grid */}
      {filteredPosts && filteredPosts.length > 0 ? (
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
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {truncate(post.content, 150)}
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
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No posts found</p>
          <Link href="/posts/new">
            <Button className="mt-4">Create your first post</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
