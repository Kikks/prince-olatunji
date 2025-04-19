import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";

import AOSWrapper from "@/utils/aos";

import Providers from "./providers";

import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import { ReactQueryClientProvider } from "@/clients/react-query/client";

const font = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${font.className}`}>
				<ReactQueryClientProvider>
					<Providers>
						<ThemeProvider
							attribute='class'
							enableSystem={true}
							defaultTheme='light'
						>
							<AOSWrapper>{children}</AOSWrapper>
						</ThemeProvider>
					</Providers>
				</ReactQueryClientProvider>
			</body>
		</html>
	);
}
