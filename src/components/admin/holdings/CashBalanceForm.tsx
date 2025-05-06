'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FilledButton } from "@/components/Buttons";

interface CashBalanceFormProps {
	initialCashBalance: number;
}

export default function CashBalanceForm({ initialCashBalance }: CashBalanceFormProps) {
	const [cashBalance, setCashBalance] = useState(initialCashBalance);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');
		setSuccess('');

		try {
			const response = await fetch('/api/admin/holdings/update-cash', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					amount: parseFloat(cashBalance.toString()),
				}),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to update cash balance');
			}

			setSuccess('Cash balance updated successfully');
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An unexpected error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			{error && (
				<div className="mb-4 p-3 text-red-700 rounded-md font-[family-name:var(--font-geist-mono)]">
					{error}
				</div>
			)}

			{success && (
				<div className="mb-4 p-3 text-green-500 rounded-md font-[family-name:var(--font-geist-mono)]">
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
							<span className="text-gray-400">$</span>
						</div>
						<input
							id="cashBalance"
							type="number"
							min="0"
							step="0.01"
							value={cashBalance}
							onChange={(e) => setCashBalance(parseFloat(e.target.value))}
							className="w-auto pl-8 px-3 py-2 border border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
				</div>

				<FilledButton
					type="submit"
					text="Update Cash Balance"
					loadingText="Updating..."
					isLoading={isLoading}
				/>
			</form>
		</div>
	);
}