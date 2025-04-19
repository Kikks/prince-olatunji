import { Id } from "../../convex/_generated/dataModel";

export type SubmenuItem = {
	label: string;
	href: string;
};

export type HeaderItem = {
	label: string;
	href?: string;
	submenu?: SubmenuItem[];
};

export interface PaginatedList<T> {
	data: T[];
	meta?: {
		pagination: {
			page: number;
			pageSize: number;
			pageCount: number;
			total: number;
		};
	};
}

export interface PaginatedObjectResponse<T> {
	data: T;
	meta?: {
		pagination: {
			page: number;
			pageSize: number;
		};
	};
}

export interface Format {
	ext: string;
	url: string;
	hash: string;
	mime: string;
	name: string;
	path?: string | null;
	size?: number;
	width?: number;
	height?: number;
	sizeInBytes?: number;
}

export interface Cover {
	id: number;
	documentId: string;
	name: string;
	alternativeText: string | null;
	caption: string | null;
	width: number;
	height: number;
	formats: {
		large: Format;
		small: Format;
		medium: Format;
		thumbnail: Format;
	};
	hash: string;
	ext: string;
	mime: "image/jpeg";
	size: number;
	url: string;
	previewUrl?: string | null;
	provider?: string;
	provider_metadata?: any;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}

export interface Category {
	id: number;
	documentId: string;
	name: string;
	slug: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}

export interface RichTextBlock {
	__component: "shared.rich-text";
	id: number;
	body: string;
}

export interface QuoteBlock {
	__component: "shared.quote";
	id: number;
	title: string;
	body: string;
}

export type Block = RichTextBlock | QuoteBlock;

export interface Article {
	id: number;
	documentId: string;
	title: string;
	description: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	cover: Cover;
	category: Category;
	blocks: Block[];
}

export interface Page {
	id: number;
	documentId: string;
	title: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	cover?: Cover;
	blocks?: Block[];
}

export interface NavigationMenu {
	id: number;
	documentId?: string;
	label?: string;
	order?: number;
	createdAt?: string;
	updatedAt?: string;
	publishedAt?: string;
	locale?: string | null;
	has_parent?: boolean;
	custom_url_path?: string;
	children?: NavigationMenu[];
	page?: Page;
}

export interface About {
	id: number;
	documentId: string;
	title: string;
	description: string;
	blocks: Block[];
	cover?: Cover;
}

export interface Gallery {
	id: number;
	blocks: Block[];
	masonry: Cover[];
}
