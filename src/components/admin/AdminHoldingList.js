'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

export default function AdminHoldingList({ holdings }) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();

	const formatCurrency = (value) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(value);
	};

	// State for delete confirmation modal
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [holdingToDelete, setHoldingToDelete] = useState(null);

	const openDeleteModal = (holding) => {
		setHoldingToDelete(holding);
		setIsDeleteModalOpen(true);
	};

	const closeDeleteModal = () => {
		setIsDeleteModalOpen(false);
		setHoldingToDelete(null);
	};

	const confirmDeleteHolding = async () => {
		if (!holdingToDelete) return;

		setIsLoading(true);
		setError('');

		try {
			const response = await fetch(`/api/admin/portfolio/delete-holding`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					holdingId: holdingToDelete.id,
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to delete holding');
			}

			// Refresh the page
			closeDeleteModal();
			router.refresh();
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const updatePrice = async (holdingId, ticker, currentPrice) => {
		// Get the new price from the user
		const newPrice = prompt(`Enter the new price for ${ticker}:`, currentPrice);

		// Check if user cancelled or entered an invalid price
		if (newPrice === null || isNaN(parseFloat(newPrice))) {
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			const response = await fetch(`/api/admin/portfolio/update-price`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					holdingId,
					currentPrice: parseFloat(newPrice),
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to update price');
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
								Ticker
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								Company
							</th>
							<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								Shares
							</th>
							<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								Current Price
							</th>
							<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								Cost Basis
							</th>
							<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
								Market Value
							</th>
							<th className="px-4 py-3"></th>
						</tr>
					</thead>
					<tbody className="divide-y divide-black/[.08] dark:divide-white/[.145]">
						{holdings.length === 0 ? (
							<tr>
								<td colSpan="7" className="px-4 py-4 text-center">
									No holdings found. Add a new holding to get started.
								</td>
							</tr>
						) : (
							holdings.map((holding) => {
								const marketValue = holding.current_price * holding.share_count;

								return (
									<tr key={holding.id}>
										<td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
											{holding.ticker}
										</td>
										<td className="px-4 py-4 whitespace-nowrap text-sm">
											{holding.company_name}
										</td>
										<td className="px-4 py-4 whitespace-nowrap text-sm text-right">
											{holding.share_count.toLocaleString()}
										</td>
										<td className="px-4 py-4 whitespace-nowrap text-sm text-right">
											<button
												onClick={() => updatePrice(holding.id, holding.ticker, holding.current_price)}
												className="text-blue-500 underline cursor-pointer"
												disabled={isLoading}
											>
												{formatCurrency(holding.current_price)}
											</button>
										</td>
										<td className="px-4 py-4 whitespace-nowrap text-sm text-right">
											{formatCurrency(holding.cost_basis)}
										</td>
										<td className="px-4 py-4 whitespace-nowrap text-sm text-right">
											{formatCurrency(marketValue)}
										</td>
										<td className="px-4 py-4 whitespace-nowrap text-sm text-right">
											<div className="flex justify-end space-x-3">
												<Link
													href={`/admin/portfolio/edit/${holding.id}`}
													className="text-blue-500 hover:underline"
												>
													Edit
												</Link>
												<button
													onClick={() => openDeleteModal(holding)}
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
				onConfirm={confirmDeleteHolding}
				title="Delete Holding"
				message="Are you sure you want to delete this holding?"
				itemName={holdingToDelete?.title}
				isLoading={isLoading}
			/>
		</div>
	);
}