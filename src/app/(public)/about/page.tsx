import { getAbout } from "@/api/about";
import BlogPostBody from "@/components/blog/BlogPostBody";
import ScrollFloat from "@/components/ui/ScrollFloat/ScrollFloat";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(
	{}: { params: { slug: string } },
	parent: ResolvingMetadata
): Promise<Metadata> {
	try {
		const about = await getAbout();

		// Use the parent metadata as fallback values
		const previousImages = (await parent).openGraph?.images || [];

		return {
			title: `${about?.data?.title} | Prince Olatunji Olusoji`,
			openGraph: {
				title: about?.data?.title,
				type: "profile",
				url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
				images: about?.data?.cover?.formats?.thumbnail?.url
					? [
							{
								url: about?.data?.cover?.formats?.thumbnail?.url,
								width: about?.data?.cover?.formats?.thumbnail?.width,
								height: about?.data?.cover?.formats?.thumbnail?.height,
								alt: about?.data?.title
							}
						]
					: previousImages,
				locale: "en_NG",
				siteName: "Prince Olatunji Olusoji"
			},
			twitter: {
				card: "summary_large_image",
				title: about?.data?.title,
				description: about?.data?.description,
				images: about?.data?.cover?.formats?.thumbnail?.url
					? [about?.data?.cover.formats.thumbnail.url]
					: []
			},
			alternates: {
				canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/about`
			}
		};
	} catch (error) {
		return {
			title: "About | Prince Olatunji Olusoji",
			description: "About Prince Olatunji Olusoji"
		};
	}
}

export default async function AboutPage() {
	try {
		const about = await getAbout();

		if (!about) {
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
										{about?.data?.title}
									</ScrollFloat>

									<h3 className='text-2xl md:hidden text-primary font-bold'>
										{about?.data?.title}
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
					<BlogPostBody blocks={about?.data?.blocks ?? []} />
				</section>
			</main>
		);
	} catch (error) {
		return notFound();
	}
}
