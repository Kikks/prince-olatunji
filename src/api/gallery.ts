import baseAxios from "./axios";
import { PaginatedObjectResponse, Gallery } from "@/types";

export const getGallery = async () => {
	const response = await baseAxios.get<PaginatedObjectResponse<Gallery>>(
		"/gallery?populate=*"
	);
	return response.data;
};
