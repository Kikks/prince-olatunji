"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface SearchBarProps {
	onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
	const [inputValue, setInputValue] = useState("");

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			onSearch(inputValue);
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [inputValue, onSearch]);

	return (
		<div className='relative'>
			<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
				<Search className='w-5 h-5 text-gray-500 dark:text-gray-400' />
			</div>
			<Input
				type='search'
				placeholder='Search blog posts...'
				className='pl-10'
				value={inputValue}
				onChange={e => setInputValue(e.target.value)}
			/>
		</div>
	);
}
