import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

// Get user by ID
export const get = query({
	args: { id: v.id("users") },
	handler: async (ctx, args) => {
		const user = await ctx.db.get(args.id);
		if (!user) {
			throw new ConvexError("User not found");
		}
		return user;
	}
});

// Create a new user or get existing user by email (for authentication)
export const getOrCreate = mutation({
	args: {
		name: v.string(),
		email: v.string(),
		image: v.optional(v.string())
	},
	handler: async (ctx, args) => {
		// Check if user with email already exists
		const existingUser = await ctx.db
			.query("users")
			.filter(q => q.eq(q.field("email"), args.email))
			.first();

		if (existingUser) {
			// User exists, return user info
			return existingUser;
		}

		// User doesn't exist, create new user
		const userId = await ctx.db.insert("users", {
			name: args.name,
			email: args.email,
			image: args.image,
			createdAt: Date.now(),
			updatedAt: Date.now()
		});

		const newUser = await ctx.db.get(userId);
		return newUser;
	}
});

// Update user
export const update = mutation({
	args: {
		id: v.id("users"),
		name: v.optional(v.string()),
		image: v.optional(v.string())
	},
	handler: async (ctx, args) => {
		const { id, ...updates } = args;

		// Check if user exists
		const user = await ctx.db.get(id);
		if (!user) {
			throw new ConvexError("User not found");
		}

		// Update user
		await ctx.db.patch(id, {
			...updates,
			updatedAt: Date.now()
		});

		return id;
	}
});

// List all users with pagination
export const list = query({
	args: {
		page: v.optional(v.number()),
		limit: v.optional(v.number()),
		search: v.optional(v.string())
	},
	handler: async (ctx, args) => {
		const page = args.page ?? 1;
		const limit = args.limit ?? 10;
		const skip = (page - 1) * limit;

		// Get all users first (for search filtering)
		const allUsers = await ctx.db.query("users").collect();

		// Apply search filter if provided
		let filteredUsers = allUsers;
		if (args.search && args.search.trim() !== "") {
			const searchTerm = args.search.toLowerCase();
			filteredUsers = allUsers.filter(
				user =>
					user.name.toLowerCase().includes(searchTerm) ||
					user.email.toLowerCase().includes(searchTerm)
			);
		}

		// Sort users by creation date (newest first)
		filteredUsers.sort((a, b) => b.createdAt - a.createdAt);

		// Apply pagination
		const paginatedUsers = filteredUsers.slice(skip, skip + limit);

		return {
			data: paginatedUsers,
			meta: {
				currentPage: page,
				pages: Math.ceil(filteredUsers.length / limit),
				total: filteredUsers.length
			}
		};
	}
});

// Get user by email
export const getByEmail = query({
	args: { email: v.string() },
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.filter(q => q.eq(q.field("email"), args.email))
			.first();

		return user;
	}
});

// Get user's activity (posts, comments, likes)
export const getActivity = query({
	args: {
		userId: v.id("users")
	},
	handler: async (ctx, args) => {
		// Get user's comments
		const comments = await ctx.db
			.query("comments")
			.filter(q => q.eq(q.field("userId"), args.userId))
			.order("desc")
			.take(10);

		// Get user's likes
		const likes = await ctx.db
			.query("likes")
			.filter(q => q.eq(q.field("userId"), args.userId))
			.order("desc")
			.take(10);

		// For each like, get the associated post or comment
		const likesWithDetails = await Promise.all(
			likes.map(async like => {
				if (like.postId) {
					const post = await ctx.db.get(like.postId);
					return {
						...like,
						targetType: "post",
						target: post
					};
				} else if (like.commentId) {
					const comment = await ctx.db.get(like.commentId);
					return {
						...like,
						targetType: "comment",
						target: comment
					};
				}
				return like;
			})
		);

		return {
			comments,
			likes: likesWithDetails
		};
	}
});
