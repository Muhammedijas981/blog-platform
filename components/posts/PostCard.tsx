import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { formatDate, truncate, calculateReadingTime } from "@/lib/utils";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CategoryIcon from "@mui/icons-material/Category";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export function PostCard({ post }: { post: any }) {
  return (
    <Card className="flex flex-col">
      {/* Show card image if available */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-48 object-cover rounded-t"
        />
      )}

      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2">{post.title}</CardTitle>
          <Badge variant={post.published ? "default" : "secondary"}>
            {post.published ? "Published" : "Draft"}
          </Badge>
        </div>
        <div className="space-y-1">
          <CardDescription className="flex items-center gap-1 text-xs">
            <CalendarTodayIcon className="h-3 w-3" />
            {formatDate(post.createdAt)}
          </CardDescription>
          <CardDescription className="flex items-center gap-1 text-xs">
            <AccessTimeIcon className="h-3 w-3" />
            {calculateReadingTime(post.content)} min read
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {truncate(post.content.replace(/<[^>]*>/g, ""), 150)}
        </p>
        {post.categories && post.categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.categories.map((category: any) => (
              <Badge key={category.id} variant="outline" className="text-xs">
                <CategoryIcon className="mr-1 h-3 w-3" />
                {category.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2">
        <Link href={`/posts/${post.slug}`} className="flex-1">
          <Button variant="default" className="w-full gap-2">
            <VisibilityIcon className="h-4 w-4" />
            View
          </Button>
        </Link>
        <Link href={`/posts/${post.slug}/edit`}>
          <Button variant="outline" size="icon">
            <EditIcon className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
