"use client";

import { useRouter } from "next/navigation";
import { PostForm } from "@/components/forms/PostForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { trpc } from "@/trpc/client";
import toast from "react-hot-toast";

export default function NewPostPage() {
  const router = useRouter();
  const createPost = trpc.post.create.useMutation();

  const handleSubmit = async (data: {
    title: string;
    content: string;
    published: boolean;
    categoryIds: number[];
  }) => {
    try {
      const post = await createPost.mutateAsync(data);
      toast.success("Post created successfully!");
      router.push(`/posts/${post.slug}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create post");
    }
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
            <CardDescription>
              Write and publish your blog post. You can save it as a draft or
              publish it immediately.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PostForm
              onSubmit={handleSubmit}
              isLoading={createPost.isPending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
