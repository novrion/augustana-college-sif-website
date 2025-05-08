'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Newsletter, Attachment } from '@/lib/types';
import Form from "@/components/Form";
import { FilledButton, EmptyButton } from "@/components/Buttons";
import { formatDateForInput, formatFileSize } from '@/lib/utils';

interface NewsletterFormProps {
	initialData?: Newsletter;
	isEditing?: boolean;
}

export default function NewsletterForm({
	initialData,
	isEditing = false
}: NewsletterFormProps) {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);

	const [formData, setFormData] = useState({
		title: initialData?.title || '',
		date: formatDateForInput(initialData?.date),
		author: initialData?.author || '',
		content: initialData?.content || '',
	});

	const [attachments, setAttachments] = useState<Attachment[]>(
		initialData?.attachments || []
	);

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

		setIsUploadingAttachment(true);

		try {
			const uploadedAttachments: Attachment[] = [];

			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const formData = new FormData();
				formData.append('file', file);

				if (isEditing && initialData?.id) {
					formData.append('newsletterId', initialData.id);
				}

				const response = await fetch('/api/admin/newsletter/attachment', {
					method: 'POST',
					body: formData,
				});

				if (!response.ok) {
					const data = await response.json();
					throw new Error(data.error || 'Failed to upload attachment');
				}

				const data = await response.json();
				uploadedAttachments.push(data);
			}

			setAttachments(prev => [...prev, ...uploadedAttachments]);

			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to upload attachment');
		} finally {
			setIsUploadingAttachment(false);
		}
	};

	const handleRemoveAttachment = async (attachment: Attachment) => {
		try {
			if (isEditing) {
				const response = await fetch(`/api/admin/newsletter/attachment?path=${encodeURIComponent(attachment.path)}`, {
					method: 'DELETE',
				});

				if (!response.ok) {
					const data = await response.json();
					throw new Error(data.error || 'Failed to delete attachment');
				}
			}

			setAttachments(prev => prev.filter(a => a.path !== attachment.path));
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to remove attachment');
		}
	};

	const getFileIconClass = (fileType: string): string => {
		if (fileType.startsWith('image/')) return 'text-green-500';
		if (fileType.includes('pdf')) return 'text-red-500';
		if (fileType.includes('word') || fileType.includes('document')) return 'text-blue-500';
		if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'text-green-700';
		return 'text-gray-500';
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError('');
		setSuccess('');

		try {
			const endpoint = isEditing
				? `/api/admin/newsletter/${initialData?.id}`
				: '/api/admin/newsletter';

			const method = isEditing ? 'PUT' : 'POST';

			const newsletterData = {
				...formData,
				attachments: attachments
			};

			const response = await fetch(endpoint, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newsletterData)
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to save newsletter');
			}

			setSuccess(isEditing ? 'Newsletter updated successfully!' : 'Newsletter created successfully!');

			// Redirect after a short delay
			setTimeout(() => {
				router.push('/admin/newsletter');
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
			title={isEditing ? "Edit Newsletter" : "Add Newsletter"}
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
					<label htmlFor="author" className="block text-sm font-medium mb-1">
						Author
					</label>
					<input
						id="author"
						name="author"
						type="text"
						value={formData.author}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

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
					<label htmlFor="content" className="block text-sm font-medium mb-1">
						Content
					</label>
					<textarea
						id="content"
						name="content"
						rows={15}
						value={formData.content}
						onChange={handleChange}
						className="w-full px-3 py-2 border border-white/[.145] rounded-md bg-transparent font-[family-name:var(--font-geist-sans)] focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div>
					<div className="flex justify-between items-center mb-2">
						<label className="block text-sm font-medium">
							Attachments
						</label>
						<EmptyButton
							onClick={handleFileSelect}
							text="Add Attachment"
							isLoading={isUploadingAttachment}
							loadingText="Uploading..."
							type="button"
						/>
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleFileChange}
							className="hidden"
							multiple
						/>
					</div>

					{attachments.length > 0 ? (
						<div className="border border-white/[.145] rounded-md p-2 max-h-60 overflow-y-auto">
							<ul className="divide-y divide-white/[.145]">
								{attachments.map((attachment, index) => (
									<li key={index} className="py-2 px-1 flex items-center justify-between">
										<div className="flex items-center">
											<div className={`mr-3 ${getFileIconClass(attachment.type)}`}>
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
												</svg>
											</div>
											<div className="truncate max-w-xs">
												<p className="text-sm truncate">{attachment.originalName || attachment.name}</p>
												<p className="text-xs text-gray-400">{formatFileSize(attachment.size || 0)}</p>
											</div>
										</div>
										<button
											type="button"
											onClick={() => handleRemoveAttachment(attachment)}
											className="text-red-500 hover:text-red-700 ml-2"
											title="Remove attachment"
										>
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
										</button>
									</li>
								))}
							</ul>
						</div>
					) : (
						<div className="text-center border border-white/[.145] rounded-md p-4 text-gray-400">
							No attachments added
						</div>
					)}
				</div>
			</div>

			<div className="flex justify-end gap-3 mt-6">
				<EmptyButton
					onClick={() => router.push('/admin/newsletter')}
					text="Cancel"
					isLoading={false}
					type="button"
				/>
				<FilledButton
					type="submit"
					text={isEditing ? 'Update Newsletter' : 'Add Newsletter'}
					loadingText="Saving..."
					isLoading={isSubmitting}
				/>
			</div>
		</Form>
	);
}