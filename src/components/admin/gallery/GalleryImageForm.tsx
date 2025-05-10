'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { GalleryImage } from '@/lib/types';
import Form from "@/components/Form";
import { FilledButton, EmptyButton } from "@/components/Buttons";
import { formatDateForInput } from '@/lib/utils';

interface GalleryImageFormProps {
	initialData?: GalleryImage;
	isEditing?: boolean;
}

export default function GalleryImageForm({
	initialData,
	isEditing = false
}: GalleryImageFormProps) {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const [formData, setFormData] = useState({
		title: initialData?.title || '',
		description: initialData?.description || '',
		date: formatDateForInput(initialData?.date),
	});

	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.src || null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleFileSelect = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

		setSelectedFile(file);
		setError('');

		// Create preview URL
		const reader = new FileReader();
		reader.onloadend = () => {
			setPreviewUrl(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError('');
		setSuccess('');

		try {
			if (!selectedFile && !isEditing) { throw new Error('Please select an image'); }

			if (isEditing && initialData) {
				const formDataToSubmit = new FormData();
				formDataToSubmit.append('title', formData.title);
				formDataToSubmit.append('description', formData.description || '');
				formDataToSubmit.append('date', formData.date);

				if (selectedFile) {
					formDataToSubmit.append('file', selectedFile);
					if (initialData.src) { formDataToSubmit.append('previousImageUrl', initialData.src); }
				}

				const response = await fetch(`/api/admin/gallery/${initialData.id}`, {
					method: 'PUT',
					body: formDataToSubmit,
				});

				if (!response.ok) {
					const data = await response.json();
					throw new Error(data.error || 'Failed to update gallery image');
				}
			} else {
				const formDataToSubmit = new FormData();
				formDataToSubmit.append('file', selectedFile!);
				formDataToSubmit.append('title', formData.title);
				formDataToSubmit.append('description', formData.description || '');
				formDataToSubmit.append('date', formData.date);

				const response = await fetch('/api/admin/gallery/upload', {
					method: 'POST',
					body: formDataToSubmit,
				});

				if (!response.ok) {
					const data = await response.json();
					throw new Error(data.error || 'Failed to create gallery image');
				}
			}

			setSuccess(isEditing ? 'Gallery image updated successfully!' : 'Gallery image created successfully!');
			setTimeout(() => {
				router.push('/admin/gallery');
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
			title={isEditing ? "Edit Gallery Image" : "Add Gallery Image"}
			error={error}
			success={success}
		>
			<div className="space-y-4">
				<div>
					<label htmlFor="title" className="block text-sm font-medium mb-1">
						Image Title *
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
					<label htmlFor="description" className="block text-sm font-medium mb-1">
						Description
					</label>
					<textarea
						id="description"
						name="description"
						rows={3}
						value={formData.description}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent font-[family-name:var(--font-geist-sans)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>

				<div>
					<label htmlFor="date" className="block text-sm font-medium mb-1">
						Date *
					</label>
					<input
						id="date"
						name="date"
						type="date"
						value={formData.date}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-2">
						Image Upload *
					</label>
					<div
						onClick={handleFileSelect}
						className="border-2 border-dashed border-white/[.145] rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
					>
						{previewUrl ? (
							<div className="relative w-full max-w-md aspect-[4/3] mb-2">
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
									Click to {previewUrl ? 'change' : 'upload'} image
								</p>
								<p className="text-sm text-gray-400 mt-2">
									JPG, PNG, GIF (max 5MB)
								</p>
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
				</div>
			</div>

			<div className="flex justify-end gap-3 mt-6">
				<EmptyButton
					onClick={() => router.push('/admin/gallery')}
					text="Cancel"
					isLoading={false}
					type="button"
				/>
				<FilledButton
					type="submit"
					text={isEditing ? 'Update Image' : 'Add Image'}
					loadingText="Saving..."
					isLoading={isSubmitting}
				/>
			</div>
		</Form>
	);
}