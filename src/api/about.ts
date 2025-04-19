import baseAxios from "./axios";
import { About, PaginatedObjectResponse } from "@/types";

export const getAbout = async () => {
	const response =
		await baseAxios.get<PaginatedObjectResponse<About>>("/about?populate=*");
	return response.data;
};
