"use client";

import { useQuery } from "@tanstack/react-query";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { Category } from "@/types";
import Skeleton from "react-loading-skeleton";
import queryKeys from "@/lib/query-keys";
import { getBasicCategoriesDetails } from "@/api/categories";

interface CategoryFilterProps {
	onSelectCategory: (categoryId: string | null) => void;
	selectedCategory: string | null;
}

export default function CategoryFilter({
	onSelectCategory,
	selectedCategory
}: CategoryFilterProps) {
	const { data: categories, isLoading } = useQuery({
		queryKey: [queryKeys.getCategories],
		queryFn: () =>
			getBasicCategoriesDetails({
				page: 1,
				pageSize: 500
			})
	});

	if (isLoading) {
		return (
			<div className='w-full h-10'>
				<div className='-mt-1 h-full'>
					<Skeleton className='w-full h-full' />
				</div>
			</div>
		);
	}

	return (
		<Select
			value={selectedCategory ?? "all"}
			onValueChange={value => onSelectCategory(value === "all" ? null : value)}
		>
			<SelectTrigger className='w-full'>
				<SelectValue placeholder='Select a category' />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value='all'>All Categories</SelectItem>
				{categories?.data?.map((category: Category) => (
					<SelectItem key={category.id} value={category.id.toString()}>
						{category.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
