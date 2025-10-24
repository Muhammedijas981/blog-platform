"use client";

import { useParams } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
import { formatDate, truncate } from "@/lib/utils";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CategoryIcon from "@mui/icons-material/Category";

export default function CategoryViewPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: category, isLoading } = trpc.category.getBySlug.useQuery({
    slug,
  });

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="text-center">Loading category...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container py-12">
        <Card>
          <CardHeader>
            <CardTitle>Category Not Found</CardTitle>
            <CardDescription>
              The category you're looking for doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button>
                <ArrowBackIcon className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowBackIcon className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Category Header */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <CategoryIcon className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{category.name}</CardTitle>
                {category.description && (
                  <CardDescription className="text-base">
                    {category.description}
                  </CardDescription>
                )}
                <div className="mt-4">
                  <Badge variant="secondary">
                    {category.posts.length} post
                    {category.posts.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <Separator className="mb-8" />

      <div>
        <h2 className="text-2xl font-semibold mb-6">
          Posts in {category.name}
        </h2>

        {category.posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {category.posts.map((post) => (
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
                      __html: truncate(
                        post.content.replace(/<[^>]*>/g, ""),
                        150
                      ),
                    }}
                  />
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
              <CardTitle>No Posts Yet</CardTitle>
              <CardDescription>
                There are no posts in this category yet. Create a post and
                assign it to "{category.name}".
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

      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Manage Category</CardTitle>
            <CardDescription>Edit or manage this category</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/categories/manage">
              <Button variant="outline">
                <CategoryIcon className="mr-2 h-4 w-4" />
                Go to Category Management
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
