"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";
import _ from "lodash";

import { BlogCard, BlogCardLoader } from "./BlogCard";
import queryKeys from "@/lib/query-keys";
import { getBasicArticlesDetails } from "@/api/articles";
import { Article } from "@/types";

interface BlogListProps {
	searchQuery: string;
	categoryId: string | null;
}

const POST_LIMIT = 10;

const parentVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			delay: 0.5,
			staggerChildren: 0.2
		}
	}
};

export function BlogList({ searchQuery, categoryId }: BlogListProps) {
	const loadMoreRef = useRef(null);
	const [results, setResults] = useState<Article[]>([]);
	const observerRef = useRef<IntersectionObserver | null>(null);
	const initialLoadComplete = useRef(false);

	useEffect(() => {
		setResults([]);
		initialLoadComplete.current = false;
	}, [searchQuery, categoryId]);

	const {
		data: pageData,
		fetchNextPage,
		hasNextPage,
		isLoading,
		isFetchingNextPage
	} = useInfiniteQuery({
		queryKey: [queryKeys.getArticles, categoryId, searchQuery],
		queryFn: ({ pageParam }) =>
			getBasicArticlesDetails({
				page: pageParam,
				pageSize: POST_LIMIT,
				categoryId: categoryId || undefined,
				searchQuery: searchQuery || undefined
			}),
		initialPageParam: 1,
		getNextPageParam: lastPage => {
			if (!lastPage?.meta?.pagination) return undefined;
			return lastPage.meta.pagination.pageCount > lastPage.meta.pagination.page
				? lastPage.meta.pagination.page + 1
				: undefined;
		},
		getPreviousPageParam: (_, __, firstPageParam) =>
			firstPageParam > 1 ? firstPageParam - 1 : undefined
	});

	useEffect(() => {
		if (pageData?.pages?.length && !initialLoadComplete.current) {
			initialLoadComplete.current = true;
		}
	}, [pageData?.pages?.length]);

	useEffect(() => {
		if (pageData?.pages) {
			setResults(prev =>
				_.uniqBy([...prev, ...pageData.pages.flatMap(page => page.data)], "id")
			);
		}
	}, [pageData]);

	useEffect(() => {
		if (observerRef.current) {
			observerRef.current.disconnect();
			observerRef.current = null;
		}

		if (!initialLoadComplete.current) return;

		if (!hasNextPage || isFetchingNextPage) return;

		const currentRef = loadMoreRef.current;
		if (!currentRef) return;

		const observer = new IntersectionObserver(
			entries => {
				const entry = entries[0];
				if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{
				rootMargin: "100px",
				threshold: 0.1
			}
		);

		observer.observe(currentRef);
		observerRef.current = observer;

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
				observerRef.current = null;
			}
		};
	}, [
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
		initialLoadComplete.current
	]);

	if (results.length === 0 && isLoading) {
		return (
			<motion.div
				className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10'
				variants={parentVariants}
				initial='hidden'
				animate='visible'
			>
				{Array(POST_LIMIT)
					.fill(0)
					.map((_, i) => (
						<BlogCardLoader key={i} />
					))}
			</motion.div>
		);
	}

	if (results.length === 0 && !isFetchingNextPage) {
		return (
			<div className='text-center py-32'>
				<h3 className='text-xl font-medium mb-2'>No posts found</h3>
				<p className='text-gray-600 dark:text-gray-400'>
					{searchQuery
						? `No results for "${searchQuery}"`
						: categoryId
							? "No posts available for this category"
							: "No posts available"}
				</p>
			</div>
		);
	}

	return (
		<>
			<motion.div
				className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10'
				variants={parentVariants}
				initial='hidden'
				animate='visible'
			>
				{results?.map(post => <BlogCard key={post.id} post={post} />)}

				{isFetchingNextPage &&
					Array(POST_LIMIT)
						.fill(0)
						.map((_, i) => <BlogCardLoader key={i} />)}
			</motion.div>

			{hasNextPage && (
				<div
					ref={loadMoreRef}
					className='h-20 w-full flex items-center justify-center mt-8'
				>
					{initialLoadComplete.current && (
						<button
							onClick={() => fetchNextPage()}
							disabled={isFetchingNextPage}
							className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 opacity-0'
						>
							{isFetchingNextPage ? "Loading more..." : "Load more"}
						</button>
					)}
				</div>
			)}
		</>
	);
}
