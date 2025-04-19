import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Metadata, ResolvingMetadata } from "next";

import { getPageBySlug, getPageSEODataBySlug } from "@/api/pages";
import BlogPostBody from "@/components/blog/BlogPostBody";
import ScrollFloat from "@/components/ui/ScrollFloat/ScrollFloat";

// Generate metadata for SEO
export async function generateMetadata(
	{ params }: { params: { slug: string } },
	parent: ResolvingMetadata
): Promise<Metadata> {
	try {
		// Fetch SEO data for this article
		const seoData = await getPageSEODataBySlug(params.slug);

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
			openGraph: {
				title: seoData.title,
				publishedTime: formattedDate,
				modifiedTime: modifiedTime,
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/${params.slug}`,
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
				images: seoData.cover?.formats?.thumbnail?.url
					? [seoData.cover.formats.thumbnail.url]
					: []
			},
			alternates: {
				canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/${params.slug}`
			}
		};
	} catch (error) {
		return {
			title: "Page Not Found",
			description: "The requested page could not be found."
		};
	}
}

export default async function Page({ params }: { params: { slug: string } }) {
	try {
		const page = await getPageBySlug(params.slug);

		if (!page) {
			return notFound();
		}

		return (
			<main className='w-full'>
				<section className='bg-cream w-full flex overflow-hidden pt-40 pb-16 md:pt-48 md:pb-20'>
					<div className='relative px-6 lg:px-8 flex-1 w-full flex items-center justify-center'>
						<div className='container w-full flex items-center justify-between gap-10 mx-auto px-4'>
							<div data-aos='fade-up' data-aos-delay='100' className='w-full'>
								<div className='flex justify-start w-full'>
									<ScrollFloat
										animationDuration={1}
										ease='back.inOut(2)'
										scrollStart='center bottom+=20%'
										scrollEnd='bottom bottom-=40%'
										stagger={0.03}
										textClassName='text-2xl md:text-3xl lg:text-6xl font-bold text-primary w-full'
										containerClassName='w-full hidden md:block'
									>
										{page?.title}
									</ScrollFloat>

									<h3 className='text-2xl md:hidden text-primary font-bold'>
										{page?.title}
									</h3>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section
					data-aos='fade-up'
					data-aos-delay='100'
					className='container mx-auto px-4 md:px-6 py-24 md:py-32 space-y-10'
				>
					<BlogPostBody blocks={page?.blocks ?? []} />
				</section>
			</main>
		);
	} catch (error) {
		return notFound();
	}
}
