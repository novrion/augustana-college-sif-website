'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminAboutSectionsList({ aboutSections }) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();

	// Sort sections by order_index before rendering
	const sortedSections = [...aboutSections].sort((a, b) => a.order_index - b.order_index);

	const handleDeleteAboutSection = async (aboutSectionId) => {
		if (!window.confirm('Are you sure you want to delete this section? This action cannot be undone.')) {
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			const response = await fetch(`/api/admin/about/delete`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					aboutSectionId,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete about section');
			}

			// Refresh the page
			router.refresh();
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	// Function to move a section up or down
	const handleReorder = async (sectionId, direction) => {
		setIsLoading(true);
		setError('');

		try {
			const response = await fetch(`/api/admin/about/reorder`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					sectionId,
					direction,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to reorder sections');
			}

			// Refresh the page
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

			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-black/[.08] dark:divide-white/[.145]">
					<thead>
						<tr>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								Order
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								Title
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-black/[.08] dark:divide-white/[.145]">
						{sortedSections.length === 0 ? (
							<tr>
								<td colSpan="3" className="px-4 py-4 text-center">
									No sections found. Add a new section to get started.
								</td>
							</tr>
						) : (
							sortedSections.map((section, index) => (
								<tr key={section.id}>
									<td className="px-4 py-4 whitespace-nowrap text-sm font-medium flex items-center">
										<span>{section.order_index}</span>
										<div className="flex flex-col ml-2 px-4">
											<button
												onClick={() => handleReorder(section.id, 'up')}
												disabled={index === 0 || isLoading}
												className={`text-gray-500 hover:text-gray-700 h-4 flex items-center justify-center ${index === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
											>
												↑
											</button>
											<button
												onClick={() => handleReorder(section.id, 'down')}
												disabled={index === sortedSections.length - 1 || isLoading}
												className={`text-gray-500 hover:text-gray-700 h-4 flex items-center justify-center ${index === sortedSections.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
											>
												↓
											</button>
										</div>
									</td>
									<td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
										{section.title}
									</td>
									<td className="px-4 py-4 whitespace-nowrap text-sm text-right">
										<div className="flex space-x-3">
											<Link
												href={`/admin/about/edit/${section.id}`}
												className="text-blue-500 hover:underline"
											>
												Edit
											</Link>
											<button
												onClick={() => handleDeleteAboutSection(section.id)}
												disabled={isLoading}
												className="text-red-500 hover:underline"
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
		</div>
	);
}