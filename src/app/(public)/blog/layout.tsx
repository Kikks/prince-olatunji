import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Blog | Prince Olatunji Olusoji"
};

export default function BlogLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
