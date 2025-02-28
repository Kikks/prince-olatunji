import React from "react";
import FlowingMenu from "@/components/ui/FlowingMenu/FlowingMenu";
import ScrollFloat from "@/components/ui/ScrollFloat/ScrollFloat";
import Image from "next/image";

const demoItems = [
	{
		link: "https://leadership.ng/philanthropist-olusoji-launches-free-tutorials-for-jamb-candidates-in-kogi/",
		text: "Free Jamb Tutorials",
		image: "https://picsum.photos/600/400?random=1"
	},
	{
		link: "https://leadership.ng/prince-olusoji-honoured-with-turaki-gamji-of-arewa-kingdom/",
		text: "Turaki Gamji of Arewa Kingdom",
		image: "https://picsum.photos/600/400?random=2"
	},
	{
		link: "https://kogireports.com/prince-olusoji-donates-cash-gift-items-to-ayere-community/",
		text: "Ayere Community",
		image: "https://picsum.photos/600/400?random=3"
	},
	{
		link: "https://www.proofoundation.com/",
		text: "Prince Olatunji Olusoji Foundation",
		image: "https://picsum.photos/600/400?random=4"
	}
];

const InTheNews = () => {
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
						Asiwaju Makes The News
					</ScrollFloat>
				</div>
			</div>

			<div className='w-full bg-primary'>
				<div
					data-aos='zoom-in'
					className='hidden md:flex container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 space-y-10 flex-col items-start py-40'
				>
					<FlowingMenu items={demoItems} />
				</div>

				<div className='md:hidden'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-5'>
						{demoItems.map((item, index) => (
							<div
								key={index}
								className='bg-white p-4 rounded-lg flex items-center space-x-2'
							>
								<figure className='relative w-16 h-9 rounded-lg overflow-hidden'>
									<Image
										src={item.image}
										alt={item.text}
										layout='fill'
										className='w-full h-auto rounded-lg'
										objectFit='cover'
									/>
								</figure>

								<h3 className='text-lg font-bold'>{item.text}</h3>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default InTheNews;
