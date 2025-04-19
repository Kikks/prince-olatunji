import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";

// Get category by ID
export const get = query({
	args: { id: v.id("categories") },
	handler: async (ctx, args) => {
		const category = await ctx.db.get(args.id);
		if (!category) {
			throw new ConvexError("Category not found");
		}
		return category;
	}
});

// Create a new category
export const create = mutation({
	args: {
		name: v.string(),
		image: v.optional(v.string()),
		description: v.optional(v.string()),
		isFeatured: v.optional(v.boolean())
	},
	handler: async (ctx, args) => {
		// Check if category with name already exists
		const existingCategory = await ctx.db
			.query("categories")
			.filter(q => q.eq(q.field("name"), args.name))
			.first();

		if (existingCategory) {
			throw new ConvexError("Category with this name already exists");
		}

		// Create category
		const categoryId = await ctx.db.insert("categories", {
			name: args.name,
			image: args.image,
			description: args.description,
			isFeatured: args.isFeatured ?? false,
			createdAt: Date.now(),
			updatedAt: Date.now()
		});

		return categoryId;
	}
});

// Update category
export const update = mutation({
	args: {
		id: v.id("categories"),
		name: v.optional(v.string()),
		image: v.optional(v.string()),
		description: v.optional(v.string()),
		isFeatured: v.optional(v.boolean())
	},
	handler: async (ctx, args) => {
		const { id, ...updates } = args;

		// Check if category exists
		const category = await ctx.db.get(id);
		if (!category) {
			throw new ConvexError("Category not found");
		}

		// Check if name is being updated and if it's already taken
		if (updates.name && updates.name !== category.name) {
			const existingCategory = await ctx.db
				.query("categories")
				.filter(q => q.eq(q.field("name"), updates.name as string))
				.first();

			if (existingCategory) {
				throw new ConvexError("Category name already in use");
			}
		}

		// Update category
		await ctx.db.patch(id, {
			...updates,
			updatedAt: Date.now()
		});

		return id;
	}
});

// Delete category
export const remove = mutation({
	args: {
		id: v.id("categories")
	},
	handler: async (ctx, args) => {
		const category = await ctx.db.get(args.id);
		if (!category) {
			throw new ConvexError("Category not found");
		}

		// Check if any posts are using this category
		const postsWithCategory = await ctx.db
			.query("posts")
			.filter(q => q.eq(q.field("categoryId"), args.id))
			.first();

		if (postsWithCategory) {
			throw new ConvexError(
				"Cannot delete category that is being used by posts"
			);
		}

		await ctx.db.delete(args.id);
		return true;
	}
});

// List all categories
export const list = query({
	handler: async ctx => {
		const categories = await ctx.db.query("categories").collect();
		return categories;
	}
});

// List featured categories
export const listFeatured = query({
	handler: async ctx => {
		const featuredCategories = await ctx.db
			.query("categories")
			.filter(q => q.eq(q.field("isFeatured"), true))
			.collect();

		return featuredCategories;
	}
});

// Toggle featured status
export const toggleFeatured = mutation({
	args: {
		id: v.id("categories")
	},
	handler: async (ctx, args) => {
		const category = await ctx.db.get(args.id);
		if (!category) {
			throw new ConvexError("Category not found");
		}

		await ctx.db.patch(args.id, {
			isFeatured: !category.isFeatured,
			updatedAt: Date.now()
		});

		return args.id;
	}
});
