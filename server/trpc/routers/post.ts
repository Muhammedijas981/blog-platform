import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { posts, postsToCategories, categories } from "../../db/schema";
import { eq, desc, and } from "drizzle-orm";

// Helper function to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const postRouter = router({
  // Get all posts with pagination and filtering
  getAll: publicProcedure
    .input(
      z
        .object({
          published: z.boolean().optional(),
          limit: z.number().min(1).max(100).optional().default(9),
          page: z.number().min(1).optional().default(1),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const conditions = [];
      const limit = input?.limit || 9;
      const page = input?.page || 1;
      const offset = (page - 1) * limit;

      if (input?.published !== undefined) {
        conditions.push(eq(posts.published, input.published));
      }

      // Get total count for pagination
      const totalPosts = await ctx.db
        .select()
        .from(posts)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      // Get paginated posts
      const allPosts = await ctx.db
        .select()
        .from(posts)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset);

      // Get categories for each post
      const postsWithCategories = await Promise.all(
        allPosts.map(async (post) => {
          const postCategories = await ctx.db
            .select({
              id: categories.id,
              name: categories.name,
              slug: categories.slug,
            })
            .from(postsToCategories)
            .innerJoin(
              categories,
              eq(postsToCategories.categoryId, categories.id)
            )
            .where(eq(postsToCategories.postId, post.id));

          return {
            ...post,
            categories: postCategories,
          };
        })
      );

      return {
        posts: postsWithCategories,
        pagination: {
          total: totalPosts.length,
          page,
          limit,
          totalPages: Math.ceil(totalPosts.length / limit),
        },
      };
    }),

  // Get single post by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const [post] = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.id, input.id));

      if (!post) {
        throw new Error("Post not found");
      }

      const postCategories = await ctx.db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
        })
        .from(postsToCategories)
        .innerJoin(categories, eq(postsToCategories.categoryId, categories.id))
        .where(eq(postsToCategories.postId, post.id));

      return {
        ...post,
        categories: postCategories,
      };
    }),

  // Get post by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const [post] = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.slug, input.slug));

      if (!post) {
        throw new Error("Post not found");
      }

      const postCategories = await ctx.db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
        })
        .from(postsToCategories)
        .innerJoin(categories, eq(postsToCategories.categoryId, categories.id))
        .where(eq(postsToCategories.postId, post.id));

      return {
        ...post,
        categories: postCategories,
      };
    }),

  // Create post (supports image upload)
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        content: z.string().min(1, "Content is required"),
        imageUrl: z.string().url("Must be a valid URL").optional().nullable(),
        published: z.boolean().optional().default(false),
        categoryIds: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const slug = generateSlug(input.title);

      // Check if slug already exists
      const [existingPost] = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.slug, slug));
      if (existingPost) {
        throw new Error("A post with this title already exists");
      }

      // Create post
      const [newPost] = await ctx.db
        .insert(posts)
        .values({
          title: input.title,
          content: input.content,
          imageUrl: input.imageUrl ?? null,
          slug,
          published: input.published,
        })
        .returning();

      // If categories provided, create relationships
      if (input.categoryIds && input.categoryIds.length > 0) {
        await ctx.db.insert(postsToCategories).values(
          input.categoryIds.map((categoryId) => ({
            postId: newPost.id,
            categoryId,
          }))
        );
      }

      return newPost;
    }),

  // Update post (supports image change)
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        imageUrl: z.string().url("Must be a valid URL").optional().nullable(),
        published: z.boolean().optional(),
        categoryIds: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updateData: any = {
        updatedAt: new Date(),
      };

      if (input.title) {
        updateData.title = input.title;
        updateData.slug = generateSlug(input.title);

        // Check if new slug conflicts with existing posts
        const [existingPost] = await ctx.db
          .select()
          .from(posts)
          .where(and(eq(posts.slug, updateData.slug), eq(posts.id, input.id)));

        if (existingPost && existingPost.id !== input.id) {
          throw new Error("A post with this title already exists");
        }
      }
      if (input.content !== undefined) updateData.content = input.content;
      if (input.published !== undefined) updateData.published = input.published;
      if ("imageUrl" in input) updateData.imageUrl = input.imageUrl ?? null;

      const [updatedPost] = await ctx.db
        .update(posts)
        .set(updateData)
        .where(eq(posts.id, input.id))
        .returning();

      // Update categories if provided
      if (input.categoryIds !== undefined) {
        // Delete existing relationships
        await ctx.db
          .delete(postsToCategories)
          .where(eq(postsToCategories.postId, input.id));

        // Create new relationships
        if (input.categoryIds.length > 0) {
          await ctx.db.insert(postsToCategories).values(
            input.categoryIds.map((categoryId) => ({
              postId: input.id,
              categoryId,
            }))
          );
        }
      }

      return updatedPost;
    }),

  // Delete post
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(posts).where(eq(posts.id, input.id));
      return { success: true, id: input.id };
    }),

  // Optional: getAllSimple (for home page without pagination)
  getAllSimple: publicProcedure
    .input(
      z
        .object({
          published: z.boolean().optional(),
          limit: z.number().min(1).max(100).optional().default(50),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const conditions = [];

      if (input?.published !== undefined) {
        conditions.push(eq(posts.published, input.published));
      }

      const allPosts = await ctx.db
        .select()
        .from(posts)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(posts.createdAt))
        .limit(input?.limit || 50);

      const postsWithCategories = await Promise.all(
        allPosts.map(async (post) => {
          const postCategories = await ctx.db
            .select({
              id: categories.id,
              name: categories.name,
              slug: categories.slug,
            })
            .from(postsToCategories)
            .innerJoin(
              categories,
              eq(postsToCategories.categoryId, categories.id)
            )
            .where(eq(postsToCategories.postId, post.id));

          return {
            ...post,
            categories: postCategories,
          };
        })
      );

      return postsWithCategories;
    }),
});
