'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Holding } from '@/lib/types/holding';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import { EditLinkButton, DeleteButton } from "@/components/Buttons";
import StatusMessage from '@/components/common/StatusMessage';
import { formatCurrency } from '@/lib/utils';

interface AdminHoldingsListProps {
	holdings: Holding[];
}

export default function AdminHoldingsList({ holdings }: AdminHoldingsListProps) {
	const router = useRouter();
	const [error, setError] = useState('');

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [holdingToDelete, setHoldingToDelete] = useState<Holding | null>(null);

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
			const response = await fetch(`/api/admin/holdings/${holdingToDelete.id}`, {
				method: 'DELETE'
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
			{error && <StatusMessage type="error" message={error} />}

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
											<div className="flex justify-end space-x-3" onClick={e => e.stopPropagation()}>
												<EditLinkButton
													href={`/admin/holdings/edit/${holding.id}`}
													onClick={(e) => e.stopPropagation()}
												/>
												<DeleteButton
													onClick={(e) => openDeleteModal(holding, e)}
												/>
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