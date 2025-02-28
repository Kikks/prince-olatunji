import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: "class",
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}"
	],
	theme: {
		extend: {
			boxShadow: {
				mentorShadow: "0px 4px 20px rgba(110, 127, 185, 0.1)"
			},
			inset: {
				"54%": "54%"
			},
			colors: {
				primary: "#024754",
				cream: "#FCF5EF",
				success: "#6b9f36",
				orange: "#f9cd92"
			},
			backgroundImage: {
				"banner-image": "url('/images/banner/background.png')",
				newsletter: "url('/images/newsletter/hands.svg')"
			}
		}
	},
	plugins: []
};
export default config;
