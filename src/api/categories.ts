import qs from "qs";

import baseAxios from "./axios";
import { Category, PaginatedList } from "@/types";

export const getBasicCategoriesDetails = async ({
	page = 1,
	pageSize = 10
}: {
	page?: number;
	pageSize?: number;
}) => {
	const query = qs.stringify(
		{
			fields: ["name", "slug"],
			pagination: {
				page,
				pageSize
			}
		},
		{
			encodeValuesOnly: true
		}
	);

	const response = await baseAxios.get<PaginatedList<Category>>(
		`/categories?${query}`
	);
	return response.data;
};
