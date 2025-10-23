"use client";

import { trpc } from "@/trpc/client";

export default function Home() {
  const { data: posts, isLoading: postsLoading } = trpc.post.getAll.useQuery();
  const { data: categories, isLoading: categoriesLoading } =
    trpc.category.getAll.useQuery();

  const createPost = trpc.post.create.useMutation();
  const createCategory = trpc.category.create.useMutation();

  if (postsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">
        🎉 Blog Platform - Day 1-2 Test
      </h1>

      {/* Categories Section */}
      <div className="mb-12 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">
          📁 Categories ({categories?.length || 0})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="p-4 bg-white border rounded-lg shadow-sm"
              >
                <h3 className="font-semibold text-lg">{category.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {category.description || "No description"}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  📝 {category.postCount} post
                  {category.postCount !== 1 ? "s" : ""}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-3">
              No categories yet. Create one below! 👇
            </p>
          )}
        </div>
        <button
          onClick={() => {
            const name = prompt("Category name:");
            const description = prompt("Category description (optional):");
            if (name) {
              createCategory.mutate(
                { name, description: description || undefined },
                {
                  onSuccess: () => {
                    alert("✅ Category created successfully!");
                    window.location.reload();
                  },
                  onError: (error) => {
                    alert(`❌ Error: ${error.message}`);
                  },
                }
              );
            }
          }}
          disabled={createCategory.isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {createCategory.isPending ? "Creating..." : "➕ Add Test Category"}
        </button>
      </div>

      {/* Posts Section */}
      <div className="p-6 bg-green-50 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">
          📝 Posts ({posts?.length || 0})
        </h2>
        <div className="space-y-4 mb-6">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="p-6 bg-white border rounded-lg shadow-sm"
              >
                <h3 className="text-xl font-semibold">{post.title}</h3>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {post.content.substring(0, 200)}...
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <span className="font-medium">
                    {post.published ? "✅ Published" : "📝 Draft"}
                  </span>
                  <span>🔗 Slug: {post.slug}</span>
                  <span>
                    📅 {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No posts yet. Create one below! 👇</p>
          )}
        </div>
        <button
          onClick={() => {
            const title = prompt("Post title:");
            const content = prompt("Post content:");
            if (title && content) {
              createPost.mutate(
                { title, content, published: true },
                {
                  onSuccess: () => {
                    alert("✅ Post created successfully!");
                    window.location.reload();
                  },
                  onError: (error) => {
                    alert(`❌ Error: ${error.message}`);
                  },
                }
              );
            }
          }}
          disabled={createPost.isPending}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {createPost.isPending ? "Creating..." : "➕ Add Test Post"}
        </button>
      </div>

      {/* Success Message */}
      <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          🎉 Day 1-2 Backend Setup Complete!
        </h3>
        <p className="text-yellow-700">
          Your database, tRPC API, and frontend client are working perfectly.
          Try creating some categories and posts above to test the full CRUD
          functionality!
        </p>
      </div>
    </main>
  );
}
