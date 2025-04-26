import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
	return (
		<nav className="w-full px-8 py-4 sm:px-20 flex items-center justify-between border-b border-black/[.08] dark:border-white/[.145] font-[family-name:var(--font-geist-mono)]">
			<Link href="/" className="font-bold text-xl flex items-center gap-2">
				<Image
					src="/logo.svg"
					alt="LOGO"
					width={32}
					height={32}
				/>
				Augustana College SIF
			</Link>

			<div className="hidden sm:flex items-center gap-8">
				<Link href="/portfolio" className="hover:underline">Portfolio</Link>
				<Link href="/calendar" className="hover:underline">Calendar</Link>
				<Link href="/newsletter" className="hover:underline">Newsletter</Link>
				<Link href="/contact" className="hover:underline">Contact</Link>
				<Link href="/about" className="hover:underline">About</Link>
			</div>

			<button className="sm:hidden">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<line x1="4" y1="12" x2="20" y2="12"></line>
					<line x1="4" y1="6" x2="20" y2="6"></line>
					<line x1="4" y1="18" x2="20" y2="18"></line>
				</svg>
			</button>
		</nav>
	);
}