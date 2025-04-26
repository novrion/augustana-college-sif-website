'use client';

import React, { useState } from 'react';
import { NewsletterBox } from '../components/Boxes';
import { getAllPosts } from '../services/postsService';

export default function Newsletter() {
	// Get posts from the service
	const allPosts = getAllPosts();

	// State for filtering and pagination
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const postsPerPage = 4;

	// Filter posts based on search term
	const filteredPosts = allPosts.filter(post =>
		post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
		post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
		post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Get current posts for pagination
	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

	// Calculate total pages
	const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

	// Handle page changes
	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		<div className="min-h-screen p-8 sm:p-20">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-2 font-[family-name:var(--font-geist-mono)]">
					SIF Newsletter
				</h1>
				<p className="text-lg mb-8">
					Market analyses, investment insights, and fund updates from our team.
				</p>

				{/* Search and filter */}
				<div className="mb-8">
					<div className="relative">
						<input
							type="text"
							placeholder="Search newsletters..."
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value);
								setCurrentPage(1); // Reset to first page on search
							}}
							className="w-full p-3 pl-10 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<svg
							className="absolute left-3 top-1/2 transform -translate-y-1/2"
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="11" cy="11" r="8"></circle>
							<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
						</svg>
					</div>
				</div>

				{/* Newsletter posts */}
				<div className="space-y-6">
					{currentPosts.length > 0 ? (
						currentPosts.map((post) => (
							<NewsletterBox
								key={post.id}
								id={post.id}
								title={post.title}
								date={post.date}
								author={post.author}
								excerpt={post.excerpt}
							/>
						))
					) : (
						<div className="text-center py-10">
							<p>No newsletters found matching your search criteria.</p>
						</div>
					)}
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="flex justify-center mt-8">
						<div className="flex items-center gap-2">
							<button
								onClick={() => paginate(currentPage - 1)}
								disabled={currentPage === 1}
								className={`w-10 h-10 flex items-center justify-center rounded-full ${currentPage === 1
									? 'text-gray-400 cursor-not-allowed'
									: 'hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]'
									}`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<polyline points="15 18 9 12 15 6"></polyline>
								</svg>
							</button>

							{[...Array(totalPages)].map((_, index) => (
								<button
									key={index}
									onClick={() => paginate(index + 1)}
									className={`w-10 h-10 rounded-full ${currentPage === index + 1
										? 'bg-blue-500 text-white'
										: 'hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]'
										}`}
								>
									{index + 1}
								</button>
							))}

							<button
								onClick={() => paginate(currentPage + 1)}
								disabled={currentPage === totalPages}
								className={`w-10 h-10 flex items-center justify-center rounded-full ${currentPage === totalPages
									? 'text-gray-400 cursor-not-allowed'
									: 'hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]'
									}`}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<polyline points="9 18 15 12 9 6"></polyline>
								</svg>
							</button>
						</div>
					</div>
				)}

				{/* Subscribe section */}
				<div className="mt-12 p-8 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-[#f8f8f8] dark:bg-[#0a0a0a]">
					<h3 className="text-xl font-semibold mb-4 font-[family-name:var(--font-geist-mono)]">
						Subscribe to Our Newsletter
					</h3>
					<p className="mb-6">
						Receive our latest investment insights directly in your inbox.
					</p>
					<div className="flex flex-col sm:flex-row gap-4">
						<input
							type="email"
							placeholder="Your email address"
							className="flex-grow p-3 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 transition-colors">
							Subscribe
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}