"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";

import { Article } from "@/types";
import FormattedText from "../ui/FormattedText";

interface BlogCardProps {
	post: Article;
}

const childVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: "easeOut"
		}
	}
};

export function BlogCardLoader() {
	return (
		<motion.div
			className='w-full flex flex-col gap-4'
			variants={childVariants}
			initial='hidden'
			animate='visible'
			whileHover={{
				scale: 1.05,
				transition: {
					duration: 0.3,
					ease: "easeOut"
				}
			}}
		>
			<figure className='w-full aspect-video overflow-hidden'>
				<Skeleton className='w-full h-full' />
			</figure>

			<div className='w-full flex flex-col gap-2'>
				<Skeleton className='w-full h-6' />
				<div className='flex flex-col'>
					<Skeleton className='w-full h-3' />
					<Skeleton className='w-full h-3' />
					<div className='w-3/4'>
						<Skeleton className='w-full h-3' />
					</div>
				</div>
			</div>
		</motion.div>
	);
}

export function BlogCard({ post }: BlogCardProps) {
	const { title, slug, cover, publishedAt, category } = post;

	const formattedDate = publishedAt
		? format(new Date(publishedAt), "MMM d, yyyy")
		: format(new Date(), "MMM d, yyyy");

	return (
		<Link href={`/blog/${slug}`} className='group w-full'>
			<motion.div
				key={post.id}
				className='w-full flex flex-col gap-4'
				variants={childVariants}
				initial='hidden'
				animate='visible'
				whileHover={{
					scale: 1.05,
					transition: {
						duration: 0.3,
						ease: "easeOut"
					}
				}}
			>
				<figure className='relative w-full aspect-video overflow-hidden rounded-lg'>
					{cover?.formats?.small?.url ? (
						<Image
							src={cover?.formats?.small?.url ?? ""}
							alt={title}
							className='w-full h-full object-cover'
							loading='lazy'
							layout='fill'
						/>
					) : (
						<div className='bg-gray-200 dark:bg-gray-800 w-full h-full flex items-center justify-center'>
							<span className='text-gray-400'>No image</span>
						</div>
					)}
				</figure>

				<div className='w-full flex flex-col gap-2'>
					<h3 className='text-xl font-bold text-primary'>{title}</h3>
					<div className='flex items-center gap-3'>
						<div className='px-2 py-1 rounded-lg bg-primary'>
							<p className='text-xs text-white capitalize'>{category?.name}</p>
						</div>
						<p className='text-sm text-gray-400'>{formattedDate}</p>
					</div>

					<div className='w-full blog-card-preview'>
						<FormattedText
							className='text-sm text-gray-500 line-clamp-3'
							text={
								post?.blocks?.[0]?.__component == "shared.rich-text"
									? post?.blocks?.[0]?.body
									: ""
							}
						/>
					</div>
				</div>
			</motion.div>
		</Link>
	);
}
