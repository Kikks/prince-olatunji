"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PiArrowRightBold } from "react-icons/pi";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import ScrollFloat from "@/components/ui/ScrollFloat/ScrollFloat";
import { BlogCard, BlogCardLoader } from "@/components/blog/BlogCard";
import { getBasicArticlesDetails } from "@/api/articles";
import queryKeys from "@/lib/query-keys";
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

const LatestNews = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, amount: 0.2 });
	const { data: posts, isLoading } = useQuery({
		queryKey: [queryKeys.getArticles],
		queryFn: () => getBasicArticlesDetails({ page: 1, pageSize: 3 })
	});

	return (posts?.data?.length ?? 0) > 0 ? (
		<section className='bg-cream'>
			<div className='container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 space-y-10 flex flex-col items-start'>
				<div className='w-full flex justify-between items-center'>
					<div className='flex justify-start'>
						<ScrollFloat
							animationDuration={1}
							ease='back.inOut(2)'
							scrollStart='center bottom+=20%'
							scrollEnd='bottom bottom-=40%'
							stagger={0.03}
							textClassName='hidden md:block text-2xl md:text-3xl lg:text-6xl font-bold text-primary'
						>
							Latest Articles
						</ScrollFloat>

						<h3 className='text-2xl md:hidden text-primary font-bold'>
							Latest Articles
						</h3>
					</div>

					{posts?.meta && posts?.meta?.pagination?.total > 3 && (
						<div data-aos='fade-up'>
							<Link
								href='/blog'
								className='group flex items-center relative overflow-hidden rounded-lg bg-primary text-sm md:text-base px-3 md:px-5 py-1.5 md:py-3 font-semibold text-white duration-300 before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-0 before:rounded-lg before:bg-primary before:mix-blend-difference before:duration-300 lg:hover:before:w-full'
							>
								<span className=''>View All</span>
								<PiArrowRightBold className='ml-2 group-hover:translate-x-1 transition-all duration-300' />
							</Link>
						</div>
					)}
				</div>

				<motion.div
					ref={ref}
					className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
					variants={parentVariants}
					initial='hidden'
					animate={isInView ? "visible" : "hidden"}
				>
					{isLoading
						? Array(3)
								.fill(0)
								.map((_, index) => <BlogCardLoader key={index} />)
						: posts?.data?.map((item, index) => (
								<BlogCard key={index} post={item} />
							))}
				</motion.div>
			</div>
		</section>
	) : (
		<></>
	);
};

export default LatestNews;
