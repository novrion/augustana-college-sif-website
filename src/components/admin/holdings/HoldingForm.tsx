'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Holding } from '@/lib/types/holding';
import Form from "@/components/Form";
import { FilledButton, EmptyButton } from "@/components/Buttons";

interface HoldingFormProps {
	initialData?: Holding | null;
}

export default function HoldingForm({ initialData }: HoldingFormProps) {
	const isEditing = !!initialData;
	const router = useRouter();

	const [formData, setFormData] = useState({
		ticker: initialData?.ticker || '',
		company_name: initialData?.company_name || '',
		sector: initialData?.sector || '',
		share_count: initialData?.share_count || '',
		cost_basis: initialData?.cost_basis || '',
		current_price: initialData?.current_price || '',
		purchase_date: initialData?.purchase_date
			? new Date(initialData.purchase_date).toISOString().split('T')[0]
			: new Date().toISOString().split('T')[0],
	});

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');
		setSuccess('');

		if (!formData.ticker || !formData.share_count || !formData.cost_basis || !formData.purchase_date) {
			setError('Please fill in all required fields');
			setIsLoading(false);
			return;
		}

		try {
			const submitData = {
				...formData,
				ticker: formData.ticker.toUpperCase(),
				share_count: parseInt(formData.share_count.toString(), 10),
				cost_basis: parseFloat(formData.cost_basis.toString()),
				current_price: parseFloat(formData.current_price.toString()),
			};

			const url = isEditing
				? `/api/admin/holdings/update-holding`
				: `/api/admin/holdings/add-holding`;

			const body = isEditing
				? { ...submitData, id: initialData.id }
				: submitData;

			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'add'} holding`);
			}

			setSuccess(isEditing ? 'Holding updated successfully!' : 'Holding added successfully!');

			// Redirect after a short delay
			setTimeout(() => {
				router.push('/admin/holdings');
				router.refresh();
			}, 1000);
		} catch (err) {
			console.error("Submission error:", err);
			setError(err instanceof Error ? err.message : 'An unexpected error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form
			onSubmit={handleSubmit}
			title={isEditing ? "Edit Holding" : "Add New Holding"}
			error={error}
			success={success}
		>
			<div className="space-y-6">
				<div>
					<label className="block text-sm font-medium mb-1" htmlFor="ticker">
						Ticker Symbol *
					</label>
					<input
						id="ticker"
						name="ticker"
						type="text"
						value={formData.ticker}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
						disabled={isEditing} // Can't change ticker when editing
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="share_count">
							Number of Shares *
						</label>
						<input
							id="share_count"
							name="share_count"
							type="number"
							min="1"
							step="1"
							value={formData.share_count}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="cost_basis">
							Cost Basis ($) *
						</label>
						<input
							id="cost_basis"
							name="cost_basis"
							type="number"
							min="0"
							step="0.01"
							value={formData.cost_basis}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
						<p className="text-xs text-gray-400 mt-1">
							The total amount invested including fees and commissions
						</p>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1" htmlFor="purchase_date">
						Purchase Date *
					</label>
					<input
						id="purchase_date"
						name="purchase_date"
						type="date"
						value={formData.purchase_date}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div className="flex justify-end gap-3 mt-6">
					<EmptyButton
						onClick={() => router.push('/admin/holdings')}
						text="Cancel"
						isLoading={false}
						type="button"
					/>
					<FilledButton
						type="submit"
						text={isEditing ? 'Update Holding' : 'Add Holding'}
						loadingText={isEditing ? 'Updating...' : 'Adding...'}
						isLoading={isLoading}
					/>
				</div>
			</div>
		</Form>
	);
}