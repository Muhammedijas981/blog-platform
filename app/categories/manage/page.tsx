"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import toast from "react-hot-toast";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";

export default function CategoryManagePage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id: number;
    name: string;
    description?: string | null;
  } | null>(null);

  const { data: categories, refetch } = trpc.category.getAll.useQuery();
  const createCategory = trpc.category.create.useMutation();
  const updateCategory = trpc.category.update.useMutation();
  const deleteCategory = trpc.category.delete.useMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      await createCategory.mutateAsync({
        name,
        description: description || undefined,
      });
      toast.success("Category created successfully!");
      setName("");
      setDescription("");
      setIsCreateOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to create category");
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory || !name.trim()) return;

    try {
      await updateCategory.mutateAsync({
        id: editingCategory.id,
        name,
        description: description || undefined,
      });
      toast.success("Category updated successfully!");
      setEditingCategory(null);
      setName("");
      setDescription("");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to update category");
    }
  };

  const handleDelete = async (id: number, categoryName: string) => {
    try {
      await deleteCategory.mutateAsync({ id });
      toast.success(`Category "${categoryName}" deleted successfully!`);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    }
  };

  const openEditDialog = (category: {
    id: number;
    name: string;
    description?: string | null;
  }) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || "");
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 md:py-10 px-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Manage Categories
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and organize categories for your blog posts
          </p>
        </div>

        {/* Create Category Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <AddCircleOutlineIcon className="mr-2 h-4 w-4" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg">Create New Category</DialogTitle>
              <DialogDescription className="text-sm">
                Add a new category to organize your blog posts.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">
                  Name *
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Technology"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreate}
                disabled={!name.trim() || createCategory.isPending}
              >
                {createCategory.isPending ? "Creating..." : "Create Category"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="mb-6" />

      {/* Categories Grid */}
      {categories && categories.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id} className="border">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CategoryOutlinedIcon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{category.name}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {category.postCount} posts
                  </Badge>
                </div>
                {category.description && (
                  <CardDescription className="text-xs line-clamp-2 mt-2">
                    {category.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardFooter className="gap-2 pt-3">
                {/* Edit Dialog */}
                <Dialog
                  open={editingCategory?.id === category.id}
                  onOpenChange={(open) => {
                    if (!open) {
                      setEditingCategory(null);
                      setName("");
                      setDescription("");
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditDialog(category)}
                    >
                      <EditOutlinedIcon className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-lg">
                        Edit Category
                      </DialogTitle>
                      <DialogDescription className="text-sm">
                        Update the category name and description.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name" className="text-sm">
                          Name *
                        </Label>
                        <Input
                          id="edit-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-description" className="text-sm">
                          Description
                        </Label>
                        <Textarea
                          id="edit-description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingCategory(null);
                          setName("");
                          setDescription("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleUpdate}
                        disabled={!name.trim() || updateCategory.isPending}
                      >
                        {updateCategory.isPending
                          ? "Updating..."
                          : "Update Category"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Delete Alert Dialog */}
                {/* Delete Alert Dialog */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      className="flex-1 gap-1.5 bg-foreground text-background hover:bg-foreground/90"
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
                        This will permanently delete the category "
                        {category.name}".
                        {category.postCount > 0 && (
                          <span className="block mt-2 font-medium text-foreground">
                            Warning: {category.postCount} post
                            {category.postCount !== 1 ? "s" : ""} are using this
                            category!
                          </span>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(category.id, category.name)}
                        className="bg-foreground text-background hover:bg-foreground/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border">
          <CardHeader>
            <CardTitle className="text-lg">No Categories Yet</CardTitle>
            <CardDescription className="text-sm">
              Create your first category to start organizing your blog posts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="sm" onClick={() => setIsCreateOpen(true)}>
              <AddCircleOutlineIcon className="mr-2 h-4 w-4" />
              Create First Category
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
