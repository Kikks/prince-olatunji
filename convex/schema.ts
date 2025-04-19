import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	admins: defineTable({
		firstName: v.string(),
		lastName: v.string(),
		email: v.string(),
		image: v.optional(v.string()),
		password: v.optional(v.string()),
		createdAt: v.number(),
		updatedAt: v.number()
	}).index("by_email", ["email"]),

	categories: defineTable({
		name: v.string(),
		image: v.optional(v.string()),
		description: v.optional(v.string()),
		isFeatured: v.optional(v.boolean()),
		createdAt: v.number(),
		updatedAt: v.number()
	}).index("by_name", ["name"]),

	posts: defineTable({
		title: v.string(),
		slug: v.string(),
		coverImage: v.optional(v.string()),
		preview: v.string(),
		body: v.string(),
		categoryId: v.id("categories"),
		audio: v.optional(v.string()),
		isPublished: v.boolean(),
		publishedAt: v.optional(v.number()),
		createdAt: v.number(),
		updatedAt: v.number()
	})
		.index("by_slug", ["slug"])
		.index("by_category", ["categoryId"])
		.index("by_published", ["isPublished"])
		.searchIndex("search_posts", {
			searchField: "title",
			filterFields: ["categoryId", "isPublished"]
		}),

	users: defineTable({
		name: v.string(),
		email: v.string(),
		image: v.optional(v.string()),
		createdAt: v.number(),
		updatedAt: v.number()
	}).index("by_email", ["email"]),

	comments: defineTable({
		body: v.string(),
		postId: v.optional(v.id("posts")),
		parentCommentId: v.optional(v.id("comments")),
		userId: v.id("users"),
		createdAt: v.number(),
		updatedAt: v.number()
	})
		.index("by_post", ["postId"])
		.index("by_parent_comment", ["parentCommentId"])
		.index("by_user", ["userId"]),

	likes: defineTable({
		postId: v.optional(v.id("posts")),
		commentId: v.optional(v.id("comments")),
		userId: v.id("users"),
		createdAt: v.number(),
		updatedAt: v.number()
	})
		.index("by_post", ["postId"])
		.index("by_comment", ["commentId"])
		.index("by_user", ["userId"])
		.index("by_post_and_user", ["postId", "userId"])
		.index("by_comment_and_user", ["commentId", "userId"]),

	featuredPosts: defineTable({
		postId: v.id("posts"),
		themeId: v.string(),
		index: v.number(),
		createdAt: v.number(),
		updatedAt: v.number()
	}).index("by_post", ["postId"])
});
