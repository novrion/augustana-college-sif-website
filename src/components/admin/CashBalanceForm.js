'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CashBalanceForm({ initialCashBalance }) {
	const [cashBalance, setCashBalance] = useState(initialCashBalance);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');
		setSuccess('');

		try {
			const response = await fetch('/api/admin/portfolio/update-cash', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					amount: parseFloat(cashBalance),
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to update cash balance');
			}

			setSuccess('Cash balance updated successfully');
			router.refresh();
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const formatCurrency = (value) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(value);
	};

	return (
		<div>
			{error && (
				<div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
					{error}
				</div>
			)}

			{success && (
				<div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
					{success}
				</div>
			)}

			<form onSubmit={handleSubmit} className="flex items-end gap-4">
				<div className="flex-1">
					<label className="block text-sm font-medium mb-1" htmlFor="cashBalance">
						Current Cash Balance
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<span className="text-gray-500">$</span>
						</div>
						<input
							id="cashBalance"
							type="number"
							min="0"
							step="0.01"
							value={cashBalance}
							onChange={(e) => setCashBalance(e.target.value)}
							className="w-full pl-8 px-4 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
					<p className="mt-1 text-sm text-gray-500">
						Current cash balance: {formatCurrency(initialCashBalance)}
					</p>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4 disabled:opacity-50 hover:cursor-pointer"
				>
					{isLoading ? 'Updating...' : 'Update Cash Balance'}
				</button>
			</form>
		</div>
	);
}