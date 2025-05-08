'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pitch } from '@/lib/types/pitch';
import Form from "@/components/Form";
import { FilledButton, EmptyButton } from "@/components/Buttons";
import { formatDateForInput } from '@/lib/utils';

interface PitchFormProps {
	initialData?: Pitch;
	isEditing?: boolean;
}

export default function PitchForm({
	initialData,
	isEditing = false
}: PitchFormProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const [formData, setFormData] = useState({
		title: initialData?.title || '',
		analyst: initialData?.analyst || '',
		date: formatDateForInput(initialData?.date),
		description: initialData?.description || '',
		is_buy: initialData?.is_buy ?? true,
		amount: initialData?.amount?.toString() || '',
		company: initialData?.company || '',
		symbol: initialData?.symbol || '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;

		if (type === 'radio') {
			setFormData(prev => ({ ...prev, [name]: value === 'true' }));
		} else {
			setFormData(prev => ({ ...prev, [name]: value }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError('');
		setSuccess('');

		try {
			const endpoint = isEditing
				? `/api/admin/pitches/${initialData?.id}`
				: '/api/admin/pitches';

			const method = isEditing ? 'PUT' : 'POST';

			const response = await fetch(endpoint, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					symbol: formData.symbol.toUpperCase(),
					amount: parseFloat(formData.amount)
				})
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to save pitch');
			}

			setSuccess(isEditing ? 'Pitch updated successfully!' : 'Pitch created successfully!');

			// Redirect after a short delay
			setTimeout(() => {
				router.push('/admin/pitches');
				router.refresh();
			}, 1000);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form
			onSubmit={handleSubmit}
			title={isEditing ? "Edit Stock Pitch" : "Add Stock Pitch"}
			error={error}
			success={success}
		>
			<div className="space-y-4">
				<div>
					<label htmlFor="title" className="block text-sm font-medium mb-1">
						Title
					</label>
					<input
						id="title"
						name="title"
						type="text"
						value={formData.title}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div>
					<label htmlFor="analyst" className="block text-sm font-medium mb-1">
						Analyst
					</label>
					<input
						id="analyst"
						name="analyst"
						type="text"
						value={formData.analyst}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label htmlFor="date" className="block text-sm font-medium mb-1">
							Date
						</label>
						<input
							id="date"
							name="date"
							type="date"
							value={formData.date}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label htmlFor="amount" className="block text-sm font-medium mb-1">
							Amount ($)
						</label>
						<input
							id="amount"
							name="amount"
							type="number"
							min="0"
							step="0.01"
							value={formData.amount}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label htmlFor="company" className="block text-sm font-medium mb-1">
							Company
						</label>
						<input
							id="company"
							name="company"
							type="text"
							value={formData.company}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div>
						<label htmlFor="symbol" className="block text-sm font-medium mb-1">
							Symbol
						</label>
						<input
							id="symbol"
							name="symbol"
							type="text"
							value={formData.symbol}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="e.g., AAPL"
							required
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium mb-2">
						Type
					</label>
					<div className="flex gap-6">
						<label className="flex items-center">
							<input
								type="radio"
								name="is_buy"
								value="true"
								checked={formData.is_buy === true}
								onChange={handleChange}
								className="mr-2"
							/>
							Buy
						</label>
						<label className="flex items-center">
							<input
								type="radio"
								name="is_buy"
								value="false"
								checked={formData.is_buy === false}
								onChange={handleChange}
								className="mr-2"
							/>
							Sell
						</label>
					</div>
				</div>

				<div>
					<label htmlFor="description" className="block text-sm font-medium mb-1">
						Description (Optional)
					</label>
					<textarea
						id="description"
						name="description"
						rows={5}
						value={formData.description}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent font-[family-name:var(--font-geist-sans)] focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>

			<div className="flex justify-end gap-3 mt-6">
				<EmptyButton
					onClick={() => router.push('/admin/pitches')}
					text="Cancel"
					isLoading={false}
					type="button"
				/>
				<FilledButton
					type="submit"
					text={isEditing ? 'Update Pitch' : 'Add Pitch'}
					loadingText="Saving..."
					isLoading={isSubmitting}
				/>
			</div>
		</Form>
	);
}