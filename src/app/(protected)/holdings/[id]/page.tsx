import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getHoldingById, getAllHoldings } from '@/lib/api/db';
import { getSession } from '@/lib/auth/auth';
import HoldingDetails from '@/components/holdings/HoldingDetails';

export default async function HoldingDetailPage({ params }: { params: { id: string } }) {
	const session = await getSession();
	if (!session) { redirect('/login?callbackUrl=/holdings'); }

	try {
		const id = params.id;
		const holding = await getHoldingById(id);
		if (!holding) { redirect('/holdings'); }

		const holdings = await getAllHoldings();
		const totalEquityValue = holdings.reduce((sum, holding) => {
			return sum + (holding.current_price * holding.share_count);
		}, 0);

		return (
			<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
				<div className="max-w-6xl mx-auto">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">
							{holding.company_name} ({holding.ticker})
						</h1>

						<Link
							href="/holdings"
							className="rounded-full border border-solid border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
						>
							Back to Portfolio
						</Link>
					</div>

					<HoldingDetails
						holding={holding}
						totalEquityValue={totalEquityValue}
					/>
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error loading holding:', error);
		redirect('/holdings');
	}
}