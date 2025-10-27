"use client";

import { useParams, useRouter } from "next/navigation";
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
import { PostStats } from "@/components/posts/PostStats";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CircularProgress from "@mui/icons-material/Loop";
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
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center gap-3">
          <CircularProgress className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <Card className="border">
          <CardHeader>
            <CardTitle className="text-lg">Post Not Found</CardTitle>
            <CardDescription className="text-sm">
              The post you're looking for doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/posts">
              <Button size="sm">
                <ArrowBackOutlinedIcon className="mr-2 h-4 w-4" />
                Back to Posts
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-6 md:py-8 px-4">
      {/* Post Content Wrapper - constrains both back button and content */}
      <article className="mx-auto max-w-4xl">
        {/* Back Button - now inside article wrapper */}
        <div className="mb-4">
          <Link href="/posts">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowBackOutlinedIcon className="h-4 w-4" />
              Back to Posts
            </Button>
          </Link>
        </div>

        {/* Post Card */}
        <Card className="border overflow-hidden">
          {/* ✨ Full-width image at the top */}
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-64 md:h-80 object-cover"
            />
          )}

          <CardHeader className="space-y-3 pb-4">
            {/* Status Badge & Actions */}
            <div className="flex items-start justify-between gap-3">
              <Badge
                variant={post.published ? "default" : "secondary"}
                className="w-fit text-xs"
              >
                {post.published ? "Published" : "Draft"}
              </Badge>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Link href={`/posts/${post.slug}/edit`}>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <EditOutlinedIcon className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      className="gap-1.5 bg-foreground text-background hover:bg-foreground/90"
                    >
                      <DeleteOutlineIcon className="h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-lg">
                        Are you sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-sm">
                        This action cannot be undone. This will permanently
                        delete the post "{post.title}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-foreground text-background hover:bg-foreground/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Title */}
            <CardTitle className="text-2xl md:text-3xl leading-tight">
              {post.title}
            </CardTitle>

            {/* Metadata */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarTodayOutlinedIcon className="h-3.5 w-3.5" />
                  {formatDate(post.createdAt)}
                </div>
                {post.updatedAt.toString() !== post.createdAt.toString() && (
                  <span className="text-xs">
                    (Updated: {formatDate(post.updatedAt)})
                  </span>
                )}
              </div>
              {/* Post Statistics */}
              <PostStats content={post.content} className="pt-1" />
            </div>

            {/* Categories - WITHOUT icons */}
            {post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <Link key={category.id} href={`/categories/${category.slug}`}>
                    <Badge
                      variant="outline"
                      className="text-xs cursor-pointer hover:bg-accent"
                    >
                      {category.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardHeader>

          <Separator />

          <CardContent className="pt-5 pb-6">
            <div className="prose prose-sm prose-neutral max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </CardContent>
        </Card>

        {/* Related Categories Section */}
        {post.categories.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Related Categories</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {post.categories.map((category) => (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <Card className="border cursor-pointer hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">
                        {category.name}
                      </CardTitle>
                      {category.description && (
                        <CardDescription className="text-xs">
                          {category.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
