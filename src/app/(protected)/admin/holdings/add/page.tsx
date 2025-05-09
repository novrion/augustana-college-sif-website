import { redirect } from 'next/navigation';
import { hasPermission } from '@/lib/auth/auth';
import HoldingForm from '@/components/admin/holdings/HoldingForm';
import { StockQueryForm } from '@/components/admin/common';
import { EmptyLinkButton } from "@/components/Buttons";

export default async function AddHoldingPage() {
	const hasAccess = await hasPermission('HOLDINGS_WRITE');
	if (!hasAccess) redirect('/unauthorized');

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Add New Holding</h1>
					<EmptyLinkButton href="/admin/holdings" text="Back to Portfolio" />
				</div>

				<HoldingForm />
				<StockQueryForm />
			</div>
		</div>
	);
}