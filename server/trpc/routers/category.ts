import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { categories, postsToCategories, posts } from "../../db/schema";
import { eq, desc } from "drizzle-orm";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const categoryRouter = router({
  // Get all categories with post count
  getAll: publicProcedure.query(async ({ ctx }) => {
    const allCategories = await ctx.db
      .select()
      .from(categories)
      .orderBy(categories.name);

    const categoriesWithCount = await Promise.all(
      allCategories.map(async (category) => {
        const postCount = await ctx.db
          .select()
          .from(postsToCategories)
          .where(eq(postsToCategories.categoryId, category.id));

        return {
          ...category,
          postCount: postCount.length,
        };
      })
    );

    return categoriesWithCount;
  }),

  // Get single category by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const [category] = await ctx.db
        .select()
        .from(categories)
        .where(eq(categories.id, input.id));

      if (!category) {
        throw new Error("Category not found");
      }

      return category;
    }),

  // Get category by slug with posts (✨ UPDATED to include imageUrl)
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const [category] = await ctx.db
        .select()
        .from(categories)
        .where(eq(categories.slug, input.slug));

      if (!category) {
        throw new Error("Category not found");
      }

      // Get all posts for this category - ✨ NOW INCLUDING imageUrl
      const categoryPosts = await ctx.db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          content: posts.content,
          imageUrl: posts.imageUrl, // ✨ ADD THIS LINE
          published: posts.published,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
        })
        .from(postsToCategories)
        .innerJoin(posts, eq(postsToCategories.postId, posts.id))
        .where(eq(postsToCategories.categoryId, category.id))
        .orderBy(desc(posts.createdAt));

      return {
        ...category,
        posts: categoryPosts,
      };
    }),

  // Create category
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Category name is required"),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const slug = generateSlug(input.name);

      const [existingCategory] = await ctx.db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug));

      if (existingCategory) {
        throw new Error("A category with this name already exists");
      }

      const [newCategory] = await ctx.db
        .insert(categories)
        .values({
          name: input.name,
          description: input.description,
          slug,
        })
        .returning();

      return newCategory;
    }),

  // Update category
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updateData: any = {};

      if (input.name) {
        updateData.name = input.name;
        updateData.slug = generateSlug(input.name);

        const [existingCategory] = await ctx.db
          .select()
          .from(categories)
          .where(eq(categories.slug, updateData.slug));

        if (existingCategory && existingCategory.id !== input.id) {
          throw new Error("A category with this name already exists");
        }
      }
      if (input.description !== undefined)
        updateData.description = input.description;

      const [updatedCategory] = await ctx.db
        .update(categories)
        .set(updateData)
        .where(eq(categories.id, input.id))
        .returning();

      return updatedCategory;
    }),

  // Delete category
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(categories).where(eq(categories.id, input.id));
      return { success: true, id: input.id };
    }),
});
