import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

// Get comment by ID
export const get = query({
	args: { id: v.id("comments") },
	handler: async (ctx, args) => {
		const comment = await ctx.db.get(args.id);
		if (!comment) {
			throw new ConvexError("Comment not found");
		}

		// Get user details
		const user = await ctx.db.get(comment.userId);

		return {
			...comment,
			user
		};
	}
});

// Create a new comment
export const create = mutation({
	args: {
		body: v.string(),
		postId: v.optional(v.id("posts")),
		parentCommentId: v.optional(v.id("comments")),
		userId: v.id("users")
	},
	handler: async (ctx, args) => {
		// Ensure the user exists
		const user = await ctx.db.get(args.userId);
		if (!user) {
			throw new ConvexError("User not found");
		}

		// Ensure either postId or parentCommentId is provided, but not both
		if (!args.postId && !args.parentCommentId) {
			throw new ConvexError(
				"A comment must be associated with either a post or a parent comment"
			);
		}

		// Verify post exists if postId is provided
		if (args.postId) {
			const post = await ctx.db.get(args.postId);
			if (!post) {
				throw new ConvexError("Post not found");
			}
		}

		// Verify parent comment exists if parentCommentId is provided
		if (args.parentCommentId) {
			const parentComment = await ctx.db.get(args.parentCommentId);
			if (!parentComment) {
				throw new ConvexError("Parent comment not found");
			}
		}

		// Create comment
		const commentId = await ctx.db.insert("comments", {
			body: args.body,
			postId: args.postId,
			parentCommentId: args.parentCommentId,
			userId: args.userId,
			createdAt: Date.now(),
			updatedAt: Date.now()
		});

		return commentId;
	}
});

// Update comment
export const update = mutation({
	args: {
		id: v.id("comments"),
		body: v.string(),
		userId: v.id("users") // User ID for permission check
	},
	handler: async (ctx, args) => {
		// Check if comment exists
		const comment = await ctx.db.get(args.id);
		if (!comment) {
			throw new ConvexError("Comment not found");
		}

		// Verify the user is the author of the comment
		if (comment.userId.toString() !== args.userId.toString()) {
			throw new ConvexError("You are not authorized to update this comment");
		}

		// Update comment
		await ctx.db.patch(args.id, {
			body: args.body,
			updatedAt: Date.now()
		});

		return args.id;
	}
});

// Delete comment
export const remove = mutation({
	args: {
		id: v.id("comments"),
		userId: v.id("users") // User ID for permission check
	},
	handler: async (ctx, args) => {
		const comment = await ctx.db.get(args.id);
		if (!comment) {
			throw new ConvexError("Comment not found");
		}

		// Verify the user is the author of the comment
		if (comment.userId.toString() !== args.userId.toString()) {
			throw new ConvexError("You are not authorized to delete this comment");
		}

		// Delete all child comments
		const childComments = await ctx.db
			.query("comments")
			.filter(q => q.eq(q.field("parentCommentId"), args.id))
			.collect();

		for (const childComment of childComments) {
			await ctx.db.delete(childComment._id);
		}

		// Delete all likes for this comment
		const likes = await ctx.db
			.query("likes")
			.filter(q => q.eq(q.field("commentId"), args.id))
			.collect();

		for (const like of likes) {
			await ctx.db.delete(like._id);
		}

		// Delete the comment
		await ctx.db.delete(args.id);
		return true;
	}
});

// List comments for a post
export const listByPost = query({
	args: {
		postId: v.id("posts"),
		page: v.optional(v.number()),
		limit: v.optional(v.number())
	},
	handler: async (ctx, args) => {
		const page = args.page ?? 1;
		const limit = args.limit ?? 10;
		const skip = (page - 1) * limit;

		// Get top-level comments for the post
		const commentsQuery = ctx.db
			.query("comments")
			.filter(q =>
				q.and(
					q.eq(q.field("postId"), args.postId),
					q.eq(q.field("parentCommentId"), null)
				)
			);

		const comments = await commentsQuery
			.order("desc")
			.paginate({ numItems: limit, cursor: skip.toString() });

		// For each comment, get the user details and child comments
		const commentsWithDetails = await Promise.all(
			comments.page.map(async comment => {
				const user = await ctx.db.get(comment.userId);

				// Get replies to this comment
				const replies = await ctx.db
					.query("comments")
					.filter(q => q.eq(q.field("parentCommentId"), comment._id))
					.order("asc")
					.collect();

				// For each reply, get the user details
				const repliesWithUsers = await Promise.all(
					replies.map(async reply => {
						const replyUser = await ctx.db.get(reply.userId);
						return {
							...reply,
							user: replyUser
						};
					})
				);

				return {
					...comment,
					user,
					replies: repliesWithUsers
				};
			})
		);

		// Get total count for pagination
		const total = await commentsQuery.collect();

		return {
			data: commentsWithDetails,
			meta: {
				currentPage: page,
				pages: Math.ceil(total.length / limit),
				total: total.length
			}
		};
	}
});

// Get replies to a comment
export const getReplies = query({
	args: {
		commentId: v.id("comments"),
		page: v.optional(v.number()),
		limit: v.optional(v.number())
	},
	handler: async (ctx, args) => {
		const page = args.page ?? 1;
		const limit = args.limit ?? 10;
		const skip = (page - 1) * limit;

		// Check if comment exists
		const comment = await ctx.db.get(args.commentId);
		if (!comment) {
			throw new ConvexError("Comment not found");
		}

		// Get replies to this comment
		const repliesQuery = ctx.db
			.query("comments")
			.filter(q => q.eq(q.field("parentCommentId"), args.commentId));

		const replies = await repliesQuery
			.order("asc")
			.paginate({ numItems: limit, cursor: skip.toString() });

		// For each reply, get the user details
		const repliesWithUsers = await Promise.all(
			replies.page.map(async reply => {
				const user = await ctx.db.get(reply.userId);
				return {
					...reply,
					user
				};
			})
		);

		// Get total count for pagination
		const total = await repliesQuery.collect();

		return {
			data: repliesWithUsers,
			meta: {
				currentPage: page,
				pages: Math.ceil(total.length / limit),
				total: total.length
			}
		};
	}
});
