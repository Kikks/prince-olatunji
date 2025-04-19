import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

// Generate slug from title
function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^\w\s]/gi, "")
		.replace(/\s+/gi, "-")
		.concat("-", Math.floor(Math.random() * 1000).toString());
}

// Generate preview from body
function generatePreview(body: string, maxLength: number = 150): string {
	if (body.length <= maxLength) return body;
	return body.substring(0, maxLength).trim() + "...";
}

// Get post by ID
export const get = query({
	args: { id: v.id("posts") },
	handler: async (ctx, args) => {
		const post = await ctx.db.get(args.id);
		if (!post) {
			throw new ConvexError("Post not found");
		}

		// Get category details
		const category = post.categoryId ? await ctx.db.get(post.categoryId) : null;

		return {
			...post,
			category
		};
	}
});

// Get post by slug
export const getBySlug = query({
	args: { slug: v.string() },
	handler: async (ctx, args) => {
		const post = await ctx.db
			.query("posts")
			.filter(q => q.eq(q.field("slug"), args.slug))
			.first();

		if (!post) {
			throw new ConvexError("Post not found");
		}

		// Get category details
		const category = post?.categoryId
			? await ctx.db.get(post.categoryId)
			: null;

		return {
			...post,
			category
		};
	}
});

export const getMetadataBySlug = query({
	args: { slug: v.string() },
	handler: async (ctx, args) => {
		const post = await ctx.db
			.query("posts")
			.filter(q => q.eq(q.field("slug"), args.slug))
			.first();

		return post;
	}
});

// Create a new post
export const create = mutation({
	args: {
		title: v.string(),
		coverImage: v.optional(v.string()),
		body: v.string(),
		categoryId: v.id("categories"),
		audio: v.optional(v.string()),
		isPublished: v.optional(v.boolean())
	},
	handler: async (ctx, args) => {
		// Verify the category exists
		const category = await ctx.db.get(args.categoryId);
		if (!category) {
			throw new ConvexError("Category not found");
		}

		const slug = generateSlug(args.title);
		const preview = generatePreview(args.body);
		const isPublished = args.isPublished ?? false;

		// For published posts, set the published date
		const publishedAt = isPublished ? Date.now() : undefined;

		// Create post
		const postId = await ctx.db.insert("posts", {
			title: args.title,
			slug,
			coverImage: args.coverImage,
			preview,
			body: args.body,
			categoryId: args.categoryId,
			audio: args.audio,
			isPublished,
			publishedAt,
			createdAt: Date.now(),
			updatedAt: Date.now()
		});

		return postId;
	}
});

// Update post
export const update = mutation({
	args: {
		id: v.id("posts"),
		title: v.optional(v.string()),
		coverImage: v.optional(v.string()),
		body: v.optional(v.string()),
		categoryId: v.optional(v.id("categories")),
		audio: v.optional(v.string()),
		isPublished: v.optional(v.boolean())
	},
	handler: async (ctx, args) => {
		const { id, ...updates } = args;

		// Check if post exists
		const post = await ctx.db.get(id);
		if (!post) {
			throw new ConvexError("Post not found");
		}

		// If we're updating the category, verify it exists
		if (updates.categoryId) {
			const category = await ctx.db.get(updates.categoryId);
			if (!category) {
				throw new ConvexError("Category not found");
			}
		}

		// Generate new slug if title is changed
		let updateData: any = { ...updates };

		if (updates.title) {
			updateData.slug = generateSlug(updates.title);
		}

		// Generate new preview if body is changed
		if (updates.body) {
			updateData.preview = generatePreview(updates.body);
		}

		// If changing publish status to true, set published date
		if (updates.isPublished === true && !post.isPublished) {
			updateData.publishedAt = Date.now();
		}

		// Update post
		await ctx.db.patch(id, {
			...updateData,
			updatedAt: Date.now()
		});

		return id;
	}
});

// Delete post
export const remove = mutation({
	args: {
		id: v.id("posts")
	},
	handler: async (ctx, args) => {
		const post = await ctx.db.get(args.id);
		if (!post) {
			throw new ConvexError("Post not found");
		}

		// Delete all likes for this post
		const likes = await ctx.db
			.query("likes")
			.filter(q => q.eq(q.field("postId"), args.id))
			.collect();

		for (const like of likes) {
			await ctx.db.delete(like._id);
		}

		// Delete all comments for this post
		const comments = await ctx.db
			.query("comments")
			.filter(q => q.eq(q.field("postId"), args.id))
			.collect();

		for (const comment of comments) {
			await ctx.db.delete(comment._id);
		}

		// Delete all featured posts references
		const featuredPosts = await ctx.db
			.query("featuredPosts")
			.filter(q => q.eq(q.field("postId"), args.id))
			.collect();

		for (const featuredPost of featuredPosts) {
			await ctx.db.delete(featuredPost._id);
		}

		// Delete the post
		await ctx.db.delete(args.id);
		return true;
	}
});

// List all posts with pagination
export const list = query({
	args: {
		paginationOpts: paginationOptsValidator,
		categoryId: v.optional(v.id("categories")),
		isPublished: v.optional(v.boolean()),
		search: v.optional(v.string())
	},
	handler: async (ctx, args) => {
		// If search is provided, use the search index
		if (args.search) {
			const baseQuery = ctx.db
				.query("posts")
				.withSearchIndex("search_posts", q => {
					let searchFilter = q.search("title", args.search ?? "");

					// Add filter fields if provided
					if (args.categoryId) {
						searchFilter = searchFilter.eq("categoryId", args.categoryId);
					}
					if (args.isPublished !== undefined) {
						searchFilter = searchFilter.eq("isPublished", args.isPublished);
					}

					return searchFilter;
				});

			const posts = await baseQuery.paginate(args.paginationOpts);

			// For each post, get the category details
			const postsWithCategories = await Promise.all(
				posts.page.map(async (post: Doc<"posts">) => {
					const category = post.categoryId
						? await ctx.db.get(post.categoryId)
						: null;
					return { ...post, category };
				})
			);

			return { ...posts, page: postsWithCategories };
		}

		let baseQuery = ctx.db.query("posts");

		// Use regular filtering when no search is provided
		if (args.categoryId) {
			baseQuery = baseQuery.filter(q =>
				q.eq(q.field("categoryId"), args.categoryId)
			);
		}

		if (args.isPublished !== undefined) {
			baseQuery = baseQuery.filter(q =>
				q.eq(q.field("isPublished"), args.isPublished)
			);
		}

		// Apply ordering and pagination
		const posts = await baseQuery.order("desc").paginate(args.paginationOpts);

		// For each post, get the category details
		const postsWithCategories = await Promise.all(
			posts.page.map(async (post: Doc<"posts">) => {
				const category = post.categoryId
					? await ctx.db.get(post.categoryId)
					: null;
				return { ...post, category };
			})
		);

		return { ...posts, page: postsWithCategories };
	}
});

// Toggle publish status
export const togglePublish = mutation({
	args: {
		id: v.id("posts")
	},
	handler: async (ctx, args) => {
		const post = await ctx.db.get(args.id);
		if (!post) {
			throw new ConvexError("Post not found");
		}

		const isPublished = !post.isPublished;
		const publishedAt =
			isPublished && !post.publishedAt ? Date.now() : post.publishedAt;

		await ctx.db.patch(args.id, {
			isPublished,
			publishedAt,
			updatedAt: Date.now()
		});

		return args.id;
	}
});

// Get recent posts
export const getRecent = query({
	args: {
		limit: v.optional(v.number())
	},
	handler: async (ctx, args) => {
		const limit = args.limit ?? 5;

		const posts = await ctx.db
			.query("posts")
			.filter(q => q.eq(q.field("isPublished"), true))
			.order("desc")
			.take(limit);

		const postsWithCategories = await Promise.all(
			posts.map(async post => {
				const category = post.categoryId
					? await ctx.db.get(post.categoryId)
					: null;
				return {
					...post,
					category
				};
			})
		);

		return postsWithCategories;
	}
});
