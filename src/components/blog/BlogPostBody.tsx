import { PiQuotesFill } from "react-icons/pi";

import { Block } from "@/types";
import FormattedText from "@/components/ui/FormattedText";
import { cn } from "@/lib/utils";

interface BlogPostBodyProps {
	blocks: Block[];
	className?: string;
}

const BlogPostBody = ({ blocks, className }: BlogPostBodyProps) => {
	return (
		<div className={cn("mx-auto w-full px-5 space-y-10", className)}>
			{blocks.map((block, index) => (
				<div key={index} className='w-full'>
					{block.__component === "shared.rich-text" && (
						<FormattedText text={block?.body ?? ""} />
					)}

					{block.__component === "shared.quote" && (
						<div className='relative w-full bg-gradient-to-tr from-primary to-primary/70 p-10 rounded-3xl shadow-2xl shadow-primary/40 overflow-hidden'>
							<div className='absolute top-[-25%] left-[5%] w-48 h-48 bg-white rounded-[30%] blur-sm opacity-20 rotate-45 z-10' />
							<div className='absolute bottom-[-25%] right-[5%] w-48 h-48 bg-white rounded-[30%] blur-sm opacity-20 rotate-45 z-10' />

							<div className='relative z-20 space-y-10'>
								<PiQuotesFill className='text-white text-7xl z-20' />
								<h3 className='text-white text-2xl font-bold z-20 max-w-[35ch]'>
									{block?.body}
								</h3>

								<div className='flex flex-col items-start z-20 space-y-2'>
									<div className='w-10 h-1 bg-white rounded' />
									<p className='text-white z-20'>{block?.title}</p>
								</div>
							</div>
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default BlogPostBody;
