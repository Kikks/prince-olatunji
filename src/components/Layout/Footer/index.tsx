import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
	PiFacebookLogoFill,
	PiInstagramLogoFill,
	PiLinkedinLogoFill,
	PiTwitterLogoFill
} from "react-icons/pi";

// MIDDLE LINKS DATA
interface ProductType {
	id: number;
	section: string;
	link: string[];
}

const products: ProductType[] = [
	{
		id: 1,
		section: "Company",
		link: ["About us", "Blog", "Contact us"]
	},
	{
		id: 2,
		section: "Support",
		link: [
			"Help center",
			"Terms of service",
			"Legal",
			"Privacy Policy",
			"Status"
		]
	},
	{
		id: 3,
		section: "Contact",
		link: ["+234 708 746 1774", "info@aafoundation.ng"]
	}
];

const footer = () => {
	return (
		<div className='bg-primary' id='first-section'>
			<div className='container mx-auto lg:max-w-screen-xl md:max-w-screen-md pt-64 px-4'>
				<div className='grid grid-cols-1 gap-y-10 gap-x-16 sm:grid-cols-2 lg:grid-cols-12 xl:gap-x-8'>
					<div className='col-span-4'>
						<Link href='/'>
							<div className='size-12 rounded-xl bg-white flex items-center justify-center'>
								<span className='text-xl font-semibold text-primary'>AA</span>
							</div>
						</Link>
						<h3 className='text-white text-lg font-medium leading-9 mb-4 lg:mb-20 mt-5'>
							Driving real impact across Nigeria, Africa, and beyond with
							tri-sector expertise.
						</h3>
						<div className='flex gap-4'>
							<Link
								href='https://web.facebook.com/prince.olusojigcfr/'
								className='bg-white/20 rounded-full p-2 text-white hover:bg-cream hover:text-primary duration-300'
							>
								<PiFacebookLogoFill className='text-2xl inline-block' />
							</Link>
							<Link
								href='https://www.linkedin.com/in/olatunji-prince-olusoji-a3b807313/'
								className='bg-white/20 rounded-full p-2 text-white hover:bg-cream hover:text-primary duration-300'
							>
								<PiLinkedinLogoFill className='text-2xl inline-block' />
							</Link>
							<Link
								href='https://www.instagram.com/tfiregcfr/'
								className='bg-white/20 rounded-full p-2 text-white hover:bg-cream hover:text-primary duration-300'
							>
								<PiInstagramLogoFill className='text-2xl inline-block' />
							</Link>
							<Link
								href='https://x.com/olusojiolatunji?lang=en'
								className='bg-white/20 rounded-full p-2 text-white hover:bg-cream hover:text-primary duration-300'
							>
								<PiTwitterLogoFill className='text-2xl inline-block' />
							</Link>
						</div>
					</div>

					{products.map(product => (
						<div key={product.id} className='group relative col-span-2'>
							<p className='text-white text-xl font-semibold mb-9'>
								{product.section}
							</p>
							<ul>
								{product.link.map((link: string, index: number) => (
									<li key={index} className='mb-5'>
										<Link
											href='/'
											className='text-white/60 hover:text-white text-sm font-normal mb-6'
										>
											{link}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default footer;
