"use client";

import { useParams } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
import { formatDate, truncate, calculateReadingTime } from "@/lib/utils";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CircularProgress from "@mui/icons-material/Loop";

export default function CategoryViewPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: category, isLoading } = trpc.category.getBySlug.useQuery({
    slug,
  });

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center gap-3">
          <CircularProgress className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <Card className="border">
          <CardHeader>
            <CardTitle className="text-lg">Category Not Found</CardTitle>
            <CardDescription className="text-sm">
              The category you're looking for doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/posts">
              <Button size="sm">
                <ArrowBackOutlinedIcon className="mr-2 h-4 w-4" />
                Back to posts
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-6 md:py-8 px-4">
      <div className="mb-4">
        <Link href="/posts">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowBackOutlinedIcon className="h-4 w-4" />
            Back to posts
          </Button>
        </Link>
      </div>
      <div className="mb-6">
        <Card className="border">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <CategoryOutlinedIcon className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{category.name}</CardTitle>
                {category.description && (
                  <CardDescription className="text-sm">
                    {category.description}
                  </CardDescription>
                )}
                <div className="mt-3">
                  <Badge variant="secondary" className="text-xs">
                    {category.posts.length} post
                    {category.posts.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
      <Separator className="mb-6" />
      <div>
        <h2 className="text-lg font-semibold mb-4">Posts in {category.name}</h2>
        {category.posts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {category.posts.map((post) => (
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
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {truncate(post.content.replace(/<[^>]*>/g, ""), 120)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="border">
            <CardHeader>
              <CardTitle className="text-lg">No Posts Yet</CardTitle>
              <CardDescription className="text-sm">
                There are no posts in this category yet. Create a post and
                assign it to "{category.name}".
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
      <div className="mt-8">
        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Manage Category</CardTitle>
            <CardDescription className="text-sm">
              Edit or manage this category
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Link href="/categories/manage">
              <Button variant="outline" size="sm" className="gap-1.5">
                <CategoryOutlinedIcon className="h-4 w-4" />
                Go to Category Management
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
