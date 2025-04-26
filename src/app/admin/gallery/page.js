'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function GalleryAdmin() {
	const router = useRouter();

	// State for gallery images
	const [galleryImages, setGalleryImages] = useState([
		{
			id: "img1",
			src: "/images/1.jpg",
			alt: "Stock pitch presentation",
			title: "Fall 2024 Stock Pitch",
			description: "Students presenting their analysis of Nvidia stock to the fund committee"
		},
		{
			id: "img2",
			src: "/images/2.jpg",
			alt: "Guest speaker event",
			title: "Industry Expert Talk",
			description: "Jane Doe from Morgan Stanley discussing market trends"
		},
		{
			id: "img3",
			src: "/images/3.jpg",
			alt: "Fund meeting",
			title: "Weekly Meeting",
			description: "SIF members analyzing portfolio performance"
		},
		{
			id: "img4",
			src: "/images/4.jpg",
			alt: "Market analysis",
			title: "Sector Analysis",
			description: "Deep dive into the technology sector outlook"
		}
	]);

	// State for form
	const [formData, setFormData] = useState({
		id: '',
		src: '',
		alt: '',
		title: '',
		description: ''
	});

	const [isEditing, setIsEditing] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState({ text: '', type: '' });
	const [previewImage, setPreviewImage] = useState(null);
	const [draggedIndex, setDraggedIndex] = useState(null);

	// Handle form input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	// Handle image preview
	const handleImagePreview = (e) => {
		const file = e.target.files[0];
		if (!file) {
			setPreviewImage(null);
			return;
		}

		// In a real app, this would upload to a server and get a URL
		// For this demo, we're just creating a local object URL
		const tempUrl = URL.createObjectURL(file);
		setPreviewImage(tempUrl);

		// Update the form with a placeholder URL (in a real app, this would be the actual uploaded URL)
		setFormData(prev => ({
			...prev,
			src: `/images/${file.name}` // Placeholder - would be a real URL in production
		}));
	};

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Validate form data
			if (!formData.title || !formData.alt || !formData.src || !formData.description) {
				throw new Error('Please fill in all required fields');
			}

			if (isEditing) {
				// Update existing image
				setGalleryImages(prevImages =>
					prevImages.map(img => img.id === formData.id ? { ...formData } : img)
				);
				setMessage({ text: `Image "${formData.title}" updated successfully!`, type: 'success' });
			} else {
				// Add new image with a unique ID
				const newId = `img${Date.now()}`;
				setGalleryImages(prevImages => [
					...prevImages,
					{ ...formData, id: newId }
				]);
				setMessage({ text: `Image "${formData.title}" added successfully!`, type: 'success' });
			}

			// Reset form
			setFormData({
				id: '',
				src: '',
				alt: '',
				title: '',
				description: ''
			});
			setIsEditing(false);
			setPreviewImage(null);

			// Reset file input
			const fileInput = document.getElementById('imageUpload');
			if (fileInput) fileInput.value = '';

			// Refresh the page cache
			router.refresh();

		} catch (error) {
			setMessage({
				text: error.message || 'An error occurred',
				type: 'error'
			});
		} finally {
			setIsSubmitting(false);

			// Clear message after 5 seconds
			setTimeout(() => {
				setMessage({ text: '', type: '' });
			}, 5000);
		}
	};

	// Handle image edit
	const handleEdit = (image) => {
		setFormData(image);
		setIsEditing(true);
		setPreviewImage(image.src);

		// Scroll to form
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	};

	// Handle image delete
	const handleDelete = (id, title) => {
		if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
			setGalleryImages(prevImages => prevImages.filter(img => img.id !== id));
			setMessage({
				text: `Image "${title}" deleted successfully!`,
				type: 'success'
			});

			// Clear message after 5 seconds
			setTimeout(() => {
				setMessage({ text: '', type: '' });
			}, 5000);

			// Refresh the page cache
			router.refresh();
		}
	};

	// Handle drag start
	const handleDragStart = (index) => {
		setDraggedIndex(index);
	};

	// Handle drag over
	const handleDragOver = (e, index) => {
		e.preventDefault();
		if (draggedIndex === null || draggedIndex === index) return;

		// Reorder the list
		const newImages = [...galleryImages];
		const draggedItem = newImages[draggedIndex];
		newImages.splice(draggedIndex, 1);
		newImages.splice(index, 0, draggedItem);

		// Update the state and dragged index
		setGalleryImages(newImages);
		setDraggedIndex(index);
	};

	// Handle drag end
	const handleDragEnd = () => {
		setDraggedIndex(null);
	};

	// Cancel editing
	const handleCancel = () => {
		setFormData({
			id: '',
			src: '',
			alt: '',
			title: '',
			description: ''
		});
		setIsEditing(false);
		setPreviewImage(null);

		// Reset file input
		const fileInput = document.getElementById('imageUpload');
		if (fileInput) fileInput.value = '';
	};

	return (
		<div className="min-h-screen p-8 sm:p-20">
			<div className="max-w-5xl mx-auto">
				<h1 className="text-3xl font-bold mb-2 font-[family-name:var(--font-geist-mono)]">
					Gallery Admin
				</h1>
				<p className="text-lg mb-8">
					Add, edit, and organize gallery images.
				</p>

				{/* Success/Error message */}
				{message.text && (
					<div className={`p-4 mb-6 rounded-lg ${message.type === 'success'
						? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
						: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
						}`}>
						{message.text}
					</div>
				)}

				{/* Add/Edit form */}
				<div className="mb-12 p-6 rounded-lg border border-black/[.08] dark:border-white/[.145]">
					<h2 className="text-xl font-semibold mb-6 font-[family-name:var(--font-geist-mono)]">
						{isEditing ? 'Edit Image' : 'Add New Image'}
					</h2>

					<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Left column - form fields */}
						<div className="space-y-6">
							{/* Title */}
							<div>
								<label htmlFor="title" className="block mb-2 font-medium">
									Title <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									id="title"
									name="title"
									value={formData.title}
									onChange={handleChange}
									required
									className="w-full p-3 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							{/* Alt text */}
							<div>
								<label htmlFor="alt" className="block mb-2 font-medium">
									Alt Text <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									id="alt"
									name="alt"
									value={formData.alt}
									onChange={handleChange}
									required
									className="w-full p-3 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Descriptive text for accessibility"
								/>
							</div>

							{/* Description */}
							<div>
								<label htmlFor="description" className="block mb-2 font-medium">
									Description <span className="text-red-500">*</span>
								</label>
								<textarea
									id="description"
									name="description"
									value={formData.description}
									onChange={handleChange}
									rows="3"
									required
									className="w-full p-3 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
								></textarea>
							</div>

							{/* Image upload */}
							<div>
								<label htmlFor="imageUpload" className="block mb-2 font-medium">
									Image <span className="text-red-500">*</span>
								</label>
								<input
									type="file"
									id="imageUpload"
									accept="image/*"
									onChange={handleImagePreview}
									className="w-full p-3 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<p className="text-sm text-gray-500 mt-1">
									{isEditing ? 'Upload a new image to replace the current one' : 'Supported formats: JPG, PNG, WebP'}
								</p>
							</div>

							{/* Buttons */}
							<div className="flex gap-3 mt-6">
								<button
									type="submit"
									disabled={isSubmitting}
									className={`rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
										}`}
								>
									{isSubmitting ? (
										<span className="flex items-center">
											{isEditing ? 'Updating' : 'Adding'}
											<span className="ml-2 h-4 w-4 rounded-full border-2 border-t-transparent border-r-transparent animate-spin" />
										</span>
									) : (
										isEditing ? 'Update Image' : 'Add Image'
									)}
								</button>

								{isEditing && (
									<button
										type="button"
										onClick={handleCancel}
										className="rounded-lg border border-black/[.08] dark:border-white/[.145] font-medium px-6 py-3 transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
									>
										Cancel
									</button>
								)}
							</div>
						</div>

						{/* Right column - image preview */}
						<div className="flex items-center justify-center">
							{previewImage ? (
								<div className="relative w-full aspect-[3/4] max-w-[320px]">
									<Image
										src={previewImage}
										alt="Preview"
										fill
										className="object-cover rounded-lg"
									/>
								</div>
							) : (
								<div className="w-full aspect-[3/4] max-w-[320px] border-2 border-dashed border-black/[.08] dark:border-white/[.145] rounded-lg flex items-center justify-center">
									<p className="text-gray-500 text-center p-4">
										Image preview will appear here
									</p>
								</div>
							)}
						</div>
					</form>
				</div>

				{/* Gallery management */}
				<div>
					<h2 className="text-xl font-semibold mb-6 font-[family-name:var(--font-geist-mono)]">
						Manage Gallery ({galleryImages.length} images)
					</h2>

					<p className="mb-4 text-sm text-gray-500">
						Drag and drop to reorder images. Changes to order are saved automatically.
					</p>

					{galleryImages.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{galleryImages.map((image, index) => (
								<div
									key={image.id}
									draggable
									onDragStart={() => handleDragStart(index)}
									onDragOver={(e) => handleDragOver(e, index)}
									onDragEnd={handleDragEnd}
									className="rounded-lg border border-black/[.08] dark:border-white/[.145] overflow-hidden cursor-move hover:shadow-md transition-shadow"
								>
									<div className="relative aspect-[3/4] w-full">
										<Image
											src={image.src}
											alt={image.alt}
											fill
											className="object-cover"
										/>
									</div>

									<div className="p-4">
										<h3 className="font-semibold mb-1">{image.title}</h3>
										<p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{image.description}</p>

										<div className="flex justify-between">
											<button
												onClick={() => handleEdit(image)}
												className="text-blue-500 hover:underline text-sm font-medium"
											>
												Edit
											</button>

											<button
												onClick={() => handleDelete(image.id, image.title)}
												className="text-red-500 hover:underline text-sm font-medium"
											>
												Delete
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center p-8 border border-dashed border-black/[.08] dark:border-white/[.145] rounded-lg">
							<p>No images found. Add your first image above!</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}