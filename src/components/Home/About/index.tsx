import React from "react";
import Link from "next/link";
import { PiArrowRightBold } from "react-icons/pi";

import ScrollFloat from "@/components/ui/ScrollFloat/ScrollFloat";

const colors = ["rgb(252, 245, 239)", "#fff", "#f9cc92"];

const About = () => {
	return (
		<section className='relative w-full flex'>
			<div className='relative px-6 lg:px-8 flex-1 w-full flex items-center justify-center'>
				<div className='container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 space-y-10 flex flex-col items-start'>
					<ScrollFloat
						animationDuration={1}
						ease='back.inOut(2)'
						scrollStart='center bottom+=20%'
						scrollEnd='bottom bottom-=40%'
						stagger={0.03}
						textClassName='text-7xl font-bold text-primary'
					>
						About
					</ScrollFloat>

					<div className='w-full max-w-xl space-y-5'>
						<p data-aos='fade-up'>
							Prince Olatunji Olusoji hails from Ayere in Ijumu Local Government
							Area of Kogi State, Nigeria.
						</p>

						<p data-aos='fade-up'>
							Prince Olatunji was raised with strong values of integrity, hard
							work, and love for humanity instilled by his parents.
						</p>

						<p data-aos='fade-up'>
							Driven by a desire to address human challenges, particularly in
							engineering, Prince Olatunji pursued higher education after
							completing his primary and secondary schooling. He earned a
							Bachelor of Science degree in Mechanical Engineering from the
							prestigious University of Benin. During his time at university, he
							was elected to various leadership roles within his department,
							which honed his leadership skills.
						</p>

						<p data-aos='fade-up'>
							Following his graduation, Prince Olatunji enrolled in the one year
							national volunteer scheme (known in Nigeria as the National Youth
							Service Corps) and was posted to Delta, where he served his
							father’s land meritoriously on volunteer basis.
						</p>
					</div>

					<div data-aos='fade-up'>
						<Link
							href='/about'
							className='group flex items-center relative overflow-hidden rounded-lg bg-primary px-5 py-3 font-semibold text-white duration-300 before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-0 before:rounded-lg before:bg-primary before:mix-blend-difference before:duration-300 lg:hover:before:w-full'
						>
							<span className=''>Read More</span>
							<PiArrowRightBold className='ml-2 group-hover:translate-x-1 transition-all duration-300' />
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};

export default About;
