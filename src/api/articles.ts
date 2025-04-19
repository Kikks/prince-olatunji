import qs from "qs";

import baseAxios from "./axios";
import { Article, PaginatedList } from "@/types";

export const getBasicArticlesDetails = async ({
	page = 1,
	pageSize = 10,
	categoryId,
	searchQuery
}: {
	page?: number;
	pageSize?: number;
	categoryId?: string;
	searchQuery?: string;
}) => {
	const query = qs.stringify(
		{
			...((categoryId || searchQuery) && {
				filters: {
					...(categoryId && {
						category: {
							id: { $eq: categoryId }
						}
					}),
					...(searchQuery && {
						title: { $containsi: searchQuery }
					})
				}
			}),
			fields: ["title", "publishedAt", "slug"],
			populate: {
				cover: { fields: ["formats", "url"] },
				category: { fields: ["name", "slug"] },
				blocks: { on: { "shared.rich-text": "*" } }
			},
			pagination: {
				page,
				pageSize
			}
		},
		{
			encodeValuesOnly: true
		}
	);

	const response = await baseAxios.get<PaginatedList<Article>>(
		`/articles?${query}`
	);
	return response.data;
};

export const getArticleSEODataBySlug = async (slug: string) => {
	const response = await baseAxios.get<Article>(`/articles/slug/${slug}/seo`);
	return response.data;
};

export const getArticleBySlug = async (slug: string) => {
	const response = await baseAxios.get<Article>(`/articles/slug/${slug}`);
	return response.data;
};
