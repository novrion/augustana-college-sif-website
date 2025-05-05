import { redirect } from 'next/navigation';
import Link from 'next/link';
import { hasAdminAccess } from '@/lib/auth/auth';
import NoteForm from '@/components/admin/notes/NoteForm';

export default async function AddNotePage() {
	const hasAccess = await hasAdminAccess();
	if (!hasAccess) { redirect('/unauthorized'); }

	return (
		<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">
						Add Meeting Minutes
					</h1>

					<Link
						href="/admin/notes"
						className="rounded-full border border-solid border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#1a1a1a] font-medium text-sm h-10 px-4"
					>
						Back to Minutes Management
					</Link>
				</div>

				<NoteForm />
			</div>
		</div>
	);
}