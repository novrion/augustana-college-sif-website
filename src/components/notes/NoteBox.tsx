'use client';

import { Note } from '@/lib/types/note';
import { useRouter } from 'next/navigation';

interface NoteBoxProps {
	note: Note;
}

export default function NoteBox({ note }: NoteBoxProps) {
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

	function createExcerpt(content: string, maxLength: number = 150): string {
		if (!content) return '';
		if (content.length <= maxLength) return content;
		const lastSpace = content.substring(0, maxLength).lastIndexOf(' ');
		return `${content.substring(0, lastSpace > 0 ? lastSpace : maxLength)}...`;
	}

	const handleClick = () => {
		router.push(`/notes/${note.id}`);
	};

	return (
		<div
			onClick={handleClick}
			className="rounded-lg border border-solid border-white/[.145] p-6 transition-colors hover:bg-[#1a1a1a] cursor-pointer"
		>
			<h2 className="text-xl font-semibold mb-2">
				{note.title}
			</h2>

			<div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-400 mb-3">
				<span className="mr-4">{formatDate(note.date)}</span>
				<span>{note.author}</span>
			</div>

			<p className="mb-4">{createExcerpt(note.content)}</p>
		</div>
	);
}