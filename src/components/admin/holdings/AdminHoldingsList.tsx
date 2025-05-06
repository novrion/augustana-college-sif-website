'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Holding } from '@/lib/types/holding';
import { DeleteConfirmationModal } from '@/components/admin/common';

interface AdminHoldingsListProps {
	holdings: Holding[];
}

export default function AdminHoldingsList({ holdings }: AdminHoldingsListProps) {
	const [error, setError] = useState('');
	const router = useRouter();

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [holdingToDelete, setHoldingToDelete] = useState<Holding | null>(null);

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(value);
	};

	const openDeleteModal = (holding: Holding, e: React.MouseEvent) => {
		e.stopPropagation();
		setHoldingToDelete(holding);
		setIsDeleteModalOpen(true);
	};

	const closeDeleteModal = () => {
		setIsDeleteModalOpen(false);
		setHoldingToDelete(null);
	};

	const confirmDelete = async () => {
		if (!holdingToDelete) return;

		setIsDeleting(true);
		try {
			const response = await fetch(`/api/admin/holdings/delete-holding`, {
				method: 'DELETE',
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

			closeDeleteModal();
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An unexpected error occurred');
		} finally {
			setIsDeleting(false);
		}
	};

	const handleHoldingClick = (id: string) => {
		router.push(`/admin/holdings/edit/${id}`);
	};

	return (
		<div>
			{error && (
				<div className="mb-4 p-3 text-red-700 rounded-md">
					{error}
				</div>
			)}

			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-white/[.145]">
					<thead>
						<tr>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
								Ticker
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
								Company
							</th>
							<th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
								Shares
							</th>
							<th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
								Current Price
							</th>
							<th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
								Cost Basis
							</th>
							<th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
								Market Value
							</th>
							<th className="px-4 py-3"></th>
						</tr>
					</thead>
					<tbody className="divide-y divide-white/[.145]">
						{holdings.length === 0 ? (
							<tr>
								<td colSpan={7} className="px-4 py-4 text-center">
									No holdings found. Add a new holding to get started.
								</td>
							</tr>
						) : (
							holdings.map((holding) => {
								const marketValue = holding.current_price * holding.share_count;
								return (
									<tr
										key={holding.id}
										onClick={() => handleHoldingClick(holding.id)}
										className="hover:bg-[#1a1a1a] cursor-pointer"
									>
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
											{formatCurrency(holding.current_price)}
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
													href={`/admin/holdings/edit/${holding.id}`}
													className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
													onClick={(e) => e.stopPropagation()}
												>
													Edit
												</Link>
												<button
													onClick={(e) => openDeleteModal(holding, e)}
													className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md"
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

			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={closeDeleteModal}
				onConfirm={confirmDelete}
				isLoading={isDeleting}
				title="Delete Holding"
				message="Are you sure you want to delete this holding? This action cannot be undone."
				itemName={holdingToDelete?.ticker}
			/>
		</div>
	);
}