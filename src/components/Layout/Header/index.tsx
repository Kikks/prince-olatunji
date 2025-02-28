"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

const Header: React.FC = () => {
	const pathname = usePathname();
	const [navbarOpen, setNavbarOpen] = useState(false);
	const [sticky, setSticky] = useState(false);

	const mobileMenuRef = useRef<HTMLDivElement>(null);

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
				sticky ? " shadow-lg bg-white py-4" : "shadow-none py-8"
			}`}
		>
			<div className='lg:py-0 py-2'>
				<div className='container mx-auto lg:max-w-screen-xl md:max-w-screen-md flex items-center justify-between px-4 space-x-10'>
					<Logo />
					<nav className='hidden lg:flex flex-grow items-center gap-8 justify-start'>
						<NavigationMenu>
							<NavigationMenuList>
								{headerData.map((item, index) =>
									item?.href ? (
										<NavigationMenuItem>
											<Link href={item.href} legacyBehavior passHref>
												<NavigationMenuLink
													className={cn(
														pathname === item.href &&
															"underline underline-offset-4",
														navigationMenuTriggerStyle()
													)}
												>
													{item.label}
												</NavigationMenuLink>
											</Link>
										</NavigationMenuItem>
									) : item?.submenu ? (
										<NavigationMenuItem>
											<NavigationMenuTrigger>
												{item.label}
											</NavigationMenuTrigger>
											<NavigationMenuContent>
												<ul className='grid w-[250px] gap-1 p-2 bg-white'>
													{item.submenu.map(subItem => (
														<ListItem
															key={subItem.label}
															title={subItem.label}
															href={subItem.href}
														/>
													))}
												</ul>
											</NavigationMenuContent>
										</NavigationMenuItem>
									) : (
										<span key={index}>{item.label}</span>
									)
								)}
							</NavigationMenuList>
						</NavigationMenu>
					</nav>
				</div>
				{navbarOpen && (
					<div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40' />
				)}
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
