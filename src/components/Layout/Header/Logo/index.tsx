import Image from "next/image";

const Logo: React.FC = () => {
	return (
		<figure className='relative size-[50px] md:size-[70px] lg:size-[80px] aspect-square overflow-hidden'>
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
