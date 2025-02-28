import { HeaderItem } from "@/types/menu";

export const headerData: HeaderItem[] = [
	{ label: "Home", href: "/" },
	{
		label: "About",
		submenu: [
			{
				label: "About Prince Olatunji Olusoji",
				href: "/about/prince-olatunji-olusoji"
			},
			{
				label: "Philanthropic Impact",
				href: "/about/philanthropic-impact"
			},
			{
				label: "Business Acumen",
				href: "/about/business-acumen"
			},
			{
				label: "Nation Building",
				href: "/about/nation-building"
			}
		]
	},
	{ label: "Blog", href: "/blog" },
	{ label: "Gallery", href: "/gallery" },
	{ label: "Contact", href: "/contact" }
];
