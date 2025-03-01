import Image from "next/image";

const Logo: React.FC = () => {
	return (
		<figure className='relative h-[50px] md:h-[70px] lg:h-[80px] aspect-[1397/1231] overflow-hidden'>
			<Image
				src='/images/logo.png'
				alt='logo'
				layout='fill'
				className='object-cover'
			/>
		</figure>
	);
};

export default Logo;
