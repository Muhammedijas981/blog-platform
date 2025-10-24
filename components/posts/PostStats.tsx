import { Badge } from "@/components/ui/Badge";
import { calculateReadingTime, getWordCount } from "@/lib/utils";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TextFieldsIcon from "@mui/icons-material/TextFields";

interface PostStatsProps {
  content: string;
  className?: string;
}

export function PostStats({ content, className }: PostStatsProps) {
  const wordCount = getWordCount(content);
  const readingTime = calculateReadingTime(content);

  return (
    <div
      className={`flex items-center gap-3 text-sm text-muted-foreground ${className}`}
    >
      <div className="flex items-center gap-1">
        <TextFieldsIcon className="h-4 w-4" />
        <span>{wordCount.toLocaleString()} words</span>
      </div>
      <div className="flex items-center gap-1">
        <AccessTimeIcon className="h-4 w-4" />
        <span>{readingTime} min read</span>
      </div>
    </div>
  );
}
