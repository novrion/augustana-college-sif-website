'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AboutSection } from '@/lib/types/about';
import Form from "@/components/Form";
import { FilledButton } from "@/components/Buttons";

interface AboutSectionFormProps {
	initialData?: AboutSection;
	maxOrderIndex?: number;
	isEditing?: boolean;
}

export default function AboutSectionForm({
	initialData,
	isEditing = false
}: AboutSectionFormProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const [formData, setFormData] = useState({
		title: initialData?.title || '',
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
				? `/api/admin/about/${initialData?.id}`
				: '/api/admin/about';

			const method = isEditing ? 'PUT' : 'POST';

			const response = await fetch(endpoint, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to save about section');
			}

			setSuccess(isEditing ? 'Section updated successfully!' : 'Section created successfully!');

			// Redirect after a short delay
			setTimeout(() => {
				router.push('/admin/about');
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
			title={isEditing ? "Edit Section" : "Add New Section"}
			error={error}
			success={success}
		>
			<div className="space-y-4">
				{/* Title Field */}
				<div>
					<label htmlFor="title" className="block text-sm font-medium mb-1">
						Section Title
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

				{/* Content Field */}
				<div>
					<label htmlFor="content" className="block text-sm font-medium mb-1">
						Content
					</label>
					<textarea
						id="content"
						name="content"
						rows={10}
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
					text={isEditing ? 'Update Section' : 'Add Section'}
					loadingText="Saving..."
					isLoading={isSubmitting}
				/>
			</div>
		</Form>
	);
}