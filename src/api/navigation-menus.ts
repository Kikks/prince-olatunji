import baseAxios from "./axios";
import { NavigationMenu } from "@/types";

export const getNavigationMenus = async () => {
	const response = await baseAxios.get<NavigationMenu[]>(`/navigation-menus`);
	return response.data;
};
