import RotatingText from "@/components/ui/RotatingText/RotatingText";
import Image from "next/image";

const Banner = () => {
	return (
		<section className='bg-cream w-full h-[calc(100vh-100px)] max-h-[900px] flex'>
			<div className='relative px-6 lg:px-8 flex-1 w-full flex items-center justify-center'>
				<div className='container flex items-center justify-between gap-10 mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4'>
					<div className='flex flex-col space-y-5 items-start max-w-2xl'>
						<div data-aos='fade-up' data-aos-delay='100'>
							<RotatingText
								texts={["Business Leader", "Nation Builder", "Philantropist"]}
								mainClassName='text-white overflow-hidden justify-center text-7xl font-bold px-2.5 sm:px-3 md:px-5 bg-primary overflow-hidden py-1 sm:py-2 md:py-3 rounded-xl'
								staggerFrom={"last"}
								initial={{ y: "100%" }}
								animate={{ y: 0 }}
								exit={{ y: "-120%" }}
								staggerDuration={0.025}
								splitLevelClassName='overflow-hidden pb-0.5 sm:pb-1 md:pb-1'
								transition={{ type: "spring", damping: 30, stiffness: 400 }}
								rotationInterval={5000}
							/>
						</div>

						<p
							data-aos='fade-up'
							data-aos-delay='300'
							className='text-lg leading-loose text-gray-700'
						>
							I am committed to leveraging my tri-sectoral wealth of experience
							to make real impact in the lives of individuals and communities
							across Nigeria, Africa and the world.
						</p>
					</div>

					<div className='flex items-center justify-center flex-1'>
						<figure
							data-aos='zoom-in'
							data-aos-delay='500'
							className='relative w-full aspect-[320/400] rounded-xl overflow-hidden'
						>
							<Image
								src='https://res.cloudinary.com/kikks/image/upload/c_fill/c_scale,w_800/v1740736256/prince-olatunji/hngsfyp4r7unokc6rreo.jpg'
								alt='hero'
								objectFit='cover'
								className='object-cover'
								layout='fill'
							/>
						</figure>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Banner;
