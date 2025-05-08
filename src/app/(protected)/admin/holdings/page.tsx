import { redirect } from 'next/navigation';
import { hasPermission } from '@/lib/auth/auth';
import { getAllHoldings, getCashBalance } from '@/lib/api/db';
import AdminHoldingsList from '@/components/admin/holdings/AdminHoldingsList';
import CashBalanceForm from '@/components/admin/holdings/CashBalanceForm';
import { EmptyLinkButton, FilledLinkButton } from "@/components/Buttons";

export default async function AdminHoldingsPage() {
	const hasAccess = await hasPermission('HOLDINGS_WRITE');
	if (!hasAccess) redirect('/unauthorized');

	const holdings = await getAllHoldings();
	const cashBalance = await getCashBalance();

	const sortedHoldings = [...holdings].sort((a, b) =>
		(b.current_price * b.share_count) - (a.current_price * a.share_count)
	);

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Portfolio Management</h1>
					<div className="flex gap-3">
						<EmptyLinkButton href="/admin" text="Back to Admin" />
						<FilledLinkButton href="/admin/holdings/add" text="Add New Holding" />
					</div>
				</div>

				<div className="rounded-lg border border-solid border-white/[.145] p-6 mb-8">
					<h2 className="text-xl font-semibold mb-4">Cash Balance</h2>
					<CashBalanceForm initialCashBalance={cashBalance} />
				</div>

				<div className="rounded-lg border border-solid border-white/[.145] p-6">
					<h2 className="text-xl font-semibold mb-4">Current Holdings</h2>
					<AdminHoldingsList holdings={sortedHoldings} />
				</div>
			</div>
		</div>
	);
}