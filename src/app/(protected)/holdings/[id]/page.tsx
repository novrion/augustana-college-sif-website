import { redirect } from 'next/navigation';
import { getHoldingById, getAllHoldings } from '@/lib/api/db';
import { getSession } from '@/lib/auth/auth';
import HoldingDetails from '@/components/holdings/HoldingDetails';
import { EmptyLinkButton } from '@/components/Buttons';

export default async function HoldingDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const session = await getSession();
	if (!session) { redirect('/login?callbackUrl=/holdings'); }

	try {
		const { id } = await params;
		if (!id) redirect('/holdings');

		const holding = await getHoldingById(id);
		if (!holding) redirect('/holdings');

		const holdings = await getAllHoldings();
		const totalEquityValue = holdings.reduce((sum, h) =>
			sum + (h.current_price * h.share_count), 0
		);

		return (
			<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
				<div className="max-w-6xl mx-auto">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">
							{holding.company_name} ({holding.ticker})
						</h1>

						<EmptyLinkButton
							href="/holdings"
							text="Back to Portfolio"
						/>
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