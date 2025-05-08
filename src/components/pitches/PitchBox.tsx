'use client';

import { Pitch } from '@/lib/types/pitch';
import { formatDateForDisplay, formatCurrency } from '@/lib/utils';

export default function PitchBox({ pitch }: { pitch: Pitch }) {
	return (
		<div className="rounded-lg border border-solid border-white/[.145] p-6 transition-colors hover:bg-[#1a1a1a]">
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
		</div>
	);
}