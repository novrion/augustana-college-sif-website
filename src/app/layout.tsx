import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { TickerProvider } from "@/contexts/TickerContext";
import { ProtectedClientComponent } from "@/components/auth/ProtectClient";
import Navbar from "@/components/layout/Navbar";
import Ticker from "@/components/layout/Ticker";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = {
	title: "Augie SIF",
	description: "Augustana College Student Investment Fund Website",
	icons: {
		icon: '/logo.svg',
		apple: '/logo.svg',
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<AuthProvider>
					<Navbar />
					<ProtectedClientComponent>
						<TickerProvider>
							<Ticker />
						</TickerProvider>
					</ProtectedClientComponent>
					{children}
					<Footer />
				</AuthProvider>
			</body>
		</html>
	);
}