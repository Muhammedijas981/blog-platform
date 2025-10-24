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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data: post, isLoading } = trpc.post.getBySlug.useQuery({ slug });
  const updatePost = trpc.post.update.useMutation();

  const handleSubmit = async (data: {
    title: string;
    content: string;
    published: boolean;
    categoryIds: number[];
  }) => {
    if (!post) return;

    try {
      const updatedPost = await updatePost.mutateAsync({
        id: post.id,
        ...data,
      });
      toast.success("Post updated successfully!");
      router.push(`/posts/${updatedPost.slug}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update post");
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
              The post you're trying to edit doesn't exist.
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
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link href={`/posts/${post.slug}`}>
            <Button variant="ghost" size="sm">
              <ArrowBackIcon className="mr-2 h-4 w-4" />
              Back to Post
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Post</CardTitle>
            <CardDescription>
              Update your blog post content and settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PostForm
              defaultValues={{
                title: post.title,
                content: post.content,
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
