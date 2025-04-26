import { Metadata, ResolvingMetadata } from "next";
import { getGallery } from "@/api/gallery";
import { notFound } from "next/navigation";
import ScrollFloat from "@/components/ui/ScrollFloat/ScrollFloat";
import Masonry from "@/components/ui/Masonry/Masonry";
import BlogPostBody from "@/components/blog/BlogPostBody";

export async function generateMetadata(
	{}: { params: { slug: string } },
	parent: ResolvingMetadata
): Promise<Metadata> {
	try {
		const gallery = await getGallery();

		// Use the parent metadata as fallback values
		const previousImages = (await parent).openGraph?.images || [];

		return {
			title: "Gallery | Prince Olatunji Olusoji",
			openGraph: {
				title: "Gallery",
				type: "profile",
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/gallery`,
				images: gallery?.data?.masonry?.[0]?.formats?.thumbnail?.url
					? [
							{
								url: gallery?.data?.masonry[0]?.formats?.thumbnail?.url,
								width: gallery?.data?.masonry[0]?.formats?.thumbnail?.width,
								height: gallery?.data?.masonry[0]?.formats?.thumbnail?.height,
								alt: gallery?.data?.masonry[0]?.name
							}
						]
					: previousImages,
				locale: "en_NG",
				siteName: "Prince Olatunji Olusoji"
			},
			twitter: {
				card: "summary_large_image",
				title: "Gallery",
				description: "Gallery",
				images: gallery?.data?.masonry?.[0]?.formats?.thumbnail?.url
					? [gallery?.data?.masonry[0]?.formats.thumbnail.url]
					: []
			},
			alternates: {
				canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/gallery`
			}
		};
	} catch (error) {
		return {
			title: "Gallery | Prince Olatunji Olusoji",
			description: "Gallery"
		};
	}
}

export default async function GalleryPage() {
	try {
		const gallery = await getGallery();

		const masonryData = (gallery?.data?.masonry ?? [])?.map(item => ({
			id: item?.id ?? "",
			height: item?.height ?? 0,
			width: item?.width ?? 0,
			image:
				item?.formats?.medium?.url ??
				(item?.formats?.large?.url || item?.url || ""),
			highResImage: item?.formats?.large?.url || item?.url || ""
		}));

		if (!gallery) {
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
										Gallery
									</ScrollFloat>

									<h3 className='text-2xl md:hidden text-primary font-bold'>
										Gallery
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
					<BlogPostBody blocks={gallery?.data?.blocks ?? []} />

					<Masonry data={masonryData} />
				</section>
			</main>
		);
	} catch (error) {
		return notFound();
	}
}
