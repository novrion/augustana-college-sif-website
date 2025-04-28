'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MeetingMinuteForm({ initialData = null }) {
	const isEditing = !!initialData;

	const [formData, setFormData] = useState({
		title: initialData?.title || '',
		date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
		author: initialData?.author || '',
		content: initialData?.content || '',
	});

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		// Validate form
		if (!formData.title || !formData.date || !formData.author || !formData.content) {
			setError('Please fill in all required fields');
			setIsLoading(false);
			return;
		}

		try {
			const url = isEditing
				? `/api/admin/meeting-minutes/update`
				: `/api/admin/meeting-minutes/add`;

			const body = isEditing
				? { ...formData, id: initialData.id }
				: formData;

			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});

			const contentType = response.headers.get("content-type");
			if (!contentType || !contentType.includes("application/json")) {
				throw new Error(`Server responded with non-JSON content: ${await response.text()}`);
			}

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'add'} meeting minutes`);
			}

			// Redirect back to meeting minutes page
			router.push('/meeting-minutes');
			router.refresh();
		} catch (error) {
			console.error("Submission error:", error);
			setError(error.message || 'An unexpected error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6">
			<h2 className="text-xl font-semibold mb-6">
				{isEditing ? 'Edit Meeting Minutes' : 'Add New Meeting Minutes'}
			</h2>

			{error && (
				<div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label className="block text-sm font-medium mb-1" htmlFor="title">
						Title *
					</label>
					<input
						id="title"
						name="title"
						type="text"
						value={formData.title}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="date">
							Meeting Date *
						</label>
						<input
							id="date"
							name="date"
							type="date"
							value={formData.date}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="author">
							Author *
						</label>
						<input
							id="author"
							name="author"
							type="text"
							value={formData.author}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1" htmlFor="content">
						Meeting Notes *
					</label>
					<textarea
						id="content"
						name="content"
						rows="12"
						value={formData.content}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-[family-name:var(--font-geist-mono)]"
						required
					></textarea>
				</div>

				<div className="flex justify-end space-x-4">
					<button
						type="button"
						onClick={() => router.push('/meeting-minutes')}
						className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isLoading}
						className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4 disabled:opacity-50"
					>
						{isLoading ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Meeting Minutes')}
					</button>
				</div>
			</form>
		</div>
	);
}