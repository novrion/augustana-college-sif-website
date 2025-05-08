import { redirect } from 'next/navigation';
import { hasPermission } from '@/lib/auth/auth';
import { getNoteById } from '@/lib/api/db';
import NoteForm from '@/components/admin/notes/NoteForm';
import { EmptyLinkButton } from '@/components/Buttons';

export default async function EditNotePage({ params }: { params: Promise<{ id: string }> }) {
	const hasAccess = await hasPermission('SECRETARY');
	if (!hasAccess) { redirect('/unauthorized'); }

	try {
		const { id } = await params;
		const note = await getNoteById(id);
		if (!note) { redirect('/admin/notes'); }

		return (
			<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
				<div className="max-w-4xl mx-auto">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">
							Edit: {note.title}
						</h1>

						<EmptyLinkButton
							href="/admin/notes"
							text="Back to Minutes Management"
						/>
					</div>

					<NoteForm
						initialData={note}
						isEditing={true}
					/>
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error loading note:', error);
		redirect('/admin/notes');
	}
}