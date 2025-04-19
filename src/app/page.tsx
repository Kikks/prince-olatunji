import Hero from "@/components/Home/Hero";
import Testimonial from "@/components/Home/Testimonial";
import Newsletter from "@/components/Home/Newsletter";
import { Metadata } from "next";
import About from "@/components/Home/About";
import InTheNews from "@/components/Home/InTheNews";
import LatestNews from "@/components/Home/LatestNews";
import Gallery from "@/components/Home/Gallery";
import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
	title: "Prince Olatunji Olusoji"
};

export default function Home() {
	return (
		<main>
			<Header />
			<Hero />
			<About />
			<Testimonial />
			<InTheNews />
			<LatestNews />
			<Gallery />
			<Newsletter />
			<Footer />
			<ScrollToTop />
		</main>
	);
}
