'use client';

import { Newsletter } from '@/lib/types/newsletter';
import { useRouter } from 'next/navigation';

interface NewsletterBoxProps {
	newsletter: Newsletter;
}

export default function NewsletterBox({ newsletter }: NewsletterBoxProps) {
	const router = useRouter();

	const formatDate = (dateString: string): string => {
		if (!dateString) return 'Date not available';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	function createExcerpt(content: string, maxLength: number = 150): string {
		if (!content) return '';
		if (content.length <= maxLength) return content;
		const lastSpace = content.substring(0, maxLength).lastIndexOf(' ');
		return `${content.substring(0, lastSpace > 0 ? lastSpace : maxLength)}...`;
	}

	const handleClick = () => {
		router.push(`/newsletter/${newsletter.id}`);
	};

	return (
		<div
			onClick={handleClick}
			className="rounded-lg border border-solid border-white/[.145] p-6 transition-colors hover:bg-[#1a1a1a] cursor-pointer"
		>
			<h2 className="text-xl font-semibold mb-2">
				{newsletter.title}
			</h2>

			<div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-400 mb-3">
				<span className="mr-4">{formatDate(newsletter.date)}</span>
				<span>{newsletter.author}</span>
			</div>

			<p className="mb-4">{createExcerpt(newsletter.content)}</p>
		</div>
	);
}