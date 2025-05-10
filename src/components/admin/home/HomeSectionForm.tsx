'use client'

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { HomeSection } from '@/lib/types';
import Form from "@/components/Form";
import { FilledButton, EmptyButton } from "@/components/Buttons";

interface HomeSectionFormProps {
	initialData?: HomeSection;
	isEditing?: boolean;
}

export default function HomeSectionForm({
	initialData,
	isEditing = false
}: HomeSectionFormProps) {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isUploadingImage, setIsUploadingImage] = useState(false);

	const [formData, setFormData] = useState({
		title: initialData?.title || '',
		content: initialData?.content || '',
		image_url: initialData?.image_url || '',
	});

	const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image_url || null);
	const [previousImageUrl, setPreviousImageUrl] = useState<string | null>(initialData?.image_url || null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleFileSelect = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const file = files[0];
		const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
		if (!validTypes.includes(file.type)) {
			setError('Please select a valid image file (JPEG, PNG, or GIF)');
			return;
		}

		// Validate file size (5MB max)
		const maxSize = 5 * 1024 * 1024;
		if (file.size > maxSize) {
			setError('File size exceeds 5MB limit');
			return;
		}

		setIsUploadingImage(true);
		setError('');

		try {
			// Create a FormData object to upload the file
			const formData = new FormData();
			formData.append('file', file);

			// Add the previous image URL to be deleted
			if (previousImageUrl) {
				formData.append('previousImageUrl', previousImageUrl);
			}

			const response = await fetch('/api/admin/home/upload-image', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to upload image');
			}

			const data = await response.json();

			// Update previous image URL to the new one
			setPreviousImageUrl(data.url);
			setFormData(prev => ({ ...prev, image_url: data.url }));
			setPreviewUrl(data.url);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to upload image');
		} finally {
			setIsUploadingImage(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError('');
		setSuccess('');

		try {
			if (!formData.image_url) {
				throw new Error('Please upload an image for this section');
			}

			const endpoint = isEditing ? `/api/admin/home/${initialData?.id}` : '/api/admin/home';
			const method = isEditing ? 'PUT' : 'POST';

			// For updates, include the previous image URL if it's different from the current one
			const requestData = {
				...formData,
				previousImageUrl: isEditing && initialData?.image_url !== formData.image_url ? initialData?.image_url : null
			};

			const response = await fetch(endpoint, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(requestData)
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to save section');
			}

			setSuccess(isEditing ? 'Section updated successfully!' : 'Section created successfully!');
			setTimeout(() => {
				router.push('/admin/home');
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
			title={isEditing ? "Edit Home Section" : "Add New Home Section"}
			error={error}
			success={success}
		>
			<div className="space-y-4">
				<div>
					<label htmlFor="title" className="block text-sm font-medium mb-1">
						Section Title
					</label>
					<input
						id="title"
						name="title"
						type="text"
						value={formData.title}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						required
					/>
				</div>

				<div>
					<label htmlFor="content" className="block text-sm font-medium mb-1">
						Content
					</label>
					<textarea
						id="content"
						name="content"
						rows={8}
						value={formData.content}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent font-[family-name:var(--font-geist-sans)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-2">
						Section Image
					</label>
					<div
						onClick={handleFileSelect}
						className="border-2 border-dashed border-white/[.145] rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
					>
						{previewUrl ? (
							<div className="relative w-full max-w-md aspect-[16/9] mb-2">
								<Image
									src={previewUrl}
									alt="Preview"
									fill
									className="object-cover rounded-md"
								/>
							</div>
						) : (
							<div className="text-center py-8">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								<p className="text-gray-500">
									Click to {isEditing ? 'change' : 'upload'} image
								</p>
								<p className="text-sm text-gray-400 mt-2">
									JPG, PNG, GIF (max 5MB)
								</p>
							</div>
						)}

						{isUploadingImage && (
							<div className="mt-2 flex items-center justify-center">
								<div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mr-2"></div>
								<span>Uploading...</span>
							</div>
						)}
					</div>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/jpeg,image/png,image/gif"
						onChange={handleFileChange}
						className="hidden"
					/>
					{formData.image_url && (
						<input
							type="hidden"
							name="image_url"
							value={formData.image_url}
						/>
					)}
				</div>
			</div>

			<div className="flex justify-end gap-3 mt-6">
				<EmptyButton
					onClick={() => router.push('/admin/home')}
					text="Cancel"
					isLoading={false}
					type="button"
				/>
				<FilledButton
					type="submit"
					text={isEditing ? 'Update Section' : 'Add Section'}
					loadingText="Saving..."
					isLoading={isSubmitting}
				/>
			</div>
		</Form>
	);
}