import { redirect } from 'next/navigation';
import { getNoteById } from '@/lib/api/db';
import { EmptyLinkButton } from '@/components/Buttons';
import { formatDateForDisplay } from '@/lib/utils';

export default async function NoteDetail({ params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		if (!id) redirect('/notes');
		const note = await getNoteById(id);
		if (!note) redirect('/notes');

		return (
			<div className="min-h-screen p-8 sm:p-20">
				<div className="max-w-4xl mx-auto">
					<div className="flex justify-between items-center mb-6 font-[family-name:var(--font-geist-mono)]">
						<h1 className="text-3xl font-bold">
							Meeting Minutes
						</h1>

						<EmptyLinkButton
							text={"Back to All Minutes"}
							href={"/notes"}
						/>
					</div>

					<div className="rounded-lg border border-solid border-white/[.145] p-6">
						<h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-geist-mono)]">
							{note.title}
						</h2>

						<div className="flex flex-col mb-6 text-sm text-gray-400 font-[family-name:var(--font-geist-mono)]">
							<span className="mb-1">{formatDateForDisplay(note.date, { includeWeekday: true })}</span>
							<span>{note.author}</span>
						</div>

						<div className="prose prose-sm max-w-none mb-8 font-[family-name:var(--font-geist-sans)]">
							{note.content.split('\n').map((paragraph, index) => (
								<p key={index} className="mb-4">{paragraph}</p>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error loading note:', error);
		redirect('/notes');
	}
}