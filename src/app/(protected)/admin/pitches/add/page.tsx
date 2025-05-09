import { redirect } from 'next/navigation';
import { hasPermission } from '@/lib/auth/auth';
import PitchForm from '@/components/admin/pitches/PitchForm';
import { StockQueryForm } from '@/components/admin/common';
import { EmptyLinkButton } from "@/components/Buttons";

export default async function AddPitchPage() {
	const hasAccess = await hasPermission('HOLDINGS_WRITE');
	if (!hasAccess) redirect('/unauthorized');

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Add Stock Pitch</h1>
					<EmptyLinkButton href="/admin/pitches" text="Back to Pitch Management" />
				</div>
				<PitchForm />
				<StockQueryForm title="Stock Symbol Lookup" />
			</div>
		</div>
	);
}