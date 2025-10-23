"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CategoryIcon from "@mui/icons-material/Category";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function PostViewPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data: post, isLoading } = trpc.post.getBySlug.useQuery({ slug });
  const deletePost = trpc.post.delete.useMutation();

  const handleDelete = async () => {
    if (!post) return;

    try {
      await deletePost.mutateAsync({ id: post.id });
      toast.success("Post deleted successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="text-center">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-12">
        <Card>
          <CardHeader>
            <CardTitle>Post Not Found</CardTitle>
            <CardDescription>
              The post you're looking for doesn't exist.
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
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowBackIcon className="mr-2 h-4 w-4" />
            Back to Posts
          </Button>
        </Link>
      </div>

      {/* Post Content */}
      <article className="mx-auto max-w-4xl">
        <Card>
          <CardHeader className="space-y-4">
            {/* Status Badge */}
            <div className="flex items-start justify-between gap-4">
              <Badge
                variant={post.published ? "default" : "secondary"}
                className="w-fit"
              >
                {post.published ? "Published" : "Draft"}
              </Badge>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Link href={`/posts/${post.slug}/edit`}>
                  <Button variant="outline" size="sm">
                    <EditIcon className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <DeleteIcon className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the post "{post.title}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Title */}
            <CardTitle className="text-3xl md:text-4xl">{post.title}</CardTitle>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarTodayIcon className="h-4 w-4" />
                {formatDate(post.createdAt)}
              </div>
              {post.updatedAt !== post.createdAt && (
                <span className="text-xs">
                  (Updated: {formatDate(post.updatedAt)})
                </span>
              )}
            </div>

            {/* Categories */}
            {post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <Link key={category.id} href={`/categories/${category.slug}`}>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-accent"
                    >
                      <CategoryIcon className="mr-1 h-3 w-3" />
                      {category.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <div className="prose prose-neutral max-w-none dark:prose-invert">
              <div
                className="prose prose-neutral max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Related Categories Section */}
        {post.categories.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Related Categories</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {post.categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    {category.description && (
                      <CardDescription>{category.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Link href={`/categories/${category.slug}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View All Posts in {category.name}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
