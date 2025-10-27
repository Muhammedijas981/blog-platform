"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/separator";
import { formatDate, calculateReadingTime, getWordCount } from "@/lib/utils";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import CategoryIcon from "@mui/icons-material/Category";

interface PostPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
  published: boolean;
  imageUrl?: string;
  categories?: { id: number; name: string }[];
}

export function PostPreview({
  open,
  onOpenChange,
  title,
  content,
  published,
  imageUrl,
  categories = [],
}: PostPreviewProps) {
  const wordCount = getWordCount(content);
  const readingTime = calculateReadingTime(content);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col gap-2 w-full">
            {/* Show image if present */}
            {imageUrl && (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-64 object-cover rounded mb-4"
              />
            )}
            <DialogTitle className="text-2xl mb-3">
              {title || "Untitled Post"}
            </DialogTitle>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <CalendarTodayIcon className="h-4 w-4" />
                  {formatDate(new Date())}
                </div>
                <Badge variant={published ? "default" : "secondary"}>
                  {published ? "Published" : "Draft"}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <TextFieldsIcon className="h-4 w-4" />
                  {wordCount} words
                </div>
                <div className="flex items-center gap-1">
                  <AccessTimeIcon className="h-4 w-4" />
                  {readingTime} min read
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category.id} variant="outline">
                  <CategoryIcon className="mr-1 h-3 w-3" />
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Content Preview */}
        <div
          className="prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html:
              content ||
              '<p class="text-muted-foreground">No content to preview</p>',
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
