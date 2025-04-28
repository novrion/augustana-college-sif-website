'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HoldingForm({ initialData = null }) {
	const isEditing = !!initialData;

	const [formData, setFormData] = useState({
		ticker: initialData?.ticker || '',
		company_name: initialData?.company_name || '',
		sector: initialData?.sector || '',
		share_count: initialData?.share_count || '',
		cost_basis: initialData?.cost_basis || '',
		current_price: initialData?.current_price || '',
		purchase_date: initialData?.purchase_date ? new Date(initialData.purchase_date).toISOString().split('T')[0] : '',
	});

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	// Updated handleSubmit function for HoldingForm.js
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		// Validate form
		if (!formData.ticker || !formData.company_name || !formData.share_count ||
			!formData.cost_basis || !formData.current_price || !formData.purchase_date) {
			setError('Please fill in all required fields');
			setIsLoading(false);
			return;
		}

		// Prepare data for submission
		const submitData = {
			...formData,
			share_count: parseInt(formData.share_count, 10),
			cost_basis: parseFloat(formData.cost_basis),
			current_price: parseFloat(formData.current_price),
		};

		try {
			const url = isEditing
				? `/api/admin/portfolio/update-holding`
				: `/api/admin/portfolio/add-holding`;

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

			const contentType = response.headers.get("content-type");
			if (!contentType || !contentType.includes("application/json")) {
				throw new Error(`Server responded with non-JSON content: ${await response.text()}`);
			}

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'add'} holding`);
			}

			// Redirect back to portfolio admin page
			router.push('/admin/portfolio');
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
				{isEditing ? 'Edit Holding' : 'Add New Holding'}
			</h2>

			{error && (
				<div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Basic Information */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="company_name">
							Company Name *
						</label>
						<input
							id="company_name"
							name="company_name"
							type="text"
							value={formData.company_name}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="sector">
							Sector
						</label>
						<input
							id="sector"
							name="sector"
							type="text"
							value={formData.sector}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>

				{/* Investment Details */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="share_count">
							Number of Shares *
						</label>
						<input
							id="share_count"
							name="share_count"
							type="number"
							min="1"
							value={formData.share_count}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
						<p className="text-xs text-gray-500 mt-1">
							The total amount invested including fees and commissions
						</p>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1" htmlFor="current_price">
							Current Price ($) *
						</label>
						<input
							id="current_price"
							name="current_price"
							type="number"
							min="0"
							step="0.01"
							value={formData.current_price}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
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
						className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div className="flex justify-end space-x-4">
					<button
						type="button"
						onClick={() => router.push('/admin/portfolio')}
						className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isLoading}
						className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4 disabled:opacity-50"
					>
						{isLoading ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Holding')}
					</button>
				</div>
			</form>
		</div>
	);
}