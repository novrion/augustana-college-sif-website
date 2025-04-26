'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { getPostById, getRelatedPosts } from '../../services/postsService';

export default function NewsletterPost({ params }) {
	// Unwrap the params promise using React.use()
	const unwrappedParams = use(params);

	// Get the post data using the ID from the URL
	const post = getPostById(unwrappedParams.id);

	// Get related posts
	const relatedPosts = post ? getRelatedPosts(post.id) : [];

	// If post not found, display error message
	if (!post) {
		return (
			<div className="min-h-screen p-8 sm:p-20 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Newsletter not found</h1>
					<p className="mb-6">The newsletter post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
					<Link
						href="/newsletter"
						className="rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 transition-colors"
					>
						Back to Newsletters
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen p-8 sm:p-20">
			<div className="max-w-3xl mx-auto">
				{/* Back button */}
				<Link
					href="/newsletter"
					className="inline-flex items-center mb-6 text-blue-500 hover:underline"
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
						className="mr-2"
					>
						<line x1="19" y1="12" x2="5" y2="12"></line>
						<polyline points="12 19 5 12 12 5"></polyline>
					</svg>
					Back to Newsletters
				</Link>

				{/* Post header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-4 font-[family-name:var(--font-geist-mono)]">
						{post.title}
					</h1>

					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden mr-3">
								{/* Placeholder for author image */}
								<div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500">
									{post.author.charAt(0)}
								</div>
							</div>
							<div>
								<p className="font-medium">{post.author}</p>
								<p className="text-sm text-gray-500 dark:text-gray-400">{post.date}</p>
							</div>
						</div>

						{/* Share buttons */}
						<div className="flex gap-2">
							<button className="p-2 rounded-full hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]" aria-label="Share on Twitter">
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
								</svg>
							</button>
							<button className="p-2 rounded-full hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]" aria-label="Share on LinkedIn">
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
									<rect x="2" y="9" width="4" height="12"></rect>
									<circle cx="4" cy="4" r="2"></circle>
								</svg>
							</button>
							<button className="p-2 rounded-full hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]" aria-label="Copy Link">
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
									<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
								</svg>
							</button>
						</div>
					</div>
				</div>

				{/* Post content */}
				<div className="prose prose-lg max-w-none dark:prose-invert mb-12">
					<div dangerouslySetInnerHTML={{ __html: post.content }} />
				</div>

				{/* Related posts */}
				{relatedPosts.length > 0 && (
					<div className="border-t border-black/[.08] dark:border-white/[.145] pt-8 mt-8">
						<h3 className="text-xl font-semibold mb-6 font-[family-name:var(--font-geist-mono)]">
							Related Posts
						</h3>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{relatedPosts.map((relatedPost) => (
								<Link key={relatedPost.id} href={`/newsletter/${relatedPost.id}`}>
									<div className="p-6 rounded-lg border border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors">
										<h4 className="font-semibold mb-2">{relatedPost.title}</h4>
										<p className="text-sm text-gray-500 dark:text-gray-400">{relatedPost.date}</p>
									</div>
								</Link>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}