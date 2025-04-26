"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

import ScrollFloat from "@/components/ui/ScrollFloat/ScrollFloat";
import SpotlightCard from "@/components/ui/SpotlightCard/SpotlightCard";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

const testimonialData = [
	{
		image: "https://github.com/shadcn.png",
		name: "Comrade Ogbe Collins",
		profession: "Politician",
		detail:
			"Asiwaju is a man who has impacted me a lot. He was a true guide for me in my early days in politics and today I have made a lot of progress."
	},
	{
		image: "https://github.com/shadcn.png",
		name: "Comrade Iyah Daniel",
		profession: "Politician",
		detail:
			"Asiwaju is a go getter that also carries everyone along, this stands out for me about him."
	},
	{
		image: "https://github.com/shadcn.png",
		name: "Hon. Eke Uchenna",
		profession: "Politician",
		detail:
			"A very good man, a giver, a leader. My life has not remained the same since I met him. I thank God for making our paths cross."
	},
	{
		image: "https://github.com/shadcn.png",
		name: "Hon. Eru Elohor",
		profession: "Politician",
		detail:
			"Pince Olatunji is a man that has made himself so accessible. He responds promptly on matters that pertains the youth and is a worthy example for the upcoming generation. He has a heart for humanity and does not want to see anyone suffer."
	}
];

const parentVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			delay: 0.3,
			duration: 0.5,
			staggerChildren: 0.2
		}
	}
};

const childVariants = {
	hidden: { opacity: 0, y: 30 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.7, ease: "easeOut" }
	}
};

const Testimonial = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, amount: 0.2 });

	return (
		<section className='bg-cream'>
			<div className='relative px-6 lg:px-8 flex-1 w-full flex items-center justify-center'>
				<div className='container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 space-y-10 flex flex-col items-start'>
					<div className='w-full flex justify-center'>
						<ScrollFloat
							animationDuration={1}
							ease='back.inOut(2)'
							scrollStart='center bottom+=20%'
							scrollEnd='bottom bottom-=40%'
							stagger={0.03}
							textClassName='hidden md:block text-2xl md:text-3xl lg:text-5xl font-bold text-primary'
						>
							What People Say About Asiwaju
						</ScrollFloat>

						<h3 className='text-2xl md:hidden text-primary font-bold'>
							What People Say About Asiwaju
						</h3>
					</div>

					<motion.div
						ref={ref}
						variants={parentVariants}
						initial='hidden'
						animate={isInView ? "visible" : "hidden"}
						className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
					>
						{testimonialData.map((item, index) => (
							<motion.div
								variants={childVariants}
								key={index}
								className='w-full self-stretch'
							>
								<SpotlightCard
									key={index}
									className='h-full bg-white border-primary/30 rounded-xl'
									spotlightColor='rgba(2, 71, 84, 0.4)'
								>
									<div className='h-full flex flex-col items-center gap-4'>
										<div className='w-full flex-1'>
											<p className='text-sm text-gray-500 text-center'>
												{item.detail}
											</p>
										</div>

										<div className='w-full flex space-x-3 items-center justify-center'>
											{/* <Avatar className='w-10 h-10'>
												<AvatarImage src={item.image} />
												<AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
											</Avatar> */}

											<div className='flex flex-col items-center text-center'>
												<h3 className='text-base font-bold'>{item.name}</h3>
												<p className='text-xs text-gray-500'>
													{item.profession}
												</p>
											</div>
										</div>
									</div>
								</SpotlightCard>
							</motion.div>
						))}
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export default Testimonial;
