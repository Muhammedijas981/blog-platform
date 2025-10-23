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
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CategoryIcon from "@mui/icons-material/Category";

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
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Manage Categories
            </h1>
            <p className="text-muted-foreground mt-2">
              Create and organize categories for your blog posts
            </p>
          </div>

          {/* Create Category Dialog */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <AddIcon className="mr-2 h-4 w-4" />
                New Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>
                  Add a new category to organize your blog posts.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Technology"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
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
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={!name.trim() || createCategory.isPending}
                >
                  {createCategory.isPending ? "Creating..." : "Create Category"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Separator className="mb-8" />

        {/* Categories Grid */}
        {categories && categories.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl">{category.name}</CardTitle>
                    </div>
                    <Badge variant="secondary">
                      {category.postCount} posts
                    </Badge>
                  </div>
                  {category.description && (
                    <CardDescription className="line-clamp-2">
                      {category.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardFooter className="gap-2">
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
                        <EditIcon className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>
                          Update the category name and description.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Name *</Label>
                          <Input
                            id="edit-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-description">Description</Label>
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
                          onClick={() => {
                            setEditingCategory(null);
                            setName("");
                            setDescription("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                      >
                        <DeleteIcon className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the category "
                          {category.name}".
                          {category.postCount > 0 && (
                            <span className="block mt-2 text-destructive font-medium">
                              Warning: {category.postCount} post
                              {category.postCount !== 1 ? "s" : ""} are using
                              this category!
                            </span>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleDelete(category.id, category.name)
                          }
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
          <Card>
            <CardHeader>
              <CardTitle>No Categories Yet</CardTitle>
              <CardDescription>
                Create your first category to start organizing your blog posts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setIsCreateOpen(true)}>
                <AddIcon className="mr-2 h-4 w-4" />
                Create First Category
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
