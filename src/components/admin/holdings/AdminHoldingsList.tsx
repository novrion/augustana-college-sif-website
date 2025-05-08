'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Holding } from '@/lib/types/holding';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import { EditLinkButton, DeleteButton } from "@/components/Buttons";
import StatusMessage from '@/components/common/StatusMessage';
import { formatCurrency } from '@/lib/utils';

interface AdminHoldingsListProps {
	holdings: Holding[];
}

type SortColumn = 'ticker' | 'company_name' | 'share_count' | 'current_price' | 'cost_basis' | 'market_value';
type SortDirection = 'asc' | 'desc';

export default function AdminHoldingsList({ holdings }: AdminHoldingsListProps) {
	const router = useRouter();
	const [error, setError] = useState('');

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [holdingToDelete, setHoldingToDelete] = useState<Holding | null>(null);

	const [sortColumn, setSortColumn] = useState<SortColumn | null>('market_value');
	const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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

	const handleSort = (column: SortColumn) => {
		if (sortColumn === column) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortColumn(column);
			setSortDirection(column === 'market_value' ? 'desc' : 'asc');
		}
	};

	const sortedHoldings = useMemo(() => {
		if (!holdings) return [];
		const sortableHoldings = [...holdings];
		if (sortColumn === null) { return sortableHoldings; }

		sortableHoldings.sort((a, b) => {
			let aValue: string | number;
			let bValue: string | number;
			let comparison = 0;

			switch (sortColumn) {
				case 'ticker':
				case 'company_name':
					aValue = a[sortColumn] || '';
					bValue = b[sortColumn] || '';
					comparison = String(aValue.toLowerCase()).localeCompare(String(bValue.toLowerCase()));
					break;
				case 'share_count':
				case 'current_price':
				case 'cost_basis':
					aValue = a[sortColumn] ?? 0;
					bValue = b[sortColumn] ?? 0;
					if (aValue > bValue) comparison = 1;
					else if (aValue < bValue) comparison = -1;
					break;
				case 'market_value':
					aValue = (a.current_price ?? 0) * (a.share_count ?? 0);
					bValue = (b.current_price ?? 0) * (b.share_count ?? 0);
					if (aValue > bValue) comparison = 1;
					else if (aValue < bValue) comparison = -1;
					break;
				default:
					console.warn(`Unhandled sort column: ${sortColumn}`);
					break;
			}


			return sortDirection === 'desc' ? comparison * -1 : comparison;
		});

		return sortableHoldings;
	}, [holdings, sortColumn, sortDirection]);

	return (
		<div>
			{error && <StatusMessage type="error" message={error} />}

			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-white/[.145]">
					<thead>
						<tr>
							<th
								className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700"
								onClick={() => handleSort('ticker')}
							>
								<div className="flex items-center justify-between">
									Symbol
									{sortColumn === 'ticker' && (
										<span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>)}
								</div>
							</th>
							<th
								className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700"
								onClick={() => handleSort('company_name')}
							>
								<div className="flex items-center justify-between">
									Company
									{sortColumn === 'company_name' && (
										<span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
									)}
								</div>
							</th>
							<th
								className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700"
								onClick={() => handleSort('share_count')}
							>
								<div className="flex items-center justify-between">
									Shares
									{sortColumn === 'share_count' && (
										<span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
									)}
								</div>
							</th>
							<th
								className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700"
								onClick={() => handleSort('current_price')}
							>
								<div className="flex items-center justify-between">
									Current Price
									{sortColumn === 'current_price' && (
										<span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
									)}
								</div>
							</th>
							<th
								className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700"
								onClick={() => handleSort('cost_basis')}
							>
								<div className="flex items-center justify-between">
									Cost Basis
									{sortColumn === 'cost_basis' && (
										<span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
									)}
								</div>
							</th>
							<th
								className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700"
								onClick={() => handleSort('market_value')}
							>
								<div className="flex items-center justify-end">
									Market Value
									{sortColumn === 'market_value' && (
										<span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
									)}
								</div>
							</th>
							<th className="px-4 py-3"></th>
						</tr>
					</thead>
					<tbody className="divide-y divide-white/[.145]">
						{sortedHoldings.length === 0 ? (
							<tr>
								<td colSpan={7} className="px-4 py-4 text-center">
									No holdings found. Add a new holding to get started.
								</td>
							</tr>
						) : (
							sortedHoldings.map((holding) => {
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
											{/* Prevent click propagation from buttons to the row */}
											<div className="flex justify-end space-x-3" onClick={e => e.stopPropagation()}>
												<EditLinkButton
													href={`/admin/holdings/edit/${holding.id}`}
													onClick={(e) => e.stopPropagation()} // Extra stopPropagation just in case
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