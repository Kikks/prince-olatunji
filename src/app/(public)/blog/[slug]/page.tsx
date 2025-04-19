import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { format } from "date-fns";
import { Metadata, ResolvingMetadata } from "next";

import { Button } from "@/components/ui/button";
import { getArticleBySlug, getArticleSEODataBySlug } from "@/api/articles";
import BlogPostBody from "@/components/blog/BlogPostBody";

// Generate metadata for SEO
export async function generateMetadata(
	{ params }: { params: { slug: string } },
	parent: ResolvingMetadata
): Promise<Metadata> {
	try {
		// Fetch SEO data for this article
		const seoData = await getArticleSEODataBySlug(params.slug);

		// Use the parent metadata as fallback values
		const previousImages = (await parent).openGraph?.images || [];

		const formattedDate = seoData.publishedAt
			? format(new Date(seoData.publishedAt), "MMMM d, yyyy")
			: format(
					new Date(seoData.updatedAt ?? seoData.createdAt),
					"MMMM d, yyyy"
				);

		const modifiedTime = seoData.updatedAt
			? format(new Date(seoData.updatedAt), "MMMM d, yyyy")
			: format(new Date(seoData.createdAt), "MMMM d, yyyy");

		return {
			title: `${seoData.title} | Prince Olatunji Olusoji`,
			description: seoData.description,
			openGraph: {
				title: seoData.title,
				description: seoData.description,
				type: "article",
				publishedTime: formattedDate,
				modifiedTime: modifiedTime,
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${params.slug}`,
				images: seoData.cover?.formats?.thumbnail?.url
					? [
							{
								url: seoData.cover.formats.thumbnail.url,
								width: 1200,
								height: 630,
								alt: seoData.title
							}
						]
					: previousImages,
				locale: "en_NG",
				siteName: "Prince Olatunji Olusoji"
			},
			twitter: {
				card: "summary_large_image",
				title: seoData.title,
				description: seoData.description,
				images: seoData.cover?.formats?.thumbnail?.url
					? [seoData.cover.formats.thumbnail.url]
					: []
			},
			alternates: {
				canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${params.slug}`
			}
		};
	} catch (error) {
		return {
			title: "Article Not Found",
			description: "The requested article could not be found."
		};
	}
}

// Generate static paths for all blog posts (optional but recommended for SEO)
export async function generateStaticParams() {
	// This would fetch all blog post slugs
	// const articles = await getAllArticleSlugs();
	// return articles.map(article => ({ slug: article.slug }));

	// For demonstration, we'll return an empty array
	// In production, you'd want to populate this
	return [];
}

export default async function BlogPostPage({
	params
}: {
	params: { slug: string };
}) {
	// Server-side data fetching
	try {
		const post = await getArticleBySlug(params.slug);

		if (!post) {
			return notFound();
		}

		// Format date for display
		const formattedDate = post?.publishedAt
			? format(new Date(post.publishedAt), "MMMM dd, yyyy")
			: format(new Date(post.createdAt), "MMMM dd, yyyy");

		return (
			<main className='container mx-auto px-4 md:px-6 py-24 md:py-24'>
				<article className='max-w-4xl mx-auto py-8 px-4 space-y-10'>
					<Link href='/blog'>
						<Button variant='link' className='gap-2'>
							<ArrowLeftIcon className='w-4 h-4' />
							<span>All Articles</span>
						</Button>
					</Link>

					<div className='w-full flex flex-col gap-4'>
						<h1 className='text-3xl md:text-4xl lg:text-5xl font-bold'>
							{post.title}
						</h1>

						<div className='flex flex-wrap items-center gap-4 text-sm'>
							{post.category && (
								<Link
									href={`/blog?category=${post.category.id}`}
									className='px-2 py-1 rounded-lg bg-primary'
								>
									<p className='text-xs text-white capitalize'>
										{post.category.name}
									</p>
								</Link>
							)}

							{formattedDate && (
								<span className='text-gray-600 dark:text-gray-400'>
									Published on {formattedDate}
								</span>
							)}
						</div>
					</div>

					{post.cover?.formats?.large?.url && (
						<section className='mx-auto grid w-full max-w-[900px] place-items-center !p-0'>
							<figure className='relative aspect-video w-full'>
								<Image
									src={post.cover.formats.large.url}
									alt={post.title}
									fill
									className='h-full w-full object-cover duration-500 group-hover:scale-110'
									quality={100}
									priority
								/>
							</figure>
						</section>
					)}

					<BlogPostBody
						blocks={post?.blocks ?? []}
						className='max-w-[1200px]'
					/>
				</article>
			</main>
		);
	} catch (error) {
		return notFound();
	}
}
