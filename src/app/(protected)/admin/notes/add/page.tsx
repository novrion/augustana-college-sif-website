import { redirect } from 'next/navigation';
import { hasPermission } from '@/lib/auth/auth';
import NoteForm from '@/components/admin/notes/NoteForm';
import { EmptyLinkButton } from '@/components/Buttons';

export default async function AddNotePage() {
	const hasAccess = await hasPermission('SECRETARY');
	if (!hasAccess) { redirect('/unauthorized'); }

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">
						Add Meeting Minutes
					</h1>

					<EmptyLinkButton
						href="/admin/notes"
						text="Back to Minutes Management"
					/>
				</div>

				<NoteForm />
			</div>
		</div>
	);
}