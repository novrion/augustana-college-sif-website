'use client';

import { useRouter } from 'next/navigation';
import { Newsletter } from '@/lib/types/newsletter';
import { formatDateForDisplay } from '@/lib/utils';

interface NewsletterBoxProps {
	newsletter: Newsletter;
}

export default function NewsletterBox({ newsletter }: NewsletterBoxProps) {
	const router = useRouter();

	const excerpt = newsletter.content.length > 150
		? `${newsletter.content.substring(0, newsletter.content.substring(0, 150).lastIndexOf(' ') || 150)}...`
		: newsletter.content;

	const hasAttachments = newsletter.attachments && newsletter.attachments.length > 0;
	const attachmentsCount = newsletter.attachments?.length || 0;

	return (
		<div
			onClick={() => router.push(`/newsletter/${newsletter.id}`)}
			className="rounded-lg border border-solid border-white/[.145] p-6 transition-colors hover:bg-[#1a1a1a] cursor-pointer"
		>
			<h2 className="text-xl font-semibold mb-2">
				{newsletter.title}
			</h2>

			<div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-400 mb-3">
				<span className="mr-4">{formatDateForDisplay(newsletter.date, { includeWeekday: true })}</span>
				<span>{newsletter.author}</span>
				{hasAttachments && (
					<span className="mt-1 sm:mt-0 sm:ml-4 inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-900 text-blue-200">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
						</svg>
						{attachmentsCount} attachment{attachmentsCount !== 1 ? 's' : ''}
					</span>
				)}
			</div>

			<p className="mb-4">{excerpt}</p>
		</div>
	);
}