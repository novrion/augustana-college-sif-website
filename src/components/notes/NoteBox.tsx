'use client';

import { useRouter } from 'next/navigation';
import { Note } from '@/lib/types/note';

export default function NoteBox({ note }: { note: Note }) {
	const router = useRouter();

	const formatDate = (dateString: string): string => {
		if (!dateString) return 'Date not available';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	const excerpt = note.content.length > 150
		? `${note.content.substring(0, note.content.substring(0, 150).lastIndexOf(' ') || 150)}...`
		: note.content;

	return (
		<div
			onClick={() => router.push(`/notes/${note.id}`)}
			className="rounded-lg border border-solid border-white/[.145] p-6 transition-colors hover:bg-[#1a1a1a] cursor-pointer"
		>
			<h2 className="text-xl font-semibold mb-2">{note.title}</h2>
			<div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-400 mb-3">
				<span className="mr-4">{formatDate(note.date)}</span>
				<span>{note.author}</span>
			</div>
			<p className="mb-4">{excerpt}</p>
		</div>
	);
}