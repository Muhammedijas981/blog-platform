"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PostForm } from "@/components/forms/PostForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { trpc } from "@/trpc/client";
import toast from "react-hot-toast";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CircularProgress from "@mui/icons-material/Loop";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data: post, isLoading } = trpc.post.getBySlug.useQuery({ slug });
  const updatePost = trpc.post.update.useMutation();

  const handleSubmit = async (data: {
    title: string;
    content: string;
    imageUrl?: string;
    published: boolean;
    categoryIds: number[];
  }) => {
    if (!post) return;

    // Validation for published posts
    if (data.published) {
      if (!data.title.trim()) {
        toast.error("Title is required for publishing");
        return;
      }
      if (!data.content.trim()) {
        toast.error("Content is required for publishing");
        return;
      }
      if (data.content.replace(/<[^>]*>/g, "").trim().length < 50) {
        toast.error("Content must be at least 50 characters for publishing");
        return;
      }
    }

    // Basic validation for drafts
    if (!data.title.trim()) {
      toast.error("Title is required even for drafts");
      return;
    }

    try {
      const updatedPost = await updatePost.mutateAsync({
        id: post.id,
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
        published: data.published,
        categoryIds: data.categoryIds,
      });

      toast.success(
        data.published
          ? "Post updated and published successfully!"
          : "Post saved as draft successfully!"
      );

      router.push(`/posts/${updatedPost.slug}`);
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to update post. Please try again.");
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
              The post you're trying to edit doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button size="sm">
                <ArrowBackOutlinedIcon className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-6 md:py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <div className="mb-4">
          <Link href={`/posts/${post.slug}`}>
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowBackOutlinedIcon className="h-4 w-4" />
              Back to Post
            </Button>
          </Link>
        </div>

        <Card className="border">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Edit Post</CardTitle>
            <CardDescription className="text-sm">
              Update your blog post content and settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PostForm
              defaultValues={{
                title: post.title,
                content: post.content,
                imageUrl: post.imageUrl || undefined,
                published: post.published,
                categoryIds: post.categories.map((c) => c.id),
              }}
              onSubmit={handleSubmit}
              isLoading={updatePost.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
