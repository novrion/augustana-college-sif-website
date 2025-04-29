'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

export default function NewsletterList({ newsletters }) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();

	// State for delete confirmation modal
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [newsletterToDelete, setNewsletterToDelete] = useState(null);

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	const openDeleteModal = (newsletter) => {
		setNewsletterToDelete(newsletter);
		setIsDeleteModalOpen(true);
	};

	const closeDeleteModal = () => {
		setIsDeleteModalOpen(false);
		setNewsletterToDelete(null);
	};

	const confirmDeleteNewsletter = async () => {
		if (!newsletterToDelete) return;

		setIsLoading(true);
		setError('');

		try {
			const response = await fetch(`/api/admin/newsletter/delete`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					newsletterId: newsletterToDelete.id,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete newsletter');
			}

			// Close modal and refresh the page
			closeDeleteModal();
			router.refresh();
		} catch (error) {
			setError(error.message);
			// Keep modal open in case of error
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

			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-black/[.08] dark:divide-white/[.145]">
					<thead>
						<tr>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								Title
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								Date
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								Author
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								Attachments
							</th>
							<th className="px-4 py-3"></th>
						</tr>
					</thead>
					<tbody className="divide-y divide-black/[.08] dark:divide-white/[.145]">
						{newsletters.length === 0 ? (
							<tr>
								<td colSpan="5" className="px-4 py-4 text-center">
									No newsletters found with the current filters. Try adjusting your search or filter criteria.
								</td>
							</tr>
						) : (
							newsletters.map((newsletter) => (
								<tr key={newsletter.id}>
									<td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
										{newsletter.title}
									</td>
									<td className="px-4 py-4 whitespace-nowrap text-sm">
										{formatDate(newsletter.date)}
									</td>
									<td className="px-4 py-4 whitespace-nowrap text-sm">
										{newsletter.author}
									</td>
									<td className="px-4 py-4 whitespace-nowrap text-sm">
										{newsletter.attachments?.length || 0}
									</td>
									<td className="px-4 py-4 whitespace-nowrap text-sm text-right">
										<div className="flex justify-end space-x-3">
											<Link
												href={`/newsletter/${newsletter.id}`}
												className="text-blue-500 hover:underline"
											>
												View
											</Link>
											<Link
												href={`/admin/newsletter/edit/${newsletter.id}`}
												className="text-blue-500 hover:underline"
											>
												Edit
											</Link>
											<button
												onClick={() => openDeleteModal(newsletter)}
												disabled={isLoading}
												className="cursor-pointer text-red-500 hover:underline"
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Delete Confirmation Modal */}
			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={closeDeleteModal}
				onConfirm={confirmDeleteNewsletter}
				title="Delete Newsletter"
				message="Are you sure you want to delete this newsletter? This action cannot be undone."
				itemName={newsletterToDelete?.title}
				isLoading={isLoading}
			/>
		</div>
	);
}