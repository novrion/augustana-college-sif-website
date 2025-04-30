'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function GalleryImageForm({ initialData = null }) {
	const isEditing = !!initialData;
	const router = useRouter();
	const fileInputRef = useRef(null);

	const [formData, setFormData] = useState({
		title: initialData?.title || '',
		description: initialData?.description || '',
	});

	const [selectedFile, setSelectedFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(initialData?.src || null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [charCount, setCharCount] = useState(0);
	const MAX_CHARS = 300;

	// Calculate initial character count
	useEffect(() => {
		if (formData.description) {
			setCharCount(formData.description.length);
		}
	}, [formData.description]);

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === 'description') {
			const chars = value.length;
			if (chars > MAX_CHARS) {
				return; // Don't update if exceeding limit
			}
			setCharCount(chars);
		}

		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// Validate file type
		const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
		if (!validTypes.includes(file.type)) {
			setError('File type not supported. Please upload a JPEG, PNG, or GIF image.');
			return;
		}

		// Validate file size (max 5MB)
		const maxSize = 5 * 1024 * 1024;
		if (file.size > maxSize) {
			setError('File size exceeds 5MB limit.');
			return;
		}

		setSelectedFile(file);
		setError('');

		// Create a preview URL
		const reader = new FileReader();
		reader.onload = () => {
			setPreviewUrl(reader.result);
		};
		reader.readAsDataURL(file);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		if (!isEditing && !selectedFile) {
			setError('Please select an image to upload');
			setIsLoading(false);
			return;
		}

		if (!formData.title) {
			setError('Please enter a title for the image');
			setIsLoading(false);
			return;
		}

		try {
			if (isEditing) {
				// Update existing image
				const response = await fetch(`/api/gallery/images/update`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						id: initialData.id,
						title: formData.title,
						description: formData.description,
					}),
				});

				if (!response.ok) {
					const data = await response.json();
					throw new Error(data.error || 'Failed to update image');
				}

				// If there's a new file, upload it separately
				if (selectedFile) {
					const formDataObj = new FormData();
					formDataObj.append('file', selectedFile);
					formDataObj.append('imageId', initialData.id);

					const fileResponse = await fetch('/api/gallery/images/update-file', {
						method: 'POST',
						body: formDataObj,
					});

					if (!fileResponse.ok) {
						const data = await fileResponse.json();
						throw new Error(data.error || 'Failed to update image file');
					}
				}
			} else {
				// Create new image
				const formDataObj = new FormData();
				formDataObj.append('file', selectedFile);
				formDataObj.append('title', formData.title);
				formDataObj.append('description', formData.description || '');

				const response = await fetch('/api/gallery/images/upload', {
					method: 'POST',
					body: formDataObj,
				});

				if (!response.ok) {
					const data = await response.json();
					throw new Error(data.error || 'Failed to upload image');
				}
			}

			// Redirect back to gallery management page
			router.push('/admin/gallery');
			router.refresh();
		} catch (error) {
			console.error('Error with gallery image:', error);
			setError(error.message || 'An unexpected error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6">
			<h2 className="text-xl font-semibold mb-6">
				{isEditing ? 'Edit Gallery Image' : 'Add New Gallery Image'}
			</h2>

			{error && (
				<div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="mb-6">
					<label className="block text-sm font-medium mb-2" htmlFor="file-upload">
						Image
					</label>
					<div
						onClick={() => fileInputRef.current?.click()}
						className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
					>
						{previewUrl ? (
							<div className="relative w-full max-w-md aspect-[4/3]">
								<Image
									src={previewUrl}
									alt="Preview"
									fill
									className="object-cover rounded-md"
								/>
							</div>
						) : (
							<>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								<p className="text-gray-500 mb-2">Click to {isEditing ? 'replace' : 'select'} an image</p>
								<p className="text-xs text-gray-400">JPG, PNG, GIF up to 5MB</p>
							</>
						)}
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleFileChange}
							accept="image/jpeg,image/png,image/gif"
							className="hidden"
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1" htmlFor="title">
						Title *
					</label>
					<input
						id="title"
						name="title"
						type="text"
						value={formData.title}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div>
					<div className="flex justify-between mb-1">
						<label className="block text-sm font-medium" htmlFor="description">
							Description
						</label>
						<span className={`text-xs ${charCount > MAX_CHARS * 0.8 ? 'text-orange-500' : 'text-gray-500'}`}>
							{charCount}/{MAX_CHARS} characters
						</span>
					</div>
					<textarea
						id="description"
						name="description"
						rows="4"
						value={formData.description}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder={`Enter a description (maximum ${MAX_CHARS} characters)`}
					></textarea>
					<p className="text-xs text-gray-500 mt-1">
						A brief description of the image (maximum {MAX_CHARS} characters)
					</p>
				</div>

				<div className="flex justify-end space-x-4">
					<button
						type="button"
						onClick={() => router.push('/admin/gallery')}
						className="cursor-pointer rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isLoading}
						className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4 disabled:opacity-50"
					>
						{isLoading ? (isEditing ? 'Saving...' : 'Uploading...') : (isEditing ? 'Save Changes' : 'Upload Image')}
					</button>
				</div>
			</form>
		</div>
	);
}