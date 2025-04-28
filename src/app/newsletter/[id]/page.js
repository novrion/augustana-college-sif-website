import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getNewsletterById } from '../../../lib/database';
import { BoxBase } from '../../../components/Boxes';

export async function generateMetadata(props) {
	// Properly await params
	const params = await props.params;
	const id = params.id;

	const newsletter = await getNewsletterById(id);

	if (!newsletter) {
		return {
			title: 'Newsletter Not Found | Augustana College SIF',
		};
	}

	return {
		title: `${newsletter.title} | Newsletter | Augustana College SIF`,
		description: `Newsletter from ${newsletter.date}: ${newsletter.title}`,
	};
}

export default async function NewsletterDetail(props) {
	// Properly await params
	const params = await props.params;
	const id = params.id;

	try {
		// Fetch newsletter by ID
		const newsletter = await getNewsletterById(id);

		if (!newsletter) {
			redirect('/newsletter');
		}

		// Format date
		const formattedDate = new Date(newsletter.date).toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});

		// Helper to determine if attachment is an image
		const isImageAttachment = (attachment) => {
			const type = attachment?.type || '';
			return type.startsWith('image/');
		};

		// Format file size
		const formatFileSize = (bytes) => {
			if (!bytes) return '';

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
			<div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-mono)]">
				<div className="max-w-4xl mx-auto">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold">
							Newsletter
						</h1>

						<Link
							href="/newsletter"
							className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm h-10 px-4"
						>
							Back to All Newsletters
						</Link>
					</div>

					<BoxBase className="mb-6" hoverEffect={false}>
						<h2 className="text-2xl font-semibold mb-4">
							{newsletter.title}
						</h2>

						{/* Changed from flex row to flex column layout */}
						<div className="flex flex-col mb-6 text-sm text-gray-500 dark:text-gray-400">
							<span className="mb-1">{formattedDate}</span>
							<span>{newsletter.author}</span>
						</div>

						{/* Content */}
						<div className="prose prose-sm max-w-none dark:prose-invert mb-8">
							{newsletter.content.split('\n').map((paragraph, index) => (
								<p key={index}>{paragraph}</p>
							))}
						</div>

						{/* Image Attachments Section */}
						{newsletter.attachments && newsletter.attachments.filter(isImageAttachment).length > 0 && (
							<div className="mb-8">
								<h3 className="text-lg font-semibold mb-4">Images</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
									{newsletter.attachments
										.filter(isImageAttachment)
										.map((attachment, index) => (
											<div key={index} className="rounded-lg overflow-hidden border border-black/[.08] dark:border-white/[.145]">
												<a
													href={attachment.url}
													target="_blank"
													rel="noopener noreferrer"
													className="block"
												>
													<div className="relative aspect-[4/3] w-full">
														<Image
															src={attachment.url}
															alt={attachment.originalName || attachment.name}
															fill
															className="object-cover"
														/>
													</div>
													<div className="p-2 text-sm truncate">
														{attachment.originalName || attachment.name}
													</div>
												</a>
											</div>
										))}
								</div>
							</div>
						)}

						{/* Other Attachments Section */}
						{newsletter.attachments && newsletter.attachments.filter(a => !isImageAttachment(a)).length > 0 && (
							<div>
								<h3 className="text-lg font-semibold mb-4">Attachments</h3>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									{newsletter.attachments
										.filter(a => !isImageAttachment(a))
										.map((attachment, index) => (
											<a
												key={index}
												href={attachment.url}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-3 p-3 border border-black/[.08] dark:border-white/[.145] rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
											>
												<div className="h-10 w-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
													<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
													</svg>
												</div>
												<div className="flex-1 min-w-0">
													<div className="font-medium truncate">
														{attachment.originalName || attachment.name}
													</div>
													<div className="text-xs text-gray-500">
														{formatFileSize(attachment.size)}
													</div>
												</div>
												<div className="text-blue-500">
													<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
														<path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
													</svg>
												</div>
											</a>
										))}
								</div>
							</div>
						)}
					</BoxBase>
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error loading newsletter:', error);
		redirect('/newsletter');
	}
}