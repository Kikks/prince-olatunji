import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

// Get featured post by ID
export const get = query({
	args: { id: v.id("featuredPosts") },
	handler: async (ctx, args) => {
		const featuredPost = await ctx.db.get(args.id);
		if (!featuredPost) {
			throw new ConvexError("Featured post not found");
		}

		// Get the associated post
		const post = await ctx.db.get(featuredPost.postId);

		return {
			...featuredPost,
			post
		};
	}
});

// Create a new featured post
export const create = mutation({
	args: {
		postId: v.id("posts"),
		themeId: v.string(),
		index: v.number()
	},
	handler: async (ctx, args) => {
		// Verify the post exists
		const post = await ctx.db.get(args.postId);
		if (!post) {
			throw new ConvexError("Post not found");
		}

		// Check if post is already featured
		const existingFeatured = await ctx.db
			.query("featuredPosts")
			.filter(q => q.eq(q.field("postId"), args.postId))
			.first();

		if (existingFeatured) {
			throw new ConvexError("Post is already featured");
		}

		// Create featured post
		const featuredPostId = await ctx.db.insert("featuredPosts", {
			postId: args.postId,
			themeId: args.themeId,
			index: args.index,
			createdAt: Date.now(),
			updatedAt: Date.now()
		});

		return featuredPostId;
	}
});

// Update featured post (update theme or index)
export const update = mutation({
	args: {
		id: v.id("featuredPosts"),
		themeId: v.optional(v.string()),
		index: v.optional(v.number())
	},
	handler: async (ctx, args) => {
		const { id, ...updates } = args;

		// Check if featured post exists
		const featuredPost = await ctx.db.get(id);
		if (!featuredPost) {
			throw new ConvexError("Featured post not found");
		}

		// Update featured post
		await ctx.db.patch(id, {
			...updates,
			updatedAt: Date.now()
		});

		return id;
	}
});

// Remove a post from featured
export const remove = mutation({
	args: {
		id: v.id("featuredPosts")
	},
	handler: async (ctx, args) => {
		const featuredPost = await ctx.db.get(args.id);
		if (!featuredPost) {
			throw new ConvexError("Featured post not found");
		}

		await ctx.db.delete(args.id);
		return true;
	}
});

// List all featured posts
export const list = query({
	handler: async ctx => {
		const featuredPosts = await ctx.db
			.query("featuredPosts")
			.filter(q => true) // Include all featured posts
			.collect();

		// Sort by index in-memory
		featuredPosts.sort((a, b) => a.index - b.index);

		// Get post details for each featured post
		const featuredPostsWithDetails = await Promise.all(
			featuredPosts.map(async featuredPost => {
				const post = await ctx.db.get(featuredPost.postId);

				// Get category details if post has one
				let category = null;
				if (post?.categoryId) {
					category = await ctx.db.get(post.categoryId);
				}

				return {
					...featuredPost,
					post: {
						...post,
						category
					}
				};
			})
		);

		return featuredPostsWithDetails;
	}
});

// List featured posts by theme
export const listByTheme = query({
	args: {
		themeId: v.string()
	},
	handler: async (ctx, args) => {
		const featuredPosts = await ctx.db
			.query("featuredPosts")
			.filter(q => q.eq(q.field("themeId"), args.themeId))
			.collect();

		// Sort by index in-memory
		featuredPosts.sort((a, b) => a.index - b.index);

		// Get post details for each featured post
		const featuredPostsWithDetails = await Promise.all(
			featuredPosts.map(async featuredPost => {
				const post = await ctx.db.get(featuredPost.postId);

				// Get category details if post has one
				let category = null;
				if (post?.categoryId) {
					category = await ctx.db.get(post.categoryId);
				}

				return {
					...featuredPost,
					post: {
						...post,
						category
					}
				};
			})
		);

		return featuredPostsWithDetails;
	}
});

// Reorder featured posts
export const reorder = mutation({
	args: {
		orderedIds: v.array(v.id("featuredPosts"))
	},
	handler: async (ctx, args) => {
		// Update index for each featured post based on its position in orderedIds
		for (let i = 0; i < args.orderedIds.length; i++) {
			const id = args.orderedIds[i];

			// Check if featured post exists
			const featuredPost = await ctx.db.get(id);
			if (!featuredPost) {
				throw new ConvexError(`Featured post with ID ${id} not found`);
			}

			// Update index
			await ctx.db.patch(id, {
				index: i,
				updatedAt: Date.now()
			});
		}

		return true;
	}
});
