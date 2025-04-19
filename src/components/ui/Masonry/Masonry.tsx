"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTransition, a } from "@react-spring/web";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";

interface MasonryItem {
	id: string | number;
	height: number;
	image: string;
	width: number;
	highResImage?: string; // Optional high-res image for fullscreen view
}

interface GridItem extends MasonryItem {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface MasonryProps {
	data: MasonryItem[];
}

const Masonry: React.FC<MasonryProps> = ({ data }) => {
	const [columns, setColumns] = useState<number>(2);
	const [selectedImage, setSelectedImage] = useState<number | null>(null);
	const isOpen = selectedImage !== null;

	// Handle keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isOpen) return;

			if (e.key === "ArrowRight" && selectedImage !== null) {
				setSelectedImage(prev =>
					prev === null ? null : (prev + 1) % data.length
				);
			} else if (e.key === "ArrowLeft" && selectedImage !== null) {
				setSelectedImage(prev =>
					prev === null ? null : (prev - 1 + data.length) % data.length
				);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [data.length, selectedImage, isOpen]);

	useEffect(() => {
		const updateColumns = () => {
			if (window.matchMedia("(min-width: 1500px)").matches) {
				setColumns(4);
			} else if (window.matchMedia("(min-width: 1000px)").matches) {
				setColumns(3);
			} else if (window.matchMedia("(min-width: 600px)").matches) {
				setColumns(2);
			} else {
				setColumns(1);
			}
		};

		updateColumns();
		window.addEventListener("resize", updateColumns);
		return () => window.removeEventListener("resize", updateColumns);
	}, []);

	const ref = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState<number>(0);

	useEffect(() => {
		const handleResize = () => {
			if (ref.current) {
				setWidth(ref.current.offsetWidth);
			}
		};

		handleResize(); // Set initial width
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const [heights, gridItems] = useMemo<[number[], GridItem[]]>(() => {
		const heights = new Array(columns).fill(0);
		const gridItems = data.map(child => {
			const column = heights.indexOf(Math.min(...heights));
			const columnWidth = width / columns;
			// Calculate height based on aspect ratio
			const aspectRatio = child.width / child.height;
			const calculatedHeight = columnWidth / aspectRatio;

			const x = columnWidth * column;
			const y = heights[column];

			// Update the height array with the new position
			heights[column] += calculatedHeight + 16; // Adding gap between items

			return {
				...child,
				x,
				y,
				width: columnWidth,
				height: calculatedHeight
			};
		});
		return [heights, gridItems];
	}, [columns, data, width]);

	const transitions = useTransition<
		GridItem,
		{ x: number; y: number; width: number; height: number; opacity: number }
	>(gridItems, {
		keys: item => item.id,
		from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
		enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
		update: ({ x, y, width, height }) => ({ x, y, width, height }),
		leave: { height: 0, opacity: 0 },
		config: { mass: 5, tension: 500, friction: 100 },
		trail: 25
	});

	return (
		<>
			<div
				ref={ref}
				className='masonry'
				style={{ height: Math.max(...heights) }}
			>
				{transitions((style, item, _, index) => (
					<a.div
						key={item.id}
						style={{
							...style,
							padding: "8px"
						}}
						onClick={() => setSelectedImage(index)}
						className='cursor-pointer'
					>
						<div
							style={{
								width: "100%",
								height: "100%",
								borderRadius: "8px",
								overflow: "hidden",
								boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
							}}
						>
							<img
								src={item.image}
								alt=''
								style={{
									width: "100%",
									height: "100%",
									objectFit: "cover",
									display: "block"
								}}
							/>
						</div>
					</a.div>
				))}
			</div>

			<Dialog
				open={isOpen}
				onOpenChange={open => {
					if (!open) setSelectedImage(null);
				}}
			>
				<DialogOverlay className='bg-white/95' />
				<DialogContent className='max-w-none w-screen h-screen flex items-center justify-center bg-white border-none shadow-none p-0 sm:p-8 overflow-hidden'>
					<div className='relative w-full h-full flex items-center justify-center'>
						<motion.button
							className='absolute left-4 z-50 text-white bg-primary/80 w-12 h-12 rounded-full flex items-center justify-center shadow-lg'
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={e => {
								e.stopPropagation();
								setSelectedImage(prev =>
									prev === null ? null : (prev - 1 + data.length) % data.length
								);
							}}
						>
							<PiCaretLeftBold className='text-2xl text-white' />
						</motion.button>

						<motion.button
							className='absolute right-4 z-50 text-white bg-primary/80 w-12 h-12 rounded-full flex items-center justify-center shadow-lg'
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={e => {
								e.stopPropagation();
								setSelectedImage(prev =>
									prev === null ? null : (prev + 1) % data.length
								);
							}}
						>
							<PiCaretRightBold className='text-2xl text-white' />
						</motion.button>

						<AnimatePresence mode='wait'>
							{selectedImage !== null && (
								<motion.div
									key={selectedImage}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ type: "spring", damping: 25, stiffness: 300 }}
									className='w-full h-full flex items-center justify-center'
								>
									<img
										src={
											data[selectedImage].highResImage ||
											data[selectedImage].image
										}
										alt=''
										className='max-w-full max-h-[90vh] object-contain rounded-lg shadow-lg'
									/>
								</motion.div>
							)}
						</AnimatePresence>

						<div className='absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3'>
							<motion.div
								className='text-gray-700 font-medium px-3 py-1 bg-white/80 rounded-full text-sm shadow-sm backdrop-blur-sm'
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
							>
								{selectedImage !== null ? selectedImage + 1 : 0} / {data.length}
							</motion.div>

							<div className='flex justify-center gap-2'>
								{data.map((_, idx) => (
									<motion.button
										key={idx}
										className={`w-2.5 h-2.5 rounded-full transition-all ${selectedImage === idx ? "bg-gray-800 scale-125" : "bg-gray-400 hover:bg-gray-600"}`}
										whileHover={{ scale: 1.2 }}
										whileTap={{ scale: 0.9 }}
										onClick={() => setSelectedImage(idx)}
									/>
								))}
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default Masonry;
