import Link from 'next/link';

export default function Box({ title, description, link, linkText }) {
	return (
		<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6 hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors">
			<h3 className="text-xl font-semibold mb-3">
				{title}
			</h3>
			<p className="mb-4">
				{description}
			</p>
			<Link
				className="text-blue-500 hover:underline font-medium"
				href={link}
			>
				{linkText} →
			</Link>
		</div>
	);
}