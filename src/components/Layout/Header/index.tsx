"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MenuIcon } from "lucide-react";
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

const Header: React.FC = () => {
	const pathname = usePathname();
	const [navbarOpen, setNavbarOpen] = useState(false);
	const [sticky, setSticky] = useState(false);

	const mobileMenuRef = useRef<HTMLDivElement>(null);

	const { data: navigationMenus, isLoading } = useQuery({
		queryKey: [queryKeys.getNavigationMenus],
		queryFn: () => getNavigationMenus()
	});

	const handleScroll = () => {
		setSticky(window.scrollY >= 10);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (
			mobileMenuRef.current &&
			!mobileMenuRef.current.contains(event.target as Node) &&
			navbarOpen
		) {
			setNavbarOpen(false);
		}
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			window.removeEventListener("scroll", handleScroll);
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [navbarOpen]);

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

					<button className='size-10 hover:bg-primary/10 rounded-sm grid place-items-center lg:hidden'>
						<MenuIcon />
					</button>
				</div>

				<div
					ref={mobileMenuRef}
					className={`lg:hidden fixed top-0 right-0 h-full w-full bg-darkmode shadow-lg transform transition-transform duration-300 max-w-xs ${
						navbarOpen ? "translate-x-0" : "translate-x-full"
					} z-50`}
				>
					<div className='flex items-center justify-between p-4'>
						<h2 className='text-lg font-bold text-midnight_text dark:text-midnight_text'>
							<Logo />
						</h2>

						{/*  */}
						<button
							onClick={() => setNavbarOpen(false)}
							className="bg-[url('/images/closed.svg')] bg-no-repeat bg-contain w-5 h-5 absolute top-0 right-0 mr-8 mt-8 dark:invert"
							aria-label='Close menu Modal'
						></button>
					</div>
					<nav className='flex flex-col items-start p-4'>
						<NavigationMenu>
							<NavigationMenuList>
								{headerData.map((item, index) => (
									<ListItem key={index} title={item.label} href={item.href} />
								))}
							</NavigationMenuList>
						</NavigationMenu>
					</nav>
				</div>
			</div>
		</header>
	);
};

export default Header;
