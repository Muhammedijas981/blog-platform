"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/forms/RichTextEditor";
import { PostPreview } from "@/components/forms/PostPreview";
import { trpc } from "@/trpc/client";
import { Badge } from "@/components/ui/Badge";
import toast from "react-hot-toast";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import PublishOutlinedIcon from "@mui/icons-material/PublishOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface PostFormProps {
  defaultValues?: {
    title: string;
    content: string;
    imageUrl?: string;
    published: boolean;
    categoryIds: number[];
  };
  onSubmit: (data: {
    title: string;
    content: string;
    imageUrl?: string;
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
  const [imageUrl, setImageUrl] = useState(defaultValues?.imageUrl || "");
  const [uploading, setUploading] = useState(false);

  const { data: categories } = trpc.category.getAll.useQuery();

  const handleSubmit = async (published: boolean) => {
    // Validation
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!content.trim()) {
      toast.error("Please add some content");
      return;
    }

    // Additional validation for publishing
    if (published) {
      const plainText = content.replace(/<[^>]*>/g, "").trim();
      if (plainText.length < 50) {
        toast.error("Content must be at least 50 characters to publish");
        return;
      }
    }

    // ✅ FIX: Convert empty string to undefined for imageUrl
    const submissionData = {
      title,
      content,
      imageUrl: imageUrl.trim() ? imageUrl : undefined, // Only send URL if it exists
      published,
      categoryIds: selectedCategories,
    };

    try {
      await onSubmit(submissionData);
    } catch (error: any) {
      // Handle specific validation errors from tRPC
      if (error.message.includes("Must be a valid URL")) {
        toast.error("Please provide a valid image URL or remove the image");
      } else {
        // Let the parent component handle other errors
        throw error;
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      e.target.value = ""; // Reset file input
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      e.target.value = ""; // Reset file input
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "blog_uploads");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dokjwzhot/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || "Upload failed. Please try again."
        );
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message || "Upload failed");
      }

      // Validate that we got a secure URL back
      if (!data.secure_url || !data.secure_url.startsWith("https://")) {
        throw new Error("Invalid image URL received from server");
      }

      setImageUrl(data.secure_url);
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      console.error("Upload error:", error);

      // Provide specific error messages
      if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else if (error.message.includes("preset")) {
        toast.error("Upload configuration error. Please contact support.");
      } else {
        toast.error(
          error.message || "Failed to upload image. Please try again."
        );
      }

      // Clear the file input on error
      e.target.value = "";
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    // Clear the file input
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
    toast.success("Image removed");
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
      <div className="space-y-5">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm">
            Title *
          </Label>
          <Input
            id="title"
            placeholder="Enter post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            className="text-base"
          />
        </div>

        {/* Header Image */}
        <div className="space-y-2">
          <Label htmlFor="image" className="text-sm">
            Header Image
          </Label>
          <div className="flex items-center gap-3">
            <Input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              id="image"
              disabled={isLoading || uploading}
              onChange={handleImageUpload}
              className="flex-1"
            />
            {imageUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveImage}
                disabled={isLoading || uploading}
                title="Remove image"
              >
                <DeleteOutlineIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
          {imageUrl && (
            <div className="relative border rounded overflow-hidden bg-muted/20">
              <img
                src={imageUrl}
                alt="Header preview"
                className="w-full h-auto max-h-48 object-contain"
              />
            </div>
          )}
          {uploading && (
            <div className="text-xs text-primary font-medium animate-pulse">
              Uploading image, please wait...
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Recommended: 1200x600px, max 2MB. JPG, PNG, or WebP.
          </p>
        </div>

        {/* Rich Text Editor */}
        <div className="space-y-2">
          <Label htmlFor="content" className="text-sm">
            Content *
          </Label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Start writing your blog post..."
            disabled={isLoading}
          />
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <Label className="text-sm flex items-center gap-1.5">
            <CategoryOutlinedIcon className="h-4 w-4" />
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
                  className="cursor-pointer text-xs"
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

        {/* Actions */}
        <div className="flex gap-3 pt-4 flex-wrap">
          <Button
            type="button"
            onClick={() => setShowPreview(true)}
            disabled={!title.trim() || !content.trim()}
            variant="secondary"
            size="sm"
            className="gap-1.5"
          >
            <VisibilityOutlinedIcon className="h-4 w-4" />
            Preview
          </Button>

          <Button
            onClick={() => handleSubmit(false)}
            disabled={
              isLoading || !title.trim() || !content.trim() || uploading
            }
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5"
          >
            <SaveOutlinedIcon className="h-4 w-4" />
            {isLoading ? "Saving..." : "Save as Draft"}
          </Button>

          <Button
            onClick={() => handleSubmit(true)}
            disabled={
              isLoading || !title.trim() || !content.trim() || uploading
            }
            size="sm"
            className="flex-1 gap-1.5"
          >
            <PublishOutlinedIcon className="h-4 w-4" />
            {isLoading ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      {/* Preview Dialog */}
      <PostPreview
        open={showPreview}
        onOpenChange={setShowPreview}
        title={title}
        content={content}
        published={defaultValues?.published || false}
        categories={selectedCategoryObjects}
        imageUrl={imageUrl}
      />
    </>
  );
}
