"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/forms/RichTextEditor";
import { PostPreview } from "@/components/forms/PostPreview";
import { trpc } from "@/trpc/client";
import { Badge } from "@/components/ui/Badge";
import SaveIcon from "@mui/icons-material/Save";
import PublishIcon from "@mui/icons-material/Publish";
import CategoryIcon from "@mui/icons-material/Category";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface PostFormProps {
  defaultValues?: {
    title: string;
    content: string;
    published: boolean;
    categoryIds: number[];
  };
  onSubmit: (data: {
    title: string;
    content: string;
    published: boolean;
    categoryIds: number[];
  }) => Promise<void>;
  isLoading?: boolean;
}

export function PostForm({
  defaultValues,
  onSubmit,
  isLoading,
}: PostFormProps) {
  const [title, setTitle] = useState(defaultValues?.title || "");
  const [content, setContent] = useState(defaultValues?.content || "");
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    defaultValues?.categoryIds || []
  );
  const [showPreview, setShowPreview] = useState(false);

  const { data: categories } = trpc.category.getAll.useQuery();

  const handleSubmit = async (published: boolean) => {
    if (!title.trim() || !content.trim()) {
      return;
    }

    await onSubmit({
      title,
      content,
      published,
      categoryIds: selectedCategories,
    });
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const selectedCategoryObjects =
    categories?.filter((cat) => selectedCategories.includes(cat.id)) || [];

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="Enter post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            className="text-lg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Content *</Label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Start writing your blog post..."
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label>
            <CategoryIcon className="inline h-4 w-4 mr-1" />
            Categories
          </Label>
          <div className="flex flex-wrap gap-2 p-4 border rounded-md min-h-[60px]">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={
                    selectedCategories.includes(category.id)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.name}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No categories available. Create categories first.
              </p>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Click categories to select/deselect them for this post
          </p>
        </div>
        <div className="flex gap-4 pt-4 flex-wrap">
          <Button
            type="button"
            onClick={() => setShowPreview(true)}
            disabled={!title.trim() || !content.trim()}
            variant="secondary"
            className="gap-2"
          >
            <VisibilityIcon className="h-4 w-4" />
            Preview
          </Button>

          <Button
            onClick={() => handleSubmit(false)}
            disabled={isLoading || !title.trim() || !content.trim()}
            variant="outline"
            className="flex-1 gap-2"
          >
            <SaveIcon className="h-4 w-4" />
            Save as Draft
          </Button>
          <Button
            onClick={() => handleSubmit(true)}
            disabled={isLoading || !title.trim() || !content.trim()}
            className="flex-1 gap-2"
          >
            <PublishIcon className="h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>
      <PostPreview
        open={showPreview}
        onOpenChange={setShowPreview}
        title={title}
        content={content}
        published={defaultValues?.published || false}
        categories={selectedCategoryObjects}
      />
    </>
  );
}
