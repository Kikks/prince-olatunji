import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { createClient } from "@supabase/supabase-js";

// Generate a URL for uploading a file to Supabase Storage
export const generateUploadUrl = mutation({
	args: {
		fileName: v.string(),
		contentType: v.string(),
		bucket: v.string(),
		folder: v.optional(v.string())
	},
	handler: async (ctx, args) => {
		// Environment variables must be set in the Convex dashboard
		const supabaseUrl = process.env.SUPABASE_URL;
		const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

		if (!supabaseUrl || !supabaseServiceKey) {
			throw new ConvexError("Supabase configuration is missing");
		}

		// Create Supabase client with the service role key
		const supabase = createClient(supabaseUrl, supabaseServiceKey);

		// Construct the full path including folder if provided
		const path = args.folder
			? `${args.folder}/${args.fileName}`
			: args.fileName;

		// Get the signed URL for upload
		const { data, error } = await supabase.storage
			.from(args.bucket)
			.createSignedUploadUrl(path);

		if (error) {
			throw new ConvexError(`Failed to generate upload URL: ${error.message}`);
		}

		return data;
	}
});

// Get a public URL for a file in Supabase Storage
export const getPublicUrl = query({
	args: {
		bucket: v.string(),
		path: v.string()
	},
	handler: async (ctx, args) => {
		// Environment variables must be set in the Convex dashboard
		const supabaseUrl = process.env.SUPABASE_URL;
		const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

		if (!supabaseUrl || !supabaseAnonKey) {
			throw new ConvexError("Supabase configuration is missing");
		}

		// Create Supabase client
		const supabase = createClient(supabaseUrl, supabaseAnonKey);

		// Generate public URL
		const { data } = supabase.storage.from(args.bucket).getPublicUrl(args.path);

		return { publicUrl: data.publicUrl };
	}
});

// Delete a file from Supabase Storage
export const deleteFile = mutation({
	args: {
		bucket: v.string(),
		path: v.string()
	},
	handler: async (ctx, args) => {
		// Environment variables must be set in the Convex dashboard
		const supabaseUrl = process.env.SUPABASE_URL;
		const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

		if (!supabaseUrl || !supabaseServiceKey) {
			throw new ConvexError("Supabase configuration is missing");
		}

		// Create Supabase client with the service role key
		const supabase = createClient(supabaseUrl, supabaseServiceKey);

		// Delete the file
		const { error } = await supabase.storage
			.from(args.bucket)
			.remove([args.path]);

		if (error) {
			throw new ConvexError(`Failed to delete file: ${error.message}`);
		}

		return true;
	}
});
