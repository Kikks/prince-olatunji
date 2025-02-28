import * as React from "react";

import { NavigationMenuLink } from "@/components/ui/Navigation";

import { cn } from "@/utils/cn";

const ListItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a">
>(({ className, title, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-primary hover:bg-cream focus:bg-primary focus:text-white",
						className
					)}
					{...props}
				>
					<div className='text-sm font-medium leading-none'>{title}</div>
				</a>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";

export default ListItem;
