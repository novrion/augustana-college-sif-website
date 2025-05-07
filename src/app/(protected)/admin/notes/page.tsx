import { redirect } from 'next/navigation';
import { hasPermission } from '@/lib/auth/auth';
import { getAllNotes } from '@/lib/api/db';
import AdminNotesList from '@/components/admin/notes/AdminNotesList';
import { Note } from '@/lib/types/note';
import { EmptyLinkButton, FilledLinkButton } from "@/components/Buttons";

export default async function AdminNotesPage() {
	const hasAccess = await hasPermission('SECRETARY');
	if (!hasAccess) { redirect('/unauthorized'); }

	const notes: Note[] = await getAllNotes();
	const sortedNotes = [...notes].sort((a, b) =>
		new Date(b.date).getTime() - new Date(a.date).getTime()
	);

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-6xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Meeting Minutes Management</h1>

					<div className="flex gap-3">
						<EmptyLinkButton href="/admin" text="Back to Admin" />
						<FilledLinkButton href="/admin/notes/add" text="Add New Minutes" />
					</div>
				</div>

				<div className="rounded-lg border border-solid border-white/[.145] p-6">
					<h2 className="text-xl font-semibold mb-4">Meeting Minutes</h2>
					<AdminNotesList notes={sortedNotes} />
				</div>
			</div>
		</div>
	);
}