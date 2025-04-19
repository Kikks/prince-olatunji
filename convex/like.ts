import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { Id } from "./_generated/dataModel";

// Create a new like (or remove if already exists)
export const toggle = mutation({
	args: {
		postId: v.optional(v.id("posts")),
		commentId: v.optional(v.id("comments")),
		userId: v.id("users")
	},
	handler: async (ctx, args) => {
		// Ensure the user exists
		const user = await ctx.db.get(args.userId);
		if (!user) {
			throw new ConvexError("User not found");
		}

		// Ensure either postId or commentId is provided, but not both
		if ((!args.postId && !args.commentId) || (args.postId && args.commentId)) {
			throw new ConvexError(
				"A like must be associated with either a post or a comment, but not both"
			);
		}

		// Verify post exists if postId is provided
		if (args.postId) {
			const post = await ctx.db.get(args.postId);
			if (!post) {
				throw new ConvexError("Post not found");
			}

			// Check if like already exists
			const existingLike = await ctx.db
				.query("likes")
				.filter(q =>
					q.and(
						q.eq(q.field("postId"), args.postId as Id<"posts">),
						q.eq(q.field("userId"), args.userId)
					)
				)
				.first();

			if (existingLike) {
				// Like exists, so remove it
				await ctx.db.delete(existingLike._id);
				return { action: "removed", id: existingLike._id };
			} else {
				// Like doesn't exist, so create it
				const likeId = await ctx.db.insert("likes", {
					postId: args.postId,
					userId: args.userId,
					createdAt: Date.now(),
					updatedAt: Date.now()
				});
				return { action: "added", id: likeId };
			}
		}

		// Verify comment exists if commentId is provided
		if (args.commentId) {
			const comment = await ctx.db.get(args.commentId);
			if (!comment) {
				throw new ConvexError("Comment not found");
			}

			// Check if like already exists
			const existingLike = await ctx.db
				.query("likes")
				.filter(q =>
					q.and(
						q.eq(q.field("commentId"), args.commentId as Id<"comments">),
						q.eq(q.field("userId"), args.userId)
					)
				)
				.first();

			if (existingLike) {
				// Like exists, so remove it
				await ctx.db.delete(existingLike._id);
				return { action: "removed", id: existingLike._id };
			} else {
				// Like doesn't exist, so create it
				const likeId = await ctx.db.insert("likes", {
					commentId: args.commentId,
					userId: args.userId,
					createdAt: Date.now(),
					updatedAt: Date.now()
				});
				return { action: "added", id: likeId };
			}
		}
	}
});

// Check if user has liked a post
export const hasLikedPost = query({
	args: {
		postId: v.id("posts"),
		userId: v.id("users")
	},
	handler: async (ctx, args) => {
		const like = await ctx.db
			.query("likes")
			.filter(q =>
				q.and(
					q.eq(q.field("postId"), args.postId),
					q.eq(q.field("userId"), args.userId)
				)
			)
			.first();

		return !!like;
	}
});

// Check if user has liked a comment
export const hasLikedComment = query({
	args: {
		commentId: v.id("comments"),
		userId: v.id("users")
	},
	handler: async (ctx, args) => {
		const like = await ctx.db
			.query("likes")
			.filter(q =>
				q.and(
					q.eq(q.field("commentId"), args.commentId),
					q.eq(q.field("userId"), args.userId)
				)
			)
			.first();

		return !!like;
	}
});

// Count likes for a post
export const countForPost = query({
	args: {
		postId: v.id("posts")
	},
	handler: async (ctx, args) => {
		const likes = await ctx.db
			.query("likes")
			.filter(q => q.eq(q.field("postId"), args.postId))
			.collect();

		return likes.length;
	}
});

// Count likes for a comment
export const countForComment = query({
	args: {
		commentId: v.id("comments")
	},
	handler: async (ctx, args) => {
		const likes = await ctx.db
			.query("likes")
			.filter(q => q.eq(q.field("commentId"), args.commentId))
			.collect();

		return likes.length;
	}
});

// Get users who liked a post
export const getUsersForPost = query({
	args: {
		postId: v.id("posts"),
		page: v.optional(v.number()),
		limit: v.optional(v.number())
	},
	handler: async (ctx, args) => {
		const page = args.page ?? 1;
		const limit = args.limit ?? 10;
		const skip = (page - 1) * limit;

		const likesQuery = ctx.db
			.query("likes")
			.filter(q => q.eq(q.field("postId"), args.postId));

		const likes = await likesQuery
			.order("desc")
			.paginate({ numItems: limit, cursor: skip.toString() });

		// Get user details for each like
		const usersWhoLiked = await Promise.all(
			likes.page.map(async like => {
				const user = await ctx.db.get(like.userId);
				return user;
			})
		);

		// Get total count for pagination
		const total = await likesQuery.collect();

		return {
			data: usersWhoLiked,
			meta: {
				currentPage: page,
				pages: Math.ceil(total.length / limit),
				total: total.length
			}
		};
	}
});

// Get users who liked a comment
export const getUsersForComment = query({
	args: {
		commentId: v.id("comments"),
		page: v.optional(v.number()),
		limit: v.optional(v.number())
	},
	handler: async (ctx, args) => {
		const page = args.page ?? 1;
		const limit = args.limit ?? 10;
		const skip = (page - 1) * limit;

		const likesQuery = ctx.db
			.query("likes")
			.filter(q => q.eq(q.field("commentId"), args.commentId));

		const likes = await likesQuery
			.order("desc")
			.paginate({ numItems: limit, cursor: skip.toString() });

		// Get user details for each like
		const usersWhoLiked = await Promise.all(
			likes.page.map(async like => {
				const user = await ctx.db.get(like.userId);
				return user;
			})
		);

		// Get total count for pagination
		const total = await likesQuery.collect();

		return {
			data: usersWhoLiked,
			meta: {
				currentPage: page,
				pages: Math.ceil(total.length / limit),
				total: total.length
			}
		};
	}
});
