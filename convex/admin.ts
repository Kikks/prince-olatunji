import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import bcrypt from "bcryptjs";

// Get admin by ID
export const get = query({
	args: { id: v.id("admins") },
	handler: async (ctx, args) => {
		const admin = await ctx.db.get(args.id);
		if (!admin) {
			throw new ConvexError("Admin not found");
		}

		// Remove password from response
		const { password, ...adminWithoutPassword } = admin;
		return adminWithoutPassword;
	}
});

// Create a new admin
export const create = mutation({
	args: {
		firstName: v.string(),
		lastName: v.string(),
		email: v.string(),
		password: v.string(),
		image: v.optional(v.string())
	},
	handler: async (ctx, args) => {
		// Check if admin with email already exists
		const existingAdmin = await ctx.db
			.query("admins")
			.filter(q => q.eq(q.field("email"), args.email))
			.first();

		if (existingAdmin) {
			throw new ConvexError("Admin with this email already exists");
		}

		const hashedPassword = await bcrypt.hash(args.password, 12);

		// Create admin
		const adminId = await ctx.db.insert("admins", {
			firstName: args.firstName,
			lastName: args.lastName,
			email: args.email,
			password: hashedPassword,
			image: args.image,
			createdAt: Date.now(),
			updatedAt: Date.now()
		});

		return adminId;
	}
});

// Update admin
export const update = mutation({
	args: {
		id: v.id("admins"),
		firstName: v.optional(v.string()),
		lastName: v.optional(v.string()),
		email: v.optional(v.string()),
		image: v.optional(v.string())
	},
	handler: async (ctx, args) => {
		const { id, ...updates } = args;

		// Check if admin exists
		const admin = await ctx.db.get(id);
		if (!admin) {
			throw new ConvexError("Admin not found");
		}

		// Check if email is being updated and if it's already taken
		if (updates.email && updates.email !== admin.email) {
			const existingAdmin = await ctx.db
				.query("admins")
				.filter(q => q.eq(q.field("email"), updates.email as string))
				.first();

			if (existingAdmin) {
				throw new ConvexError("Email already in use");
			}
		}

		// Update admin
		await ctx.db.patch(id, {
			...updates,
			updatedAt: Date.now()
		});

		return id;
	}
});

// Change admin password
export const changePassword = mutation({
	args: {
		id: v.id("admins"),
		currentPassword: v.string(),
		newPassword: v.string()
	},
	handler: async (ctx, args) => {
		const admin = await ctx.db.get(args.id);
		if (!admin) {
			throw new ConvexError("Admin not found");
		}

		// Verify current password - in a real app, use proper password comparison
		const isPasswordValid = await bcrypt.compare(
			args.currentPassword,
			admin.password ?? ""
		);

		if (!isPasswordValid) {
			throw new ConvexError("Current password is incorrect");
		}

		// Update password - in a real app, hash the password
		const hashedPassword = await bcrypt.hash(args.newPassword, 12);

		await ctx.db.patch(args.id, {
			password: hashedPassword,
			updatedAt: Date.now()
		});

		return true;
	}
});

// Login admin
export const login = mutation({
	args: {
		email: v.string(),
		password: v.string()
	},
	handler: async (ctx, args) => {
		// Find admin by email
		const admin = await ctx.db
			.query("admins")
			.filter(q => q.eq(q.field("email"), args.email))
			.first();

		if (!admin || !admin.password) {
			throw new ConvexError("Invalid email or password");
		}

		// Verify password - in a real app, use proper password comparison
		const isPasswordValid = await bcrypt.compare(
			args.password,
			admin.password ?? ""
		);

		if (!isPasswordValid) {
			throw new ConvexError("Invalid email or password");
		}

		// Return admin data (without password)
		const { password, ...adminWithoutPassword } = admin;
		return adminWithoutPassword;
	}
});

// Delete admin
export const remove = mutation({
	args: {
		id: v.id("admins")
	},
	handler: async (ctx, args) => {
		const admin = await ctx.db.get(args.id);
		if (!admin) {
			throw new ConvexError("Admin not found");
		}

		await ctx.db.delete(args.id);
		return true;
	}
});

// List all admins
export const list = query({
	handler: async ctx => {
		const admins = await ctx.db.query("admins").collect();

		// Remove passwords from response
		return admins.map(admin => {
			const { password, ...adminWithoutPassword } = admin;
			return adminWithoutPassword;
		});
	}
});
