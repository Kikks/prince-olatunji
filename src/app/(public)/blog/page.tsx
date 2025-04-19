"use client";

import { useEffect, useState, Suspense } from "react";
import { BlogList } from "@/components/blog/BlogList";
import SearchBar from "@/components/blog/SearchBar";
import CategoryFilter from "@/components/blog/CategoryFilter";
import ScrollFloat from "@/components/ui/ScrollFloat/ScrollFloat";
import { useSearchParams } from "next/navigation";

function BlogPageContent() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const searchParams = useSearchParams();

	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	const handleCategorySelect = (categoryId: string | null) => {
		setSelectedCategory(categoryId);
	};

	useEffect(() => {
		if (searchParams.get("category")) {
			setSelectedCategory(searchParams.get("category") as string);
		}
	}, [searchParams]);

	return (
		<main className='container mx-auto px-4 md:px-6 py-24 md:py-32 space-y-10'>
			<div className='w-full flex flex-col items-start md:gap-10 md:flex-row md:justify-between md:items-center'>
				<ScrollFloat
					animationDuration={1}
					ease='back.inOut(2)'
					scrollStart='center bottom+=20%'
					scrollEnd='bottom bottom-=40%'
					stagger={0.03}
					textClassName='text-4xl lg:text-6xl font-bold text-primary'
				>
					Blog
				</ScrollFloat>

				<div className='w-full flex flex-col md:max-w-[500px] lg:max-w-[600px] md:flex-row items-center gap-4'>
					<div className='w-full md:w-[200px]'>
						<CategoryFilter
							onSelectCategory={handleCategorySelect}
							selectedCategory={selectedCategory}
						/>
					</div>

					<div className='w-full md:flex-1'>
						<SearchBar onSearch={handleSearch} />
					</div>
				</div>
			</div>

			<BlogList searchQuery={searchQuery} categoryId={selectedCategory} />
		</main>
	);
}

export default function BlogPage() {
	return (
		<Suspense
			fallback={
				<div className='container mx-auto px-4 md:px-6 py-24 md:py-32'>
					Loading...
				</div>
			}
		>
			<BlogPageContent />
		</Suspense>
	);
}
