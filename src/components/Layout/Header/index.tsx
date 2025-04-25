"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuIcon, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { headerData } from "../Header/Navigation/menuData";
import Logo from "./Logo";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle
} from "@/components/ui/Navigation";
import ListItem from "./Navigation/ListItem";
import { cn } from "@/utils/cn";
import queryKeys from "@/lib/query-keys";
import { getNavigationMenus } from "@/api/navigation-menus";
import Skeleton from "react-loading-skeleton";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetClose
} from "@/components/ui/sheet";

const Header: React.FC = () => {
	const pathname = usePathname();
	const [sticky, setSticky] = useState(false);

	const { data: navigationMenus, isLoading } = useQuery({
		queryKey: [queryKeys.getNavigationMenus],
		queryFn: () => getNavigationMenus()
	});

	const handleScroll = () => {
		setSticky(window.scrollY >= 10);
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<header
			className={`fixed top-0 z-40 w-full transition-all duration-300 ${
				sticky ? " shadow-lg bg-white py-1" : "shadow-none py-4"
			}`}
		>
			<div className='lg:py-0 py-0.5'>
				<div className='container mx-auto lg:max-w-screen-xl md:max-w-screen-md flex items-center justify-between px-4 space-x-10'>
					<Logo />

					{isLoading ? (
						<nav className='hidden lg:flex flex-grow items-center gap-8 justify-start'>
							{Array(5)
								.fill("")
								.map((_, index) => (
									<div className='h-7 w-16' key={index}>
										<Skeleton className='h-full w-full' />
									</div>
								))}
						</nav>
					) : (
						<nav className='hidden lg:flex flex-grow items-center gap-8 justify-start'>
							<NavigationMenu>
								<NavigationMenuList>
									{(navigationMenus ?? [])?.map((item, index) =>
										(item?.children ?? [])?.length > 0 ? (
											<NavigationMenuItem key={index}>
												<NavigationMenuTrigger className='bg-transparent'>
													{item.label}
												</NavigationMenuTrigger>
												<NavigationMenuContent>
													<ul className='grid w-[250px] gap-1 p-2 bg-white'>
														{item.children?.map(subItem => (
															<ListItem
																key={subItem.label}
																title={subItem.label}
																href={
																	subItem?.page?.slug
																		? `/${subItem?.page?.slug}`
																		: item?.custom_url_path
																}
															/>
														))}
													</ul>
												</NavigationMenuContent>
											</NavigationMenuItem>
										) : item?.custom_url_path ? (
											<NavigationMenuItem
												key={index}
												className='bg-transparent'
											>
												<Link
													href={item.custom_url_path}
													legacyBehavior
													passHref
												>
													<NavigationMenuLink
														className={cn(
															navigationMenuTriggerStyle(),
															pathname === item.custom_url_path &&
																"underline underline-offset-4",
															"bg-transparent"
														)}
													>
														{item.label}
													</NavigationMenuLink>
												</Link>
											</NavigationMenuItem>
										) : (
											<span key={index}>{item.label}</span>
										)
									)}
								</NavigationMenuList>
							</NavigationMenu>
						</nav>
					)}

					{/* Mobile Menu */}
					<Sheet>
						<SheetTrigger asChild>
							<button className='size-10 hover:bg-primary/10 rounded-sm grid place-items-center lg:hidden'>
								<MenuIcon />
							</button>
						</SheetTrigger>
						<SheetContent side='right' className='py-12 px-6'>
							<div className='space-y-6'>
								{!isLoading &&
									(navigationMenus ?? [])?.map((item, index) => (
										<div key={index} className='space-y-3'>
											{item?.custom_url_path ? (
												<SheetClose asChild>
													<Link
														href={item.custom_url_path}
														className={cn(
															"block text-lg font-medium hover:text-primary transition-colors",
															pathname === item.custom_url_path &&
																"text-primary font-semibold"
														)}
													>
														{item.label}
													</Link>
												</SheetClose>
											) : (
												<div className='text-lg font-medium'>{item.label}</div>
											)}

											{(item?.children ?? [])?.length > 0 && (
												<div className='pl-4 border-l-2 border-gray-200 space-y-2'>
													{item.children?.map(subItem => (
														<SheetClose key={subItem.label} asChild>
															<Link
																href={
																	subItem?.page?.slug
																		? `/${subItem?.page?.slug}`
																		: (item?.custom_url_path ?? "#")
																}
																className='block text-base hover:text-primary transition-colors'
															>
																{subItem.label}
															</Link>
														</SheetClose>
													))}
												</div>
											)}
										</div>
									))}
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
};

export default Header;
