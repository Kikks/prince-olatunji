import Masonry from "@/components/ui/Masonry/Masonry";
import ScrollFloat from "@/components/ui/ScrollFloat/ScrollFloat";
import { galleryImages } from "@/utils/data";
import Link from "next/link";
import { PiArrowRightBold } from "react-icons/pi";

const data = galleryImages.map((item, index) => ({
	id: index + 1,
	image: item.url,
	height: item?.height ?? 400,
	width: item?.width ?? 400
}));

const Gallery = () => {
	return (
		<section className='bg-cream'>
			<div className='container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 space-y-10 flex flex-col items-start'>
				<div className='w-full flex justify-center'>
					<ScrollFloat
						animationDuration={1}
						ease='back.inOut(2)'
						scrollStart='center bottom+=20%'
						scrollEnd='bottom bottom-=40%'
						stagger={0.03}
						textClassName='text-7xl font-bold text-primary'
					>
						Gallery
					</ScrollFloat>
				</div>

				<div data-aos='zoom-in' className='w-full'>
					<Masonry data={data} />
				</div>

				<div className='w-full flex justify-center'>
					<div data-aos='fade-up'>
						<Link
							href='/about'
							className='group flex items-center relative overflow-hidden rounded-lg bg-primary text-sm md:text-base px-3 md:px-5 py-1.5 md:py-3 font-semibold text-white duration-300 before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-0 before:rounded-lg before:bg-primary before:mix-blend-difference before:duration-300 lg:hover:before:w-full'
						>
							<span className=''>View All</span>
							<PiArrowRightBold className='ml-2 group-hover:translate-x-1 transition-all duration-300' />
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Gallery;
