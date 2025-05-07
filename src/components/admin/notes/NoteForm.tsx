'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Note } from '@/lib/types/note';
import Form from "@/components/Form";
import { FilledButton } from "@/components/Buttons";

interface NoteFormProps {
	initialData?: Note;
	isEditing?: boolean;
}

export default function NoteForm({
	initialData,
	isEditing = false
}: NoteFormProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const formatDateForInput = (dateString?: string) => {
		if (!dateString) return new Date().toISOString().split('T')[0];

		const date = new Date(`${dateString}T12:00:00Z`);
		const year = date.getUTCFullYear();
		const month = String(date.getUTCMonth() + 1).padStart(2, '0');
		const day = String(date.getUTCDate()).padStart(2, '0');

		return `${year}-${month}-${day}`;
	};

	const [formData, setFormData] = useState({
		title: initialData?.title || '',
		date: formatDateForInput(initialData?.date),
		author: initialData?.author || '',
		content: initialData?.content || '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError('');
		setSuccess('');

		try {
			const endpoint = isEditing
				? `/api/admin/notes/${initialData?.id}`
				: '/api/admin/notes';

			const method = isEditing ? 'PUT' : 'POST';

			const response = await fetch(endpoint, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to save meeting minutes');
			}

			setSuccess(isEditing ? 'Meeting minutes updated successfully!' : 'Meeting minutes created successfully!');

			// Redirect after a short delay
			setTimeout(() => {
				router.push('/admin/notes');
				router.refresh();
			}, 1000);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form
			onSubmit={handleSubmit}
			title={isEditing ? "Edit Meeting Minutes" : "Add Meeting Minutes"}
			error={error}
			success={success}
		>
			<div className="space-y-4">
				<div>
					<label htmlFor="title" className="block text-sm font-medium mb-1">
						Title
					</label>
					<input
						id="title"
						name="title"
						type="text"
						value={formData.title}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						required
					/>
				</div>

				<div>
					<label htmlFor="author" className="block text-sm font-medium mb-1">
						Author
					</label>
					<input
						id="author"
						name="author"
						type="text"
						value={formData.author}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						required
					/>
				</div>

				<div>
					<label htmlFor="date" className="block text-sm font-medium mb-1">
						Date
					</label>
					<input
						id="date"
						name="date"
						type="date"
						value={formData.date}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						required
					/>
				</div>

				<div>
					<label htmlFor="content" className="block text-sm font-medium mb-1">
						Content
					</label>
					<textarea
						id="content"
						name="content"
						rows={15}
						value={formData.content}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent font-[family-name:var(--font-geist-sans)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						required
					/>
				</div>
			</div>

			<div className="flex justify-end mt-6">
				<FilledButton
					type="submit"
					text={isEditing ? 'Update Minutes' : 'Add Minutes'}
					loadingText="Saving..."
					isLoading={isSubmitting}
				/>
			</div>
		</Form>
	);
}