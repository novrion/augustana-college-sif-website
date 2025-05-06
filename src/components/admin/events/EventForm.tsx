'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '@/lib/types/event';
import Form from "@/components/Form";
import { FilledButton } from "@/components/Buttons";

interface EventFormProps {
	initialData?: Event;
	isEditing?: boolean;
}

export default function EventForm({
	initialData,
	isEditing = false
}: EventFormProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const getTodayLocalDate = () => {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	// Format date for the input field, ensuring it displays correctly
	const formatDateForInput = (dateString?: string) => {
		if (!dateString) return getTodayLocalDate();

		// Create a date object with noon UTC time to avoid timezone issues
		const date = new Date(`${dateString}T12:00:00Z`);
		const year = date.getUTCFullYear();
		const month = String(date.getUTCMonth() + 1).padStart(2, '0');
		const day = String(date.getUTCDate()).padStart(2, '0');

		return `${year}-${month}-${day}`;
	};

	const [formData, setFormData] = useState({
		title: initialData?.title || '',
		speaker_name: initialData?.speaker_name || '',
		role: initialData?.role || '',
		company: initialData?.company || '',
		date: formatDateForInput(initialData?.date),
		time: initialData?.time || '',
		location: initialData?.location || '',
		description: initialData?.description || '',
		contact: initialData?.contact || '',
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
				? `/api/admin/events/${initialData?.id}`
				: '/api/admin/events';

			const method = isEditing ? 'PUT' : 'POST';

			const response = await fetch(endpoint, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to save event');
			}

			setSuccess(isEditing ? 'Event updated successfully!' : 'Event created successfully!');

			// Redirect after a short delay
			setTimeout(() => {
				router.push('/admin/events');
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
			title={isEditing ? "Edit Event" : "Add Event"}
			error={error}
			success={success}
		>
			<div className="space-y-4">
				<div>
					<label htmlFor="title" className="block text-sm font-medium mb-1">
						Event Title (optional)
					</label>
					<input
						id="title"
						name="title"
						type="text"
						value={formData.title}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				<div>
					<label htmlFor="speaker_name" className="block text-sm font-medium mb-1">
						Speaker Name
					</label>
					<input
						id="speaker_name"
						name="speaker_name"
						type="text"
						value={formData.speaker_name}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						required
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label htmlFor="role" className="block text-sm font-medium mb-1">
							Speaker Role (optional)
						</label>
						<input
							id="role"
							name="role"
							type="text"
							value={formData.role}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label htmlFor="company" className="block text-sm font-medium mb-1">
							Company (optional)
						</label>
						<input
							id="company"
							name="company"
							type="text"
							value={formData.company}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
						<label htmlFor="time" className="block text-sm font-medium mb-1">
							Time
						</label>
						<input
							id="time"
							name="time"
							type="text"
							value={formData.time}
							onChange={handleChange}
							placeholder="e.g., 7:00 PM"
							className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							required
						/>
					</div>
				</div>

				<div>
					<label htmlFor="location" className="block text-sm font-medium mb-1">
						Location
					</label>
					<input
						id="location"
						name="location"
						type="text"
						value={formData.location}
						onChange={handleChange}
						placeholder="e.g., Gerber Center, Room 123"
						className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						required
					/>
				</div>

				<div>
					<label htmlFor="contact" className="block text-sm font-medium mb-1">
						Contact Information (optional)
					</label>
					<input
						id="contact"
						name="contact"
						type="text"
						value={formData.contact}
						onChange={handleChange}
						placeholder="e.g., Email or phone number for questions"
						className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				<div>
					<label htmlFor="description" className="block text-sm font-medium mb-1">
						Description
					</label>
					<textarea
						id="description"
						name="description"
						rows={5}
						value={formData.description}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent font-[family-name:var(--font-geist-sans)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						required
					/>
				</div>
			</div>

			<div className="flex justify-end mt-6">
				<FilledButton
					type="submit"
					text={isEditing ? 'Update Event' : 'Add Event'}
					loadingText="Saving..."
					isLoading={isSubmitting}
				/>
			</div>
		</Form>
	);
}