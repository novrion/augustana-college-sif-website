'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function NewsletterForm({ initialData = null }) {
	const { data: session } = useSession();
	const isEditing = !!initialData;
	const router = useRouter();
	const fileInputRef = useRef(null);

	const [formData, setFormData] = useState({
		title: initialData?.title || '',
		date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
		content: initialData?.content || '',
		author: initialData?.author || '',
		attachments: initialData?.attachments || []
	});

	const [isLoading, setIsLoading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [error, setError] = useState('');
	const [uploadError, setUploadError] = useState('');

	// Set author to current user when component loads (for new entries only)
	useEffect(() => {
		if (!isEditing && session?.user?.name) {
			setFormData(prev => ({ ...prev, author: session.user.name }));
		}
	}, [session, isEditing]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleFileUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		if (!isEditing && !formData.title) {
			setUploadError('Please save the newsletter first before uploading files.');
			return;
		}

		setIsLoading(true);
		setUploadError('');
		setUploadProgress(0);

		const formDataObj = new FormData();
		formDataObj.append('file', file);
		formDataObj.append('newsletterId', isEditing ? initialData.id : formData.id);

		try {
			const response = await fetch('/api/admin/newsletter/upload', {
				method: 'POST',
				body: formDataObj,
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to upload file');
			}

			const data = await response.json();

			// Add the new attachment to the form data
			setFormData(prev => ({
				...prev,
				attachments: [...(prev.attachments || []), data.attachment]
			}));

			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		} catch (error) {
			setUploadError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleRemoveAttachment = (index) => {
		if (!window.confirm('Are you sure you want to remove this attachment?')) {
			return;
		}

		const newAttachments = [...formData.attachments];
		newAttachments.splice(index, 1);
		setFormData(prev => ({ ...prev, attachments: newAttachments }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		// Validate form
		if (!formData.title || !formData.date || !formData.content) {
			setError('Please fill in all required fields');
			setIsLoading(false);
			return;
		}

		// Ensure we have an author
		if (!formData.author) {
			setError('User information is unavailable. Please try logging in again.');
			setIsLoading(false);
			return;
		}

		try {
			const url = isEditing
				? `/api/admin/newsletter/update`
				: `/api/admin/newsletter/add`;

			const body = isEditing
				? { ...formData, id: initialData.id }
				: formData;

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
				throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'add'} newsletter`);
			}

			// If we're adding a new newsletter, let's store the ID for later file uploads
			if (!isEditing && data.newsletter) {
				setFormData(prev => ({ ...prev, id: data.newsletter.id }));
			}

			// Redirect back to newsletter page
			router.push('/admin/newsletter');
			router.refresh();
		} catch (error) {
			console.error("Submission error:", error);
			setError(error.message || 'An unexpected error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	// Helper to determine file icon/preview
	const getFilePreview = (attachment) => {
		const type = attachment.type || '';

		if (type.startsWith('image/')) {
			return (
				<div className="relative h-16 w-16 rounded overflow-hidden">
					<Image
						src={attachment.url}
						alt={attachment.originalName || attachment.name}
						fill
						className="object-cover"
					/>
				</div>
			);
		}

		// Default file icon for non-images
		return (
			<div className="h-16 w-16 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
				<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
				</svg>
			</div>
		);
	};

	// Function to get human-readable file size
	const formatFileSize = (bytes) => {
		if (!bytes) return 'Unknown size';

		const units = ['B', 'KB', 'MB', 'GB'];
		let size = bytes;
		let unitIndex = 0;

		while (size >= 1024 && unitIndex < units.length - 1) {
			size /= 1024;
			unitIndex++;
		}

		return `${size.toFixed(1)} ${units[unitIndex]}`;
	};

	return (
		<div className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6">
			<h2 className="text-xl font-semibold mb-6">
				{isEditing ? 'Edit Newsletter' : 'Add New Newsletter'}
			</h2>

			{error && (
				<div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
					{error}
				</div>
			)}

			{/* Display the author information (but not editable) */}
			<div className="mb-6">
				<p className="text-sm font-medium mb-1">
					Author: <span className="font-semibold">{formData.author || 'Loading...'}</span>
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
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
					<label className="block text-sm font-medium mb-1" htmlFor="date">
						Date *
					</label>
					<input
						id="date"
						name="date"
						type="date"
						value={formData.date}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1" htmlFor="content">
						Content *
					</label>
					<textarea
						id="content"
						name="content"
						rows="12"
						value={formData.content}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-black/[.08] dark:border-white/[.145] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-[family-name:var(--font-geist-mono)]"
						required
					></textarea>
				</div>

				{/* File Attachments Section */}
				<div>
					<label className="block text-sm font-medium mb-2">
						Attachments
					</label>

					{uploadError && (
						<div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
							{uploadError}
						</div>
					)}

					{/* File Upload Input */}
					<div className="mb-4">
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleFileUpload}
							disabled={isLoading || (!isEditing && !initialData?.id)}
							className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
						/>
						<p className="mt-1 text-xs text-gray-500">
							{isEditing || initialData?.id
								? 'Upload images, PDFs, or other documents.'
								: 'Save the newsletter first before uploading attachments.'}
						</p>
					</div>

					{/* Attachments List */}
					{formData.attachments && formData.attachments.length > 0 && (
						<div className="mt-4 space-y-3">
							<h3 className="text-sm font-medium">Current Attachments</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{formData.attachments.map((attachment, index) => (
									<div
										key={index}
										className="flex items-center gap-3 p-3 border border-black/[.08] dark:border-white/[.145] rounded-md"
									>
										{getFilePreview(attachment)}
										<div className="flex-1 min-w-0">
											<a
												href={attachment.url}
												target="_blank"
												rel="noopener noreferrer"
												className="block text-sm font-medium truncate text-blue-500 hover:underline"
											>
												{attachment.originalName || attachment.name}
											</a>
											<span className="text-xs text-gray-500">
												{formatFileSize(attachment.size)}
											</span>
										</div>
										<button
											type="button"
											onClick={() => handleRemoveAttachment(index)}
											className="p-1 text-red-500 hover:bg-red-50 rounded"
										>
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
											</svg>
										</button>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				<div className="flex justify-end space-x-4">
					<button
						type="button"
						onClick={() => router.push('/admin/newsletter')}
						className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isLoading}
						className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm h-10 px-4 disabled:opacity-50"
					>
						{isLoading ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Newsletter')}
					</button>
				</div>
			</form>
		</div>
	);
}