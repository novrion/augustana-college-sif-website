// components/admin/SpeakersList.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

export default function SpeakersList({ speakers }) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();
	const [activeTab, setActiveTab] = useState('upcoming');

	// State for delete confirmation modal
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [speakerToDelete, setSpeakerToDelete] = useState(null);

	const formatDate = (dateString) => {
		// Create a date object with the date part only, using the local timezone
		const date = new Date(dateString + 'T00:00:00');
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	const isPastEvent = (dateString) => {
		// Get the event date and set it to the end of the day (23:59:59)
		const eventDate = new Date(dateString + 'T23:59:59');

		// Get current date
		const now = new Date();

		// Compare - event is past only if the end of its day has passed
		return eventDate < now;
	};

	// Filter speakers based on active tab
	const filteredSpeakers = speakers.filter(speaker => {
		const isPast = isPastEvent(speaker.event_date);
		return activeTab === 'upcoming' ? !isPast : isPast;
	});

	// Sort speakers by date
	filteredSpeakers.sort((a, b) => {
		const dateA = new Date(a.event_date);
		const dateB = new Date(b.event_date);
		return activeTab === 'upcoming' ? dateA - dateB : dateB - dateA;
	});

	const openDeleteModal = (speaker) => {
		setSpeakerToDelete(speaker);
		setIsDeleteModalOpen(true);
	};

	const closeDeleteModal = () => {
		setIsDeleteModalOpen(false);
		setSpeakerToDelete(null);
	};

	const confirmDeleteSpeaker = async () => {
		if (!speakerToDelete) return;

		setIsLoading(true);
		setError('');

		try {
			const response = await fetch(`/api/admin/speakers/delete`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					speakerId: speakerToDelete.id,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete speaker');
			}

			// Close modal and refresh the page
			closeDeleteModal();
			router.refresh();
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			{error && (
				<div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
					{error}
				</div>
			)}

			{/* Tabs for filtering */}
			<div className="flex border-b border-black/[.08] dark:border-white/[.145] mb-6 font-[family-name:var(--font-geist-mono)]">
				<button
					className={`cursor-pointer py-2 px-4 font-medium ${activeTab === 'upcoming'
						? 'border-b-2 border-blue-500'
						: 'text-gray-500 dark:text-gray-400'
						}`}
					onClick={() => setActiveTab('upcoming')}
				>
					Upcoming Speakers
				</button>
				<button
					className={`cursor-pointer py-2 px-4 font-medium ${activeTab === 'past'
						? 'border-b-2 border-blue-500'
						: 'text-gray-500 dark:text-gray-400'
						}`}
					onClick={() => setActiveTab('past')}
				>
					Past Speakers
				</button>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-black/[.08] dark:divide-white/[.145]">
					<thead>
						<tr>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								Speaker
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								Event Details
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								Date
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								Status
							</th>
							<th className="px-4 py-3"></th>
						</tr>
					</thead>
					<tbody className="divide-y divide-black/[.08] dark:divide-white/[.145]">
						{filteredSpeakers.length === 0 ? (
							<tr>
								<td colSpan="5" className="px-4 py-4 text-center">
									No {activeTab} speakers found.
								</td>
							</tr>
						) : (
							filteredSpeakers.map((speaker) => {
								const isPast = isPastEvent(speaker.event_date);
								return (
									<tr key={speaker.id}>
										<td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
											{speaker.speaker_name}
											{speaker.role && speaker.company && (
												<div className="text-xs text-gray-500">
													{speaker.role} at {speaker.company}
												</div>
											)}
											{speaker.role && !speaker.company && (
												<div className="text-xs text-gray-500">
													{speaker.role}
												</div>
											)}
											{!speaker.role && speaker.company && (
												<div className="text-xs text-gray-500">
													{speaker.company}
												</div>
											)}
										</td>
										<td className="px-4 py-4 whitespace-nowrap text-sm">
											{speaker.title || "No title specified"}
											<div className="text-xs text-gray-500">
												{speaker.location}, {speaker.time}
											</div>
										</td>
										<td className="px-4 py-4 whitespace-nowrap text-sm">
											{formatDate(speaker.event_date)}
										</td>
										<td className="px-4 py-4 whitespace-nowrap text-sm">
											<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isPast
												? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
												: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200'
												}`}>
												{isPast ? 'Past' : 'Upcoming'}
											</span>
										</td>
										<td className="px-4 py-4 whitespace-nowrap text-sm text-right">
											<div className="flex justify-end space-x-3">
												<Link
													href={`/admin/speakers/edit/${speaker.id}`}
													className="text-blue-500 hover:underline"
												>
													Edit
												</Link>
												<button
													onClick={() => openDeleteModal(speaker)}
													disabled={isLoading}
													className="cursor-pointer text-red-500 hover:underline"
												>
													Delete
												</button>
											</div>
										</td>
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>

			{/* Delete Confirmation Modal */}
			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={closeDeleteModal}
				onConfirm={confirmDeleteSpeaker}
				title="Delete Speaker Event"
				message="Are you sure you want to delete this speaker event?"
				itemName={speakerToDelete?.title || speakerToDelete?.speaker_name}
				isLoading={isLoading}
			/>
		</div>
	);
}