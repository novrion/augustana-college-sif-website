import { redirect } from 'next/navigation';
import { hasHoldingsWriteAccess } from '@/lib/auth/auth';
import { getHoldingById } from '@/lib/api/db';
import HoldingForm from '@/components/admin/holdings/HoldingForm';
import { EmptyLinkButton } from "@/components/Buttons";

export default async function EditHoldingPage({
	params
}: {
	params: Promise<{ id: string }>
}) {
	const hasAccess = await hasHoldingsWriteAccess();
	if (!hasAccess) { redirect('/unauthorized'); }

	try {
		const { id } = await params;
		const holding = await getHoldingById(id);
		if (!holding) { redirect('/admin/holdings'); }

		return (
			<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
				<div className="max-w-6xl mx-auto">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">
							Edit Holding: {holding.company_name} ({holding.ticker})
						</h1>

						<EmptyLinkButton
							href="/admin/holdings"
							text="Back to Portfolio"
						/>
					</div>

					<HoldingForm initialData={holding} />
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error loading holding:', error);
		redirect('/admin/holdings');
	}
}