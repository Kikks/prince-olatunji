import { ConvexReactClient } from "convex/react";
import { api as convexApi } from "../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

// Create a client
export const convex = new ConvexReactClient(
	process.env.NEXT_PUBLIC_CONVEX_URL as string
);

export const convexApiClient = new ConvexHttpClient(
	process.env.NEXT_PUBLIC_CONVEX_URL as string
);

// Export the API for easy access in components
export const api = convexApi;
