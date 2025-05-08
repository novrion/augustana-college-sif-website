import { redirect } from 'next/navigation';
import { hasPermission } from '@/lib/auth/auth';
import { getPitchById } from '@/lib/api/db';
import PitchForm from '@/components/admin/pitches/PitchForm';
import { EmptyLinkButton } from "@/components/Buttons";

export default async function EditPitchPage({ params }: { params: Promise<{ id: string }> }) {
	const hasAccess = await hasPermission('HOLDINGS_WRITE');
	if (!hasAccess) redirect('/unauthorized');

	try {
		const { id } = await params;
		const pitch = await getPitchById(id);
		if (!pitch) redirect('/admin/pitches');

		return (
			<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
				<div className="max-w-4xl mx-auto">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">
							Edit: {pitch.title}
						</h1>
						<EmptyLinkButton href="/admin/pitches" text="Back to Pitch Management" />
					</div>
					<PitchForm initialData={pitch} isEditing />
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error loading pitch:', error);
		redirect('/admin/pitches');
	}
}