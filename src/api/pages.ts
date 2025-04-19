import { Page } from "@/types";
import baseAxios from "./axios";

export const getPageBySlug = async (slug: string) => {
	const response = await baseAxios.get<Page>(`/pages/slug/${slug}`);
	return response.data;
};

export const getPageSEODataBySlug = async (slug: string) => {
	const response = await baseAxios.get<Page>(`/pages/slug/${slug}/seo`);
	return response.data;
};
