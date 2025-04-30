// components/admin/SpeakerForm.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SpeakerForm({ initialData = null }) {
	const isEditing = !!initialData;
	const router = useRouter();

	const today = new Date();
	const todayFormatted = today.toISOString().split('T')[0];

	const [formData, setFormData] = useState({
		speaker_name: initialData?.speaker_name || '',
		role: initialData?.role || '',
		company: initialData?.company || '',
		title: initialData?.title || '',
		event_date: initialData?.event_date || todayFormatted,
		description: initialData?.description || '',
		location: initialData?.location || '',
		time: initialData?.time || '',
		contact: initialData?.contact || ''
	});

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		// Validate form
		const requiredFields = ['speaker_name', 'event_date', 'description', 'location', 'time'];
		for (const field of requiredFields) {
			if (!formData[field]) {
				setError(`Please fill in the field: ${field.replace('_', ' ')}`);
				setIsLoading(false);
				return;
			}
		}

		try {
			const url = isEditing
				? `/api/admin/speakers/update`
				: `/api/admin/speakers/add`;

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

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'add'} speaker`);
			}

			// Redirect back to speakers admin page
			router.push('/admin/speakers');
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
				{isEditing ? 'Edit Speaker Event' : 'Add New Speaker Event'}
			</h2>

			{error && (
				<div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Speaker Information */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="speaker_name">
							Speaker Name *
						</label>
						<input
							id="speaker_name"
							name="speaker_name"
							type="text"
							value={formData.speaker_name}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="role">
							Speaker Role <span className="text-gray-500">(Optional)</span>
						</label>
						<input
							id="role"
							name="role"
							type="text"
							value={formData.role}
							onChange={handleChange}
							placeholder="e.g., Senior Portfolio Manager"
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="company">
							Company/Organization <span className="text-gray-500">(Optional)</span>
						</label>
						<input
							id="company"
							name="company"
							type="text"
							value={formData.company}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="title">
							Event Title <span className="text-gray-500">(Optional)</span>
						</label>
						<input
							id="title"
							name="title"
							type="text"
							value={formData.title}
							onChange={handleChange}
							placeholder="e.g., Value Investing in a Changing Market"
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>

				{/* Event Details */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="event_date">
							Event Date *
						</label>
						<input
							id="event_date"
							name="event_date"
							type="date"
							value={formData.event_date}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="time">
							Event Time *
						</label>
						<input
							id="time"
							name="time"
							type="text"
							value={formData.time}
							onChange={handleChange}
							placeholder="e.g., 4:00 PM - 5:30 PM"
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="location">
							Location *
						</label>
						<input
							id="location"
							name="location"
							type="text"
							value={formData.location}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="contact">
							Contact Person <span className="text-gray-500">(Optional)</span>
						</label>
						<input
							id="contact"
							name="contact"
							type="text"
							value={formData.contact}
							onChange={handleChange}
							placeholder="e.g., Jane Doe (janedoe@example.com)"
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1" htmlFor="description">
						Event Description *
					</label>
					<textarea
						id="description"
						name="description"
						rows="5"
						value={formData.description}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					></textarea>
				</div>

				<div className="flex justify-end space-x-4">
					<button
						type="button"
						onClick={() => router.push('/admin/speakers')}
						className="cursor-pointer rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isLoading}
						className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4 disabled:opacity-50"
					>
						{isLoading ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Speaker')}
					</button>
				</div>
			</form>
		</div>
	);
}