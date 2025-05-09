'use client';

import { useRouter } from 'next/navigation';
import { Pitch } from '@/lib/types/pitch';
import { formatDateForDisplay, formatCurrency } from '@/lib/utils';

export default function PitchBox({ pitch }: { pitch: Pitch }) {
	const router = useRouter();

	const handleClick = () => {
		router.push(`/pitches/${pitch.id}`);
	};

	return (
		<div
			onClick={handleClick}
			className="rounded-lg border border-solid border-white/[.145] p-6 transition-colors hover:bg-[#1a1a1a] cursor-pointer"
		>
			<div className="flex items-start justify-between mb-3">
				<h2 className="text-xl font-semibold flex-1">{pitch.title}</h2>
				<span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ml-4 ${pitch.is_buy
					? 'bg-green-900 text-green-200'
					: 'bg-red-900 text-red-200'
					}`}>
					{pitch.is_buy ? 'BUY' : 'SELL'}
				</span>
			</div>

			<div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-400 mb-3">
				<span className="mr-4">{formatDateForDisplay(pitch.date, { includeWeekday: true })}</span>
				<span className="mr-4">{pitch.analyst}</span>
				<span className="font-medium text-white">{pitch.symbol}</span>
			</div>

			<div className="flex items-center gap-6 mb-4">
				<div>
					<span className="text-sm text-gray-400">Company</span>
					<p className="font-medium">{pitch.company}</p>
				</div>
				<div>
					<span className="text-sm text-gray-400">Amount</span>
					<p className="font-medium">{formatCurrency(pitch.amount)}</p>
				</div>
			</div>

			{pitch.description && (
				<p className="text-sm text-gray-300 line-clamp-2">{pitch.description}</p>
			)}

			{pitch.attachments && pitch.attachments.length > 0 && (
				<div className="mt-4 flex items-center text-sm text-gray-400">
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
					</svg>
					{pitch.attachments.length} attachment{pitch.attachments.length !== 1 ? 's' : ''}
				</div>
			)}
		</div>
	);
}