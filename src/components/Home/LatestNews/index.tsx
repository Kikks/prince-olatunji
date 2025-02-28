"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

import ScrollFloat from "@/components/ui/ScrollFloat/ScrollFloat";
import { PiArrowRightBold } from "react-icons/pi";
import Link from "next/link";

const demoItems = [
	{
		link: "https://leadership.ng/prince-olusoji-honoured-with-turaki-gamji-of-arewa-kingdom/",
		text: "Turaki Gamji of Arewa Kingdom",
		image: "https://picsum.photos/600/400?random=1",
		title: "Prince Olatunji Honoured with Turaki Gamji of Arewa Kingdom",
		content:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem beatae deserunt unde veniam officia eaque, iusto ratione esse alias consequatur nulla, eius dicta? Odit eligendi repudiandae autem nisi laborum, mollitia asperiores inventore dolore distinctio facilis sit, consectetur quasi quaerat sunt tempore nihil sint tenetur eveniet minima ullam maiores! Odio, fuga!",
		date: "2024-01-01"
	},
	{
		link: "https://leadership.ng/prince-olusoji-honoured-with-turaki-gamji-of-arewa-kingdom/",
		text: "Turaki Gamji of Arewa Kingdom",
		image: "https://picsum.photos/600/400?random=2",
		title: "Prince Olatunji Honoured with Turaki Gamji of Arewa Kingdom",
		content:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem beatae deserunt unde veniam officia eaque, iusto ratione esse alias consequatur nulla, eius dicta? Odit eligendi repudiandae autem nisi laborum, mollitia asperiores inventore dolore distinctio facilis sit, consectetur quasi quaerat sunt tempore nihil sint tenetur eveniet minima ullam maiores! Odio, fuga!",
		date: "2024-01-01"
	},
	{
		link: "https://leadership.ng/prince-olusoji-honoured-with-turaki-gamji-of-arewa-kingdom/",
		text: "Turaki Gamji of Arewa Kingdom",
		image: "https://picsum.photos/600/400?random=3",
		title: "Prince Olatunji Honoured with Turaki Gamji of Arewa Kingdom",
		content:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem beatae deserunt unde veniam officia eaque, iusto ratione esse alias consequatur nulla, eius dicta? Odit eligendi repudiandae autem nisi laborum, mollitia asperiores inventore dolore distinctio facilis sit, consectetur quasi quaerat sunt tempore nihil sint tenetur eveniet minima ullam maiores! Odio, fuga!",
		date: "2024-01-01"
	}
];

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

const LatestNews = () => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, amount: 0.2 });

	return (
		<section className='bg-cream'>
			<div className='container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 space-y-10 flex flex-col items-start'>
				<div className='w-full flex justify-between items-center'>
					<ScrollFloat
						animationDuration={1}
						ease='back.inOut(2)'
						scrollStart='center bottom+=20%'
						scrollEnd='bottom bottom-=40%'
						stagger={0.03}
						textClassName='text-7xl font-bold text-primary'
					>
						Latest News
					</ScrollFloat>

					<div data-aos='fade-up'>
						<Link
							href='/about'
							className='group flex items-center relative overflow-hidden rounded-lg bg-primary px-5 py-3 font-semibold text-white duration-300 before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-0 before:rounded-lg before:bg-primary before:mix-blend-difference before:duration-300 lg:hover:before:w-full'
						>
							<span className=''>View All</span>
							<PiArrowRightBold className='ml-2 group-hover:translate-x-1 transition-all duration-300' />
						</Link>
					</div>
				</div>

				<motion.div
					ref={ref}
					className='w-full grid grid-cols-3 gap-5'
					variants={parentVariants}
					initial='hidden'
					animate={isInView ? "visible" : "hidden"}
				>
					{demoItems.map((item, index) => (
						<motion.a
							key={index}
							href={item.link}
							target='_blank'
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
								<img
									src={item.image}
									alt={item.text}
									className='w-full h-full object-cover'
								/>
							</figure>

							<div className='w-full flex flex-col gap-2'>
								<h3 className='text-2xl font-bold'>{item.title}</h3>
								<p className='text-sm text-gray-500'>{item.date}</p>
								<p className='text-sm text-gray-500 line-clamp-3'>
									{item.content}
								</p>
							</div>
						</motion.a>
					))}
				</motion.div>
			</div>
		</section>
	);
};

export default LatestNews;
