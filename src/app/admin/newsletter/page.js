'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNewPost, getAllPosts, deletePost } from '../../services/postsService';

export default function NewsletterAdmin() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		title: '',
		author: '',
		excerpt: '',
		content: ''
	});
	const [posts, setPosts] = useState(getAllPosts());
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [message, setMessage] = useState({ text: '', type: '' });

	// Handle form input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Validate form data
			if (!formData.title || !formData.author || !formData.content) {
				throw new Error('Please fill in all required fields');
			}

			// Create the new post
			const newPost = createNewPost(formData);

			// Update the UI
			setMessage({
				text: `Post "${newPost.title}" created successfully!`,
				type: 'success'
			});

			// Reset the form
			setFormData({
				title: '',
				author: '',
				excerpt: '',
				content: ''
			});

			// Refresh posts list
			setPosts(getAllPosts());

			// Refresh the page cache
			router.refresh();
		} catch (error) {
			setMessage({
				text: error.message || 'An error occurred while creating the post',
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

	// Handle post deletion
	const handleDelete = (id, title) => {
		if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
			deletePost(id);
			setPosts(getAllPosts());
			setMessage({
				text: `Post "${title}" deleted successfully!`,
				type: 'success'
			});

			// Refresh the page cache
			router.refresh();

			// Clear message after 5 seconds
			setTimeout(() => {
				setMessage({ text: '', type: '' });
			}, 5000);
		}
	};

	return (
		<div className="min-h-screen p-8 sm:p-20">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-2 font-[family-name:var(--font-geist-mono)]">
					Newsletter Admin
				</h1>
				<p className="text-lg mb-8">
					Create and manage newsletter posts.
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

				{/* Create post form */}
				<div className="mb-12 p-6 rounded-lg border border-black/[.08] dark:border-white/[.145]">
					<h2 className="text-xl font-semibold mb-6 font-[family-name:var(--font-geist-mono)]">
						Create New Post
					</h2>

					<form onSubmit={handleSubmit}>
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

							{/* Author */}
							<div>
								<label htmlFor="author" className="block mb-2 font-medium">
									Author <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									id="author"
									name="author"
									value={formData.author}
									onChange={handleChange}
									required
									className="w-full p-3 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							{/* Excerpt */}
							<div>
								<label htmlFor="excerpt" className="block mb-2 font-medium">
									Excerpt
								</label>
								<textarea
									id="excerpt"
									name="excerpt"
									value={formData.excerpt}
									onChange={handleChange}
									rows="2"
									className="w-full p-3 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="Brief summary of the post (optional)"
								></textarea>
							</div>

							{/* Content */}
							<div>
								<label htmlFor="content" className="block mb-2 font-medium">
									Content <span className="text-red-500">*</span>
								</label>
								<textarea
									id="content"
									name="content"
									value={formData.content}
									onChange={handleChange}
									rows="10"
									required
									className="w-full p-3 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder="HTML content is supported"
								></textarea>
							</div>

							{/* Submit button */}
							<button
								type="submit"
								disabled={isSubmitting}
								className={`rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
									}`}
							>
								{isSubmitting ? (
									<span className="flex items-center">
										Publishing
										<span className="ml-2 h-4 w-4 rounded-full border-2 border-t-transparent border-r-transparent animate-spin" />
									</span>
								) : (
									'Publish Post'
								)}
							</button>
						</div>
					</form>
				</div>

				{/* Manage existing posts */}
				<div>
					<h2 className="text-xl font-semibold mb-6 font-[family-name:var(--font-geist-mono)]">
						Manage Posts
					</h2>

					{posts.length > 0 ? (
						<div className="overflow-x-auto">
							<table className="w-full border-collapse">
								<thead>
									<tr className="bg-gray-100 dark:bg-gray-800">
										<th className="p-4 text-left">Title</th>
										<th className="p-4 text-left">Author</th>
										<th className="p-4 text-left">Date</th>
										<th className="p-4 text-right">Actions</th>
									</tr>
								</thead>
								<tbody>
									{posts.map((post) => (
										<tr
											key={post.id}
											className="border-b border-black/[.08] dark:border-white/[.145] hover:bg-gray-50 dark:hover:bg-gray-900"
										>
											<td className="p-4">{post.title}</td>
											<td className="p-4">{post.author}</td>
											<td className="p-4">{post.date}</td>
											<td className="p-4 text-right">
												<div className="flex justify-end gap-2">
													<a
														href={`/newsletter/${post.id}`}
														className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-500"
														title="View post"
														target="_blank"
														rel="noopener noreferrer"
													>
														<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
															<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
															<circle cx="12" cy="12" r="3"></circle>
														</svg>
													</a>
													<button
														onClick={() => handleDelete(post.id, post.title)}
														className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-red-500"
														title="Delete post"
													>
														<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
															<polyline points="3 6 5 6 21 6"></polyline>
															<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
															<line x1="10" y1="11" x2="10" y2="17"></line>
															<line x1="14" y1="11" x2="14" y2="17"></line>
														</svg>
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<div className="text-center p-8 border border-dashed border-black/[.08] dark:border-white/[.145] rounded-lg">
							<p>No posts found. Create your first post above!</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}